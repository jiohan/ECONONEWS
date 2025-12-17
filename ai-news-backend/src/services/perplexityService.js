// Perplexity API를 사용하여 최신 경제 뉴스를 검색하는 서비스

const axios = require('axios');
const logger = require('../config/logger');
const PROMPTS = require('../config/prompts');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

/**
 * Perplexity API를 호출하여 뉴스 검색
 * @param {string} excludedTitles - 제외할 뉴스 제목들 (중복 방지용)
 * @returns {Promise<string>} - 검색 결과 텍스트 (Raw Text)
 */
const fetchDailyNews = async (excludedTitles = '없음') => {
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
        throw new Error('PERPLEXITY_API_KEY is missing in .env');
    }

    // 프롬프트 변수 치환
    const userPrompt = PROMPTS.SEARCH_NEWS.user.replace('{{excluded_titles}}', excludedTitles);

    try {
        logger.info('🤖 Perplexity에 뉴스 검색 요청 중...');

        // API 호출 (n8n 설정 준수: sonar-pro 모델)
        const response = await axios.post(PERPLEXITY_API_URL, {
            model: 'sonar-pro',
            messages: [
                { role: 'system', content: PROMPTS.SEARCH_NEWS.system },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 3000,
            temperature: 0.2, // n8n 설정값
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });

        const content = response.data.choices[0].message.content;
        logger.info('✅ Perplexity 응답 수신 완료');
        return content;

    } catch (error) {
        logger.error(`❌ Perplexity 검색 실패: ${error.message}`);
        if (error.response) {
            logger.error(`응답 상세: ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
};

module.exports = {
    fetchDailyNews,
};
