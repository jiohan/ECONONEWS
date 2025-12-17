const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 기존 데이터 삭제 (순서 중요: 자식 -> 부모)
    // 1. 관계 테이블 삭제
    await prisma.newsTerm.deleteMany({});
    // 2. 뉴스 및 용어 삭제
    await prisma.news.deleteMany({});
    await prisma.term.deleteMany({});

    // 샘플 뉴스 1 생성 (관계형 데이터 삽입)
    const news1 = await prisma.news.create({
        data: {
            title: "미국 연방준비제도가 기준금리 0.25% 인하",
            url: "https://example.com/news/fed-rate-cut-2025-12",
            date: new Date("2025-12-08"),
            summary: "미국 연방준비제도(Fed)가 12월 정책위원회에서 기준금리를 기존보다 0.25%p 낮춘 4.25~4.50%로 결정했어요. 최근 물가가 어느 정도 잡혔다고 판단했기 때문인데요. 이번 금리 인하로 인해 대출 이자가 줄어들 가능성이 커졌지만, 경기 침체를 우려하는 목소리도 함께 나오고 있습니다. 연준 의장은 앞으로 경제 상황을 보며 추가 인하 여부를 결정하겠다고 밝혔습니다.",
            keyMetrics: "기준금리 0.25%p 인하, S&P 500 +1.5%, 달러 약세",
            sourceUrl: "https://example.com/news/fed-rate-cut-2025-12",
            terms: {
                create: [
                    {
                        term: {
                            create: {
                                name: "기준금리(Base Rate)",
                                definition: "중앙은행이 정하는 금리 체계의 기준이 되는 금리.",
                                explanation: "은행의 대장인 중앙은행이 정하는 '돈의 기본 가격'이에요. 이게 내려가면 우리가 은행에서 돈을 빌릴 때 이자도 싸질 수 있어요."
                            }
                        }
                    },
                    {
                        term: {
                            create: {
                                name: "인플레이션(Inflation)",
                                definition: "물가 수준이 지속적으로 상승하는 현상.",
                                explanation: "시간이 지날수록 물건 가격이 계속 오르는 것을 말해요. 예를 들어 작년에 1000원 하던 아이스크림이 올해 1200원이 되면 인플레이션이 발생한 거예요."
                            }
                        }
                    }
                ]
            }
        },
    });

    const news2 = await prisma.news.create({
        data: {
            title: "삼성전자 3분기 영업이익 22조 원대 기대",
            url: "https://example.com/news/samsung-earnings-2025-q3",
            date: new Date("2025-12-07"),
            summary: "삼성전자가 3분기 영업이익 22조 원대를 기록할 것으로 예상된다. 반도체 가격 상승과 AI 칩 수요 증가가 주요 요인이다.",
            keyMetrics: "영업이익 22조 원, 반도체 매출 +30%, AI 칩 수요 250% 증가",
            sourceUrl: "https://example.com/news/samsung-earnings-2025-q3",
            terms: {
                create: [
                    {
                        term: {
                            create: {
                                name: "영업이익(Operating Profit)",
                                definition: "본업으로 버는 순수 이익",
                                explanation: "회사가 물건을 팔아서 벌고, 생산 비용을 뺀 것."
                            }
                        }
                    },
                    {
                        term: {
                            create: {
                                name: "반도체(Semiconductor)",
                                definition: "스마트폰, 컴퓨터 등의 핵심 부품",
                                explanation: "전자 제품의 '뇌' 역할."
                            }
                        }
                    }
                ]
            }
        },
    });

    const news3 = await prisma.news.create({
        data: {
            title: "한국 4분기 GDP 성장률 전망 상향",
            url: "https://example.com/news/korea-gdp-forecast-2025",
            date: new Date("2025-12-06"),
            summary: "한국은행이 올해 4분기 GDP 성장률을 2.5%로 전망했다. 수출 호조와 정부 투자 확대가 견인할 것으로 예상된다.",
            keyMetrics: "GDP 성장률 2.5%, 수출 +5%, 정부 투자 확대",
            sourceUrl: "https://example.com/news/korea-gdp-forecast-2025",
            terms: {
                create: [
                    {
                        term: {
                            create: {
                                name: "GDP(국내총생산)",
                                definition: "한 나라에서 1년간 생산된 모든 상품과 서비스의 총합",
                                explanation: "국가 경제 규모를 측정하는 가장 중요한 지표."
                            }
                        }
                    }
                ]
            }
        },
    });

    console.log('✅ 샘플 데이터 삽입 완료');
    console.log('📰 생성된 뉴스:');
    console.log(`   1. ${news1.title}`);
    console.log(`   2. ${news2.title}`);
    console.log(`   3. ${news3.title}`);
}

main()
    .catch((e) => {
        console.error('❌ Seed 실패 (상세):');
        console.error(e);
        console.error('Message:', e.message);
        console.error('Code:', e.code);
        console.error('Meta:', e.meta);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
