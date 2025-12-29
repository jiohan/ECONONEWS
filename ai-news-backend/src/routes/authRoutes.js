const express = require('express');
const passport = require('passport');
const router = express.Router();

// 1. Google 로그인 시작
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Google 로그인 콜백
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {
        // 성공 시 프론트엔드로 리다이렉트 (쿠키 세션 사용)
        res.redirect('http://localhost:5173/'); // Dashboard
    }
);

// 3. 현재 사용자 정보 (세션 확인)
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

// 4. 로그아웃
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.status(200).json({ message: 'Logged out' });
    });
});

// 5. User Details (Requested Feature)
const ensureAuthenticated = require('../middleware/auth');

router.get("/user/details", ensureAuthenticated, async (req, res) => {
    try {
        const user = req.user;

        console.log(`==> getting user data for ${user.email}`);
        res
            .status(201)
            .send({ error: false, user, message: "Getting user by token" });
    } catch (error) {
        console.log("==> getting user Error", error);
        res
            .status(500)
            .send({ error: true, user: "Server error", message: error.message });
    }
});

module.exports = router;
