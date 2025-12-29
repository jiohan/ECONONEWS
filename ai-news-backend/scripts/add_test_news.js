
// scripts/add_test_news.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Adding test news item...');
    const news = await prisma.newsItem.create({
        data: {
            title: 'Test Notification: Updates at ' + new Date().toLocaleTimeString(),
            originalUrl: 'https://example.com',
            imageUrl: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&q=80',
            summary: 'This is a test news item to verify the notification system red dot.',
            category: 'Test',
            publishedAt: new Date(),
            crawledAt: new Date(),
            status: 'processed'
        },
    });
    console.log('Created news item:', news.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
