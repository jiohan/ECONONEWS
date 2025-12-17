// Routes: API URL 경로와 해당 Controller를 연결

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { validateNewsInput } = require('../middleware/validation');

// 📰 뉴스 관련 API
// GET: 모든 뉴스 조회
router.get('/news', newsController.getAllNews);

// POST: 뉴스 생성 (n8n에서 호출) - 입력 검증 미들웨어 추가
router.post('/news', validateNewsInput, newsController.createNews);

// GET: 특정 뉴스 1개 조회
router.get('/news/:id', newsController.getNewsById);

// DELETE: 뉴스 삭제
router.delete('/news/:id', newsController.deleteNews);

module.exports = router;
