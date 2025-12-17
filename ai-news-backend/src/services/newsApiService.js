// NewsAPI를 사용하여 최신 경제 뉴스를 검색하고, Cheerio로 본문을 스크래핑하는 서비스

const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../config/logger');

const NEWS_API_URL = 'https://newsapi.org/v2/everything';

/**
 * NewsAPI에서 경제 뉴스 가져오기
 * @param {string[]} excludedTitles - 제외할 뉴스 제목 목록
 * @returns {Promise<Object>} - { content: string, url: string, title: string, date: string }
 */
const fetchDailyNews = async (excludedTitles = []) => {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        throw new Error('NEWS_API_KEY is missing in .env');
    }

    try {
        logger.info('📰 NewsAPI에 경제 뉴스 요청 중...');

        // 1. 뉴스 목록 가져오기 (한국어, 경제 키워드)
        const response = await axios.get(NEWS_API_URL, {
            params: {
                q: '경제', // 키워드 검색
                language: 'ko',
                sortBy: 'publishedAt',
                apiKey: apiKey,
                pageSize: 20, // 넉넉히 가져와서 필터링 (n8n 체크 리밋과 유사)
            }
        });

        if (response.data.status !== 'ok') {
            throw new Error(`NewsAPI Error: ${response.data.message}`);
        }

        const articles = response.data.articles;
        logger.info(`✅ NewsAPI: ${articles.length}개의 기사 발견`);

        // 2. 필터링 (제외 제목 & 삭제된 기사 제외)
        const candidates = articles.filter(article => {
            // 제목이 없거나 '[Removed]'인 경우 제외
            if (!article.title || article.title === '[Removed]') return false;

            // 이미 DB에 있는 제목인지 확인
            // excludedTitles는 문자열 배열 ["제목1", "제목2"] 또는 긴 문자열일 수 있음
            // 여기서는 배열이라고 가정하고 처리
            const isExcluded = Array.isArray(excludedTitles)
                ? excludedTitles.some(t => article.title.includes(t) || t.includes(article.title))
                : (excludedTitles.includes(article.title));

            return !isExcluded;
        });

        if (candidates.length === 0) {
            logger.warn('⚠️ 새로운 뉴스가 없습니다 (모두 제외됨).');
            return null; // 호출자가 처리
        }

        // 3. 최신 뉴스 1건 선택
        const targetNews = candidates[0];
        logger.info(`🎯 선택된 뉴스: ${targetNews.title}`);

        // 4. 본문 스크래핑 (NewsAPI는 내용이 잘리므로 원문에서 가져옴)
        let fullContent = await scrapeArticle(targetNews.url);

        // 만약 스크래핑 실패하거나 내용이 너무 짧으면 NewsAPI 설명 사용
        if (fullContent.length < 200) {
            logger.warn('⚠️ 스크래핑 내용이 부족하여 NewsAPI description 사용');
            fullContent = `${targetNews.title}\n\n${targetNews.description || ''}\n\n${targetNews.content || ''}`;
        }

        return {
            content: fullContent,
            title: targetNews.title,
            url: targetNews.url,
            date: targetNews.publishedAt, // ISO format
        };

    } catch (error) {
        logger.error(`❌ NewsAPI 프로세스 실패: ${error.message}`);
        throw error;
    }
};

/**
 * URL에서 본문 텍스트 추출 (Cheerio)
 */
const scrapeArticle = async (url) => {
    try {
        logger.info(`🕷️ Scraper: 원문 접속 시도 (${url})`);

        // 타임아웃 5초 설정
        const response = await axios.get(url, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // 불필요한 요소 제거
        $('script').remove();
        $('style').remove();
        $('header').remove();
        $('footer').remove();
        $('nav').remove();
        $('.advertising').remove();

        // 본문 추정 (일반적인 태그)
        // 네이버 뉴스, 다음 뉴스 등 한국 주요 사이트 타겟팅
        const articleBody =
            $('#dic_area').text() || // 네이버
            $('.article_view').text() || // 다음
            $('article').text() ||
            $('.content').text() ||
            $('body').text();

        const cleanText = articleBody.replace(/\s+/g, ' ').trim();
        return cleanText.substring(0, 5000); // 너무 길면 자름 (Gemini 토큰 절약)

    } catch (error) {
        logger.warn(`⚠️ 스크래핑 실패 (${url}): ${error.message}`);
        return '';
    }
};

module.exports = {
    fetchDailyNews,
};
