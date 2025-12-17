// Express 서버: 모든 미들웨어, 라우트, 에러 핸들링을 연결하는 진입점

require('dotenv').config();  // ⭐ .env 파일 로드 (반드시 맨 위에!)

const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const newsRoutes = require('./routes/newsRoutes');
const { validateNewsInput } = require('./middleware/validation');

// AI News Backend Phase 4: Import Service & Cron
const cron = require('node-cron');
const newsService = require('./services/newsService');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 1️⃣ CORS 설정 (프론트엔드 접근 제어)
// ============================================

// 허용할 도메인 목록
const allowedOrigins = (
    process.env.CORS_ORIGIN || 'http://localhost:3001'
).split(',').map(origin => origin.trim());

// CORS 미들웨어 (환경별로 다르게 설정)
app.use(cors({
    origin: (origin, callback) => {
        // origin이 없으면 (curl, Postman 등) 허용
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // 허용되지 않은 도메인
            logger.warn(`⚠️ CORS 거부: ${origin}`);
            callback(new Error(`CORS not allowed: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    optionsSuccessStatus: 200,
}));

// ============================================
// 2️⃣ 기본 미들웨어
// ============================================

// JSON 요청 바디 파싱 (n8n에서 JSON으로 보내는 데이터를 읽기 위함)
app.use(express.json({ limit: '10mb' }));  // 최대 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// ============================================
// 3️⃣ 헬스 체크 엔드포인트
// ============================================
// Docker / 로드 밸런서가 서버 상태를 확인할 때 사용

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});

// ============================================
// 4️⃣ AI 뉴스 수동 트리거 및 스케줄러 (Phase 4)
// ============================================
// 주의: 404 핸들러보다 앞에 정의해야 함

// 수동 트리거 엔드포인트
app.post('/api/news/trigger', async (req, res) => {
    try {
        // 비동기로 실행하거나, 결과를 기다릴지 결정. 보통 20초 넘으면 타임아웃 위험.
        // 여기서는 결과를 기다려봄 (Perplexity+Gemini가 빠르면 10~20초)
        const result = await newsService.processDailyNews();
        res.json({ success: true, count: result.length, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 매일 오전 9시에 실행 (n8n 스케줄과 동일)
cron.schedule('0 9 * * *', async () => {
    logger.info('⏰ Cron 작업 시작: 일일 뉴스 브리핑');
    try {
        await newsService.processDailyNews();
    } catch (e) {
        logger.error('Cron 작업 실패');
    }
});

// ============================================
// 5️⃣ API 라우트 등록
// ============================================

// 뉴스 API 라우트
app.use('/api', newsRoutes);

// ============================================
// 6️⃣ 404 처리 (정의되지 않은 라우트)
// ============================================

app.use((req, res, next) => {
    logger.warn(`⚠️ 404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: '찾을 수 없는 엔드포인트',
        method: req.method,
        path: req.path,
        availableEndpoints: [
            'GET /health',
            'GET /api/news',
            'POST /api/news',
            'GET /api/news/:id',
            'DELETE /api/news/:id',
            'POST /api/news/trigger'
        ],
    });
});

// ============================================
// 7️⃣ 글로벌 에러 핸들러
// ============================================
// (모든 라우트 등록 후 마지막에 추가)

app.use(errorHandler);

// ============================================
// 8️⃣ 서버 시작
// ============================================

const server = app.listen(PORT, () => {
    logger.info(`✅ Express 서버 시작됨: http://localhost:${PORT}`);
    logger.info(`🔍 헬스 체크: http://localhost:${PORT}/health`);
    logger.info(`📚 API 문서: http://localhost:${PORT}/api/news`);
    logger.info(`🌍 CORS 허용 도메인: ${allowedOrigins.join(', ')}`);
    logger.info(`📝 환경: ${process.env.NODE_ENV}`);
});

// ============================================
// 9️⃣ 에러 처리 (비동기 에러, 미처리 rejection)
// ============================================

// Promise Rejection 처리
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`🚨 처리되지 않은 Promise Rejection`, {
        reason: String(reason),
        promise: promise.toString(),
    });
});

// Exception 처리 (즉시 프로세스 종료)
process.on('uncaughtException', (error) => {
    logger.error(`🚨 처리되지 않은 Exception: ${error.message}`, {
        stack: error.stack,
    });
    process.exit(1);  // 심각한 에러면 프로세스 종료
});

// 서버 종료 시 정리
process.on('SIGTERM', async () => {
    logger.info('📴 SIGTERM 신호 수신, 서버를 종료합니다');
    server.close(async () => {
        logger.info('✅ 서버 종료 완료');
        process.exit(0);
    });
});

module.exports = app;
