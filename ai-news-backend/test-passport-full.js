
require('dotenv').config();
console.log('CLIENT_ID present:', !!process.env.GOOGLE_CLIENT_ID);
try {
    const passportConfig = require('./src/config/passport');
    console.log('passport config ok');
} catch (e) {
    console.error('FULL ERROR STACK:');
    console.error(e);
}
