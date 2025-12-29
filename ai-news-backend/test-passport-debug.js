
try {
    console.log('1. require passport');
    const passport = require('passport');
    console.log('2. require google strategy');
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    console.log('3. require database');
    const prisma = require('./src/config/database');
    console.log('4. require logger');
    const logger = require('./src/config/logger');

    console.log('5. instantiate strategy');
    const strategy = new GoogleStrategy({
        clientID: 'test',
        clientSecret: 'test',
        callbackURL: '/cb'
    }, () => { });
    console.log('6. strategy instantiated');

    console.log('7. passport use');
    passport.use(strategy);
    console.log('8. DONE');

} catch (e) {
    console.error('CRASHED at step');
    console.error(e);
}
