// Controller: 뉴스 데이터를 받아서 처리하고, DB에 저장/조회하는 로직

const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * 🟢 GET /api/news
 * 저장된 뉴스 모두 조회 (최신순 정렬, 페이지네이션)
 */
const getAllNews = async (req, res, next) => {
    try {
        // 쿼리 파라미터에서 페이지 정보 받기
        const page = Math.max(1, parseInt(req.query.page) || 1);  // 최소값: 1
        const limit = 10;                                          // 한 번에 10개씩
        const skip = (page - 1) * limit;                          // 스킵할 데이터 개수

        // 전체 뉴스 개수 확인 (페이지 계산용)
        const total = await prisma.news.count();

        // 뉴스 조회 (날짜 내림차순, 최신순으로 정렬)
        const newsRaw = await prisma.news.findMany({
            orderBy: {
                date: 'desc',  // 최신 뉴스가 먼저
            },
            skip: skip,
            take: limit,
            include: {
                terms: {
                    include: {
                        term: true,
                    },
                },
            },
        });

        // 프론트엔드 포맷에 맞게 변환 (Relations Flattening)
        const news = newsRaw.map(item => ({
            ...item,
            terms: item.terms.map(t => ({
                id: t.term.id,
                name: t.term.name,
                definition: t.term.definition,
                explanation: t.term.explanation
            }))
        }));

        // 성공 응답
        res.json({
            success: true,
            data: news,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        });

        logger.info(`📰 뉴스 조회 성공: 페이지 ${page}, ${news.length}개 항목`);
    } catch (error) {
        logger.error(`❌ 뉴스 조회 실패: ${error.message}`);
        next(error);  // 에러 핸들러로 전달
    }
};

/**
 * 🟡 POST /api/news
 * n8n에서 보낸 뉴스를 DB에 저장 (중복 방지)
 * ⭐ API Key 검증 필요 (향후 추가)
 */
const createNews = async (req, res, next) => {
    try {
        const {
            title,
            url,
            date,
            summary,
            keyMetrics,
            sourceUrl,
            terms,  // 배열로 들어옴: [{name, definition, explanation}, ...]
        } = req.body;

        // 필수 필드 검증 (middleware에서도 하지만, 여기서 한 번 더)
        if (!title || !url || !date || !summary) {
            return res.status(400).json({
                success: false,
                error: '필수 필드 누락',
                required: ['title', 'url', 'date', 'summary'],
            });
        }

        // ⭐ Upsert 사용: URL이 이미 있으면 업데이트, 없으면 생성
        // 이렇게 하면 n8n에서 중복 뉴스를 여러 번 보내도 DB에는 1번만 저장됨
        const newsData = {
            title,
            url,
            date: new Date(date),
            summary,
            keyMetrics: keyMetrics || null,
            sourceUrl: sourceUrl || null,
            // JSON 필드로 저장 (개수 제한 없음)
            terms: terms && Array.isArray(terms) ? terms : null,
        };

        // Upsert: URL을 기준으로 중복 체크
        const news = await prisma.news.upsert({
            where: { url },  // ⭐ URL이 유니크하므로, 이것을 기준으로 검색
            update: {
                // 기존 데이터 업데이트 (제목은 제외)
                summary: newsData.summary,
                keyMetrics: newsData.keyMetrics,
                terms: newsData.terms,
                date: newsData.date,
            },
            create: newsData,  // 없으면 새로 생성
        });

        res.status(201).json({
            success: true,
            message: '뉴스 저장 성공',
            data: news,
        });

        logger.info(`✅ 뉴스 저장: "${news.title}" (ID: ${news.id})`);
    } catch (error) {
        logger.error(`❌ 뉴스 저장 실패: ${error.message}`);
        next(error);  // 에러 핸들러로 전달
    }
};

/**
 * 🔵 GET /api/news/:id
 * 특정 뉴스 1개 조회
 */
const getNewsById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // ID 유효성 확인
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: '유효하지 않은 뉴스 ID',
            });
        }

        const newsRaw = await prisma.news.findUnique({
            where: { id: parseInt(id) },
            include: {
                terms: {
                    include: {
                        term: true,
                    },
                },
            },
        });

        if (!newsRaw) {
            return res.status(404).json({
                success: false,
                error: '뉴스를 찾을 수 없습니다',
                id: parseInt(id),
            });
        }

        const news = {
            ...newsRaw,
            terms: newsRaw.terms.map(t => ({
                id: t.term.id,
                name: t.term.name,
                definition: t.term.definition,
                explanation: t.term.explanation
            }))
        };

        res.json({
            success: true,
            data: news,
        });

        logger.info(`🔍 뉴스 조회: ID ${id}`);
    } catch (error) {
        logger.error(`❌ 뉴스 조회 실패: ${error.message}`);
        next(error);
    }
};

/**
 * 🔴 DELETE /api/news/:id
 * 뉴스 삭제
 */
const deleteNews = async (req, res, next) => {
    try {
        const { id } = req.params;

        // ID 유효성 확인
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: '유효하지 않은 뉴스 ID',
            });
        }

        const deletedNews = await prisma.news.delete({
            where: { id: parseInt(id) },
        });

        res.json({
            success: true,
            message: '뉴스 삭제 완료',
            data: deletedNews,
        });

        logger.info(`🗑️ 뉴스 삭제: "${deletedNews.title}" (ID: ${deletedNews.id})`);
    } catch (error) {
        logger.error(`❌ 뉴스 삭제 실패: ${error.message}`);
        next(error);
    }
};

module.exports = {
    getAllNews,
    createNews,
    getNewsById,
    deleteNews,
};
