require('dotenv').config();
const fs = require('fs');
const newsApiService = require('./src/services/newsApiService');
const aiService = require('./src/services/aiService');
const prisma = require('./src/config/database');

const LOG_FILE = 'demo_output.log';

function log(message) {
    console.log(message);
    fs.appendFileSync(LOG_FILE, message + '\n');
}

async function main() {
    fs.writeFileSync(LOG_FILE, '--- STARTING DEMO ---\n');
    log("🚀 Starting Full News Generation Process Demo...");

    try {
        if (!process.env.NEWS_API_KEY) {
            log("⚠️ NEWS_API_KEY not found in .env.");
        }

        // Check Google Key
        if (!process.env.GEMINI_API_KEY) {
            log("⚠️ GEMINI_API_KEY is missing! Process will likely fail.");
        }

        log("📰 Fetching latest news from NewsAPI...");
        const rawNews = await newsApiService.fetchDailyNews([]);

        if (!rawNews) {
            log("⚠️ No new news found.");
            return;
        }

        log(`\n📄 Fetched Article: "${rawNews.title}"`);
        log(`🔗 URL: ${rawNews.url}`);

        log("\n🤖 Asking Gemini to analyze news content...");
        const analyzed = await aiService.analyzeNews(rawNews.content);

        log("🧐 Asking Critic to refine analysis...");
        const refined = await aiService.refineAnalysis(analyzed);

        log("\n✅ AI Generation Final Result:");
        const result = refined[0];
        log(JSON.stringify(result, null, 2));

        log("\n💾 Saving to Database...");
        const savedNews = await prisma.news.create({
            data: {
                title: result.title,
                url: result.source_url || rawNews.url,
                date: new Date(result.date),
                summary: result.summary,
                keyMetrics: result.key_metrics,
                sourceUrl: rawNews.url,
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

        log(`🎉 Successfully saved with ID: ${savedNews.id}`);

    } catch (error) {
        log(`❌ Process Failed: ${error.stack || error}`);
    } finally {
        await prisma.$disconnect();
    }
}

main();
