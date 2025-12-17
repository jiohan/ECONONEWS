require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Inspecting Database Content...');

    const newsCount = await prisma.news.count();
    console.log(`📊 Total News: ${newsCount}`);

    if (newsCount === 0) {
        console.log('⚠️ No news found in database.');
        return;
    }

    const newsItems = await prisma.news.findMany({
        take: 5,
        include: { terms: { include: { term: true } } },
        orderBy: { date: 'desc' }
    });

    newsItems.forEach((news, i) => {
        console.log(`\n--- News #${i + 1} ---`);
        console.log(`ID: ${news.id}`);
        console.log(`Title: ${news.title}`);
        console.log(`Summary Length: ${news.summary ? news.summary.length : 0}`);
        console.log(`Terms Count: ${news.terms.length}`);
        news.terms.forEach(nt => {
            console.log(`  - Term: ${nt.term.name}`);
            console.log(`    Def: ${nt.term.definition ? '✅' : '❌'}`);
            console.log(`    Exp: ${nt.term.explanation ? (nt.term.explanation.length > 0 ? '✅' : '⚠️ Empty') : '❌ Null'}`);
        });
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
