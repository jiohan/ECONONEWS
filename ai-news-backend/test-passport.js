
try {
    const passport = require('passport');
    console.log('passport loaded');
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    console.log('passport-google-oauth20 loaded');
} catch (e) {
    console.error(e);
}
