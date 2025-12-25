require('dotenv').config({ path: '../.env' }); // Adjust path to .env if running from scripts/
const prisma = require('../src/config/database');
const imageService = require('../src/services/imageService');
const logger = require('../src/config/logger');

async function backfillImages() {
    console.log("🚀 Starting Image Backfill Process...");

    try {
        // 1. Find news without images
        const newsList = await prisma.news.findMany({
            where: {
                OR: [
                    { imagePath: null },
                    { imagePath: "" }
                ]
            },
            orderBy: { date: 'desc' }
        });

        console.log(`📊 Found ${newsList.length} articles missing images.`);

        // 2. Process each
        for (const news of newsList) {
            console.log(`\n🎨 Generating image for: "${news.title}"`);

            try {
                // Generate Prompt
                const imagePrompt = await imageService.generateImagePrompt(news.summary);

                // Generate Image
                const imageBuffer = await imageService.generateImage(imagePrompt);

                // Save File
                const filename = `news_backfill_${news.id}_${Date.now()}.jpg`;
                const savedFilename = imageService.saveImage(imageBuffer, filename);
                const imagePath = `uploads/${savedFilename}`;

                // Update DB
                await prisma.news.update({
                    where: { id: news.id },
                    data: { imagePath: imagePath }
                });

                console.log(`✅ Saved: ${imagePath}`);

                // Delay to be nice to the API (Pollinations is free but let's not spam)
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (err) {
                console.error(`❌ Failed for ID ${news.id}: ${err.message}`);
            }
        }

        console.log("\n✨ Backfill Complete!");

    } catch (error) {
        console.error("🔥 Backfill Script Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

backfillImages();
