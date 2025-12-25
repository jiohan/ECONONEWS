require('dotenv').config();
const aiService = require('./src/services/aiService');
const prisma = require('./src/config/database');

async function main() {
    console.log("🧪 Testing AI Generation with Dummy News...");

    // 1. Define Dummy News Content (Simulating a scraped article)
    const dummyNewsContent = `
    [속보] 테슬라, 3분기 깜짝 실적 발표... 주가 12% 급등
    테슬라가 시장의 예상을 뛰어넘는 3분기 실적을 발표했다.
    매출은 250억 달러로 전년 동기 대비 8% 증가했으며, 영업이익은 15억 달러를 기록했다.
    일론 머스크 CEO는 "비용 절감 노력과 사이버트럭의 판매 호조가 실적 개선을 이끌었다"고 밝혔다.
    이 소식이 전해지자 테슬라 주가는 시간외 거래에서 12% 급등했다.
    한편, 테슬라는 내년 초 저가형 전기차 모델 출시 계획을 재확인하며 투자자들의 기대감을 높였다.
    전기차 수요 둔화 우려 속에서도 거둔 이번 성과는 테슬라의 독보적인 시장 지위를 다시 한번 입증한 것으로 평가된다.
    `;

    console.log("📥 Input Text:", dummyNewsContent);

    try {
        // 2. Call AI Service (Analyze)
        console.log("🤖 Asking Gemini to analyze...");
        const analyzed = await aiService.analyzeNews(dummyNewsContent);

        // 3. Call AI Service (Refine/Critic)
        console.log("🧐 Asking Critic to refine...");
        const refined = await aiService.refineAnalysis(analyzed);

        // 4. Output Result
        console.log("\n✅ AI Generation Result:");
        console.log(JSON.stringify(refined, null, 2));

        // 5. Save to DB for User Verification
        const savedNews = await prisma.news.create({
            data: {
                title: refined[0].title,
                url: "https://test.com/tesla-earnings-" + Date.now(), // Unique URL
                date: new Date(),
                summary: refined[0].summary,
                keyMetrics: refined[0].key_metrics,
                sourceUrl: "https://test.com",
                terms: {
                    create: refined[0].terms.map(t => ({
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
        console.log(`\n💾 Saved to Database with ID: ${savedNews.id}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
