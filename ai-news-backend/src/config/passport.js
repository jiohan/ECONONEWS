const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./database');
const logger = require('./logger');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            logger.info(`Google Login attempt: ${profile.emails[0].value}`);

            // Find or Create User
            const user = await prisma.user.upsert({
                where: { googleId: profile.id }, // Google ID로 찾기
                update: {
                    name: profile.displayName,
                    avatar: profile.photos[0]?.value,
                },
                create: {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    googleId: profile.id,
                    avatar: profile.photos[0]?.value,
                    // Password is null
                }
            });

            return done(null, user);
        } catch (err) {
            logger.error(`Passport Error: ${err.message}`);
            return done(err, null);
        }
    }));

module.exports = passport;
