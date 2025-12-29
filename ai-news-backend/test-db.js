
try {
    const prisma = require('./src/config/database');
    console.log('database ok');
} catch (e) {
    console.error(e);
}
