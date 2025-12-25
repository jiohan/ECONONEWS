// 뉴스 수집 -> 분석 -> 저장의 전체 흐름을 관리하는 오케스트레이터 서비스

const prisma = require('../config/database');
const logger = require('../config/logger');
const newsApiService = require('./newsApiService');
const aiService = require('./aiService');
const imageService = require('./imageService');



/**
 * 일일 뉴스 브리핑 생성 프로세스 실행
 */
const processDailyNews = async () => {
    logger.info('🚀 일일 뉴스 처리 프로세스 시작');

    try {
        // 1. 최근 뉴스 제목 가져오기 (중복 방지용)
        const recentNews = await prisma.news.findMany({
            orderBy: { createdAt: 'desc' },
            take: 15,
            select: { title: true }
        });
        const excludedTitles = recentNews.map(n => `"${n.title}"`).join(', ');


        // 2. NewsAPI로 뉴스 검색 및 스크래핑
        // excludedTitles는 문자열 배열로 변환해서 전달할 수도 있지만, 여기서는 join된 문자열도 호환되게 처리
        const newsData = await newsApiService.fetchDailyNews(recentNews.map(n => n.title));

        if (!newsData) {
            logger.info('🛑 처리를 중단합니다 (새로운 뉴스 없음).');
            return [];
        }

        // 3. AI Agent (Gemini)로 분석
        // AI에게는 "본문 텍스트"만 주어서 분석하게 함
        const analyzedResults = await aiService.analyzeNews(newsData.content);

        // 4. Critic Agent로 정제
        const refinedResults = await aiService.refineAnalysis(analyzedResults);


        // 5. DB 저장
        const savedResults = [];

        // AI가 반환한 배열(보통 1개)을 순회
        for (const item of refinedResults) {
            // NewsAPI의 정확한 메타데이터로 덮어쓰기 (AI 환각 방지)
            // 단, 요약(summary)과 용어(terms)는 AI 결과 사용
            const finalTitle = newsData.title || item.title;
            const finalUrl = newsData.url || item.source_url;
            const finalDate = newsData.date ? new Date(newsData.date) : new Date(item.date);

            // 🖌️ 5-0. AI 이미지 생성 (추가됨)
            let imagePath = null;
            try {
                logger.info('🎨 뉴스 이미지 생성 중...');
                const imagePrompt = await imageService.generateImagePrompt(item.summary);
                const imageBuffer = await imageService.generateImage(imagePrompt);
                // 파일명: news_날짜_시간.jpg
                const filename = `news_${Date.now()}.jpg`;
                const savedFilename = imageService.saveImage(imageBuffer, filename);
                imagePath = `uploads/${savedFilename}`;
            } catch (imgError) {
                logger.error(`⚠️ 이미지 생성 실패 (건너뜀): ${imgError.message}`);
                // 이미지가 없어도 뉴스는 저장
            }

            // 5-1. 뉴스 저장 (Upsert)
            const news = await prisma.news.upsert({
                where: { url: finalUrl },
                update: {
                    title: finalTitle,
                    summary: item.summary,
                    keyMetrics: item.key_metrics,
                    date: finalDate,
                    ...(imagePath ? { imagePath } : {}), // 이미지가 생성되었을 때만 업데이트 (기존 이미지 보존)
                },
                create: {
                    title: finalTitle,
                    url: finalUrl,
                    summary: item.summary,
                    keyMetrics: item.key_metrics,
                    sourceUrl: finalUrl,
                    date: finalDate,
                    imagePath: imagePath, // 생성 시 이미지 경로 추가
                }
            });


            // 5-2. Terms 처리 (Global Deduplication)
            if (item.terms && Array.isArray(item.terms)) {
                for (const t of item.terms) {
                    // 용어 Upsert (이름으로 찾아서 있으면 ID 가져옴)
                    const term = await prisma.term.upsert({
                        where: { name: t.term },
                        update: {
                            // 용어 설명은 최신 버전으로 업데이트할지, 유지할지 결정 필요
                            // 여기서는 최신 설명으로 업데이트
                            definition: t.definition,
                            explanation: t.explanation,
                        },
                        create: {
                            name: t.term,
                            definition: t.definition,
                            explanation: t.explanation,
                        }
                    });

                    // 뉴스-용어 연결 (이미 연결되어 있는지 확인 후 연결)
                    // 복합 키 제약 조건 에러 방지를 위해 try-catch 또는 ignoreDuplicates 비슷한 로직 필요
                    // Prisma createMany는 relation에 사용 불가
                    try {
                        await prisma.newsTerm.create({
                            data: {
                                newsId: news.id,
                                termId: term.id
                            }
                        });
                    } catch (e) {
                        // P2002: 이미 연결된 경우 무시
                        if (e.code !== 'P2002') {
                            logger.warn(`용어 연결 실패 (${news.title} - ${term.name}): ${e.message}`);
                        }
                    }
                }
            }
            savedResults.push(news);
        }

        logger.info(`✅ 프로세스 완료: ${savedResults.length}건의 뉴스 저장됨`);
        return savedResults;

    } catch (error) {
        logger.error(`🔥 프로세스 실패: ${error.message}`);
        throw error;
    }
};

module.exports = {
    processDailyNews,
};
