
try {
    require('dotenv').config();
    console.log('dotenv ok');
    require('express');
    console.log('express ok');
    require('cors');
    console.log('cors ok');
    require('./src/config/logger');
    console.log('logger ok');
    require('./src/middleware/errorHandler');
    console.log('errorHandler ok');
    require('./src/routes/newsRoutes');
    console.log('newsRoutes ok');
    require('./src/middleware/validation');
    console.log('validation ok');
    require('node-cron');
    console.log('node-cron ok');
    require('express-session');
    console.log('express-session ok');
    require('./src/config/passport');
    console.log('passport config ok');
    require('./src/routes/authRoutes');
    console.log('authRoutes ok');

    // Check newsService last as it might be complex
    require('./src/services/newsService');
    console.log('newsService ok');

} catch (e) {
    console.error('FAILED at step');
    console.error(e);
}
