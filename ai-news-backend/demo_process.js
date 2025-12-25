require('dotenv').config();
const newsApiService = require('./src/services/newsApiService');
const aiService = require('./src/services/aiService');
const imageService = require('./src/services/imageService');
const prisma = require('./src/config/database');


async function main() {
    console.log("🚀 Starting Full News Generation Process Demo...");

    try {
        // 1. Fetch News (Real Input)
        console.log("📰 Fetching latest news from NewsAPI...");

        // Fallback for NewsAPI Key if .env fails
        if (!process.env.NEWS_API_KEY) {
            console.warn("⚠️ NEWS_API_KEY not found in .env, using fallback key for demo.");
            process.env.NEWS_API_KEY = '9028e5e51618486d9169da005477883b';
        }

        // We can pass excluded titles if we wanted to avoid redundancy, but for demo we pass empty array
        const rawNews = await newsApiService.fetchDailyNews([]);

        if (!rawNews) {
            console.log("⚠️ No new news found.");
            return;
        }

        console.log(`\n📄 Fetched Article: "${rawNews.title}"`);
        console.log(`🔗 URL: ${rawNews.url}`);
        console.log(`📝 Content Length: ${rawNews.content.length} chars`);

        // 2. Analyze with AI
        console.log("\n🤖 Asking Gemini to analyze news content...");
        const analyzed = await aiService.analyzeNews(rawNews.content);

        // 3. Refine with Critic
        console.log("🧐 Asking Critic to refine analysis...");
        const refined = await aiService.refineAnalysis(analyzed);

        // 4. Output Result
        console.log("\n✅ AI Generation Final Result:");
        const result = refined[0];
        console.log(`TITLE: ${result.title}`);
        console.log(`SUMMARY: ${result.summary}`);
        console.log(`METRICS: ${result.key_metrics}`);
        console.log(`TERMS: ${result.terms.map(t => t.term).join(', ')}`);

        // 4-1. Generate Image (NEW)
        console.log("\n🎨 Generating AI Image...");
        let imagePath = null;
        try {
            const imagePrompt = await imageService.generateImagePrompt(result.summary);
            const imageBuffer = await imageService.generateImage(imagePrompt);
            const filename = `news_demo_${Date.now()}.jpg`;
            const savedFilename = imageService.saveImage(imageBuffer, filename);
            imagePath = `uploads/${savedFilename}`;
            console.log(`🖼️ Image Created: ${imagePath}`);
        } catch (err) {
            console.error(`⚠️ Image Generation Failed: ${err.message}`);
        }

        // 5. Save to DB
        console.log("\n💾 Saving to Database...");
        const savedNews = await prisma.news.create({
            data: {
                title: result.title,
                url: result.source_url || rawNews.url, // Use AI's returned URL or fallback to source
                date: new Date(result.date),
                summary: result.summary,
                keyMetrics: result.key_metrics,
                sourceUrl: rawNews.url,
                imagePath: imagePath, // Save image path
                terms: {
                    create: result.terms.map(t => ({
                        term: {
                            connectOrCreate: {
                                where: { name: t.term },
                                create: {
                                    name: t.term,
                                    definition: t.definition,
                                    explanation: t.explanation
                                }
                            }
                        }
                    }))
                }
            }
        });


        console.log(`🎉 Successfully saved with ID: ${savedNews.id}`);
        console.log("👉 Check your dashboard to see the new item!");

    } catch (error) {
        console.error("❌ Process Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
