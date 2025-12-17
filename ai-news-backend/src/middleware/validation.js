// n8n에서 보낸 데이터가 올바른 형식인지 확인

const logger = require('../config/logger');

/**
 * 뉴스 생성 시 필수 필드 검증 미들웨어
 * POST /api/news 요청 전에 실행됨
 */
const validateNewsInput = (req, res, next) => {
    const { title, url, date, summary } = req.body;

    // 1️⃣ 필수 필드 존재 여부 확인
    if (!title || !url || !date || !summary) {
        logger.warn(`⚠️ 뉴스 생성 요청에 필수 필드 누락`, {
            received: Object.keys(req.body),
            missing: [],
        });

        return res.status(400).json({
            success: false,
            error: '필수 필드 누락',
            required: ['title', 'url', 'date', 'summary'],
            received: Object.keys(req.body),
        });
    }

    // 2️⃣ 유효한 URL 형식 확인
    try {
        new URL(url);  // URL 생성자로 검증
    } catch {
        logger.warn(`⚠️ 잘못된 URL 형식: ${url}`);
        return res.status(400).json({
            success: false,
            error: 'URL 형식이 잘못되었습니다',
            example: 'https://example.com/news',
            received: url,
        });
    }

    // 3️⃣ 유효한 날짜 확인
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        logger.warn(`⚠️ 잘못된 날짜 형식: ${date}`);
        return res.status(400).json({
            success: false,
            error: '날짜 형식이 잘못되었습니다',
            example: '2025-12-08 또는 2025-12-08T12:00:00Z',
            received: date,
        });
    }

    // 4️⃣ 문자열 길이 확인 (매우 긴 입력 방지)
    if (title.length > 500) {
        return res.status(400).json({
            success: false,
            error: '제목이 너무 깁니다 (최대 500자)',
            received: title.length,
        });
    }

    if (summary.length > 10000) {
        return res.status(400).json({
            success: false,
            error: '요약이 너무 깁니다 (최대 10000자)',
            received: summary.length,
        });
    }

    // ✅ 모든 검증 통과
    next();
};

module.exports = {
    validateNewsInput,
};
