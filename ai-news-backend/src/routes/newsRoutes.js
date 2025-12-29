// Routes: API URL 경로와 해당 Controller를 연결

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { validateNewsInput } = require('../middleware/validation');

const ensureAuthenticated = require('../middleware/auth');

// 📰 뉴스 관련 API
// GET: 모든 뉴스 조회 (로그인 필요)
router.get('/news', ensureAuthenticated, newsController.getAllNews);

// POST: 뉴스 생성 (n8n에서 호출) - 입력 검증 미들웨어 추가 (인증 제외? n8n은 API 키 등을 써야함. 일단은 제외)
// 만약 n8n도 인증해야 한다면 다른 방식 필요. 지금은 웹 접근만 막으면 됨.
router.post('/news', validateNewsInput, newsController.createNews);

// GET: 특정 뉴스 1개 조회 (로그인 필요)
router.get('/news/:id', ensureAuthenticated, newsController.getNewsById);

// DELETE: 뉴스 삭제 (로그인 필요)
router.delete('/news/:id', ensureAuthenticated, newsController.deleteNews);

module.exports = router;
