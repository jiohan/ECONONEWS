// 모든 에러를 한 곳에서 처리하는 미들웨어
// Prisma 특정 에러를 자동으로 감지하고 적절한 HTTP 상태 코드 반환

const logger = require('../config/logger');

/**
 * Express 에러 미들웨어
 * 4개 파라미터를 받으면 Express가 자동으로 에러 핸들러로 인식
 * @param {Error} err - 에러 객체
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어
 */
const errorHandler = (err, req, res, next) => {
    // Prisma 에러 감지 (Prisma 에러는 err.code 필드 사용)
    const isPrismaError = err.code?.startsWith('P');

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || '서버 에러 발생';

    // Prisma 특정 에러 처리
    if (isPrismaError) {
        if (err.code === 'P2002') {
            // 유니크 제약 조건 위반
            statusCode = 400;
            message = '중복된 데이터입니다 (URL이 이미 존재합니다)';
        } else if (err.code === 'P2025') {
            // 레코드를 찾을 수 없음 (DELETE, UPDATE 시)
            statusCode = 404;
            message = '찾을 수 없는 데이터입니다';
        } else if (err.code === 'P1000') {
            // 데이터베이스 연결 실패
            statusCode = 503;
            message = '데이터베이스에 연결할 수 없습니다';
        }
    }

    // 발생한 에러 로깅
    logger.error(`🚨 [${statusCode}] ${message}`, {
        code: isPrismaError ? err.code : undefined,
        method: req.method,
        path: req.path,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    // 에러 응답 포맷 통일
    res.status(statusCode).json({
        success: false,
        error: message,
        code: isPrismaError ? err.code : undefined,
        timestamp: new Date().toISOString(),
        path: req.path,
        // 개발 환경에서만 스택 트레이스 포함
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
