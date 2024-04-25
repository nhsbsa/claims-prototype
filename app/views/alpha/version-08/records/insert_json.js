
const { Client } = require('pg');
const { readFileSync } = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:CrystalClearQuartz9785@localhost:5432/postgres'
});

client.connect();

async function importData() {
    try {
        const data = JSON.parse(readFileSync('claims_data.json', 'utf8'));

        for (const country in data.claims.countries) {
            for (const year in data.claims.countries[country]) {
                for (const articleType in data.claims.countries[country][year].articles.actual) {
                    const article = data.claims.countries[country][year].articles.actual[articleType];
                    // Extend article with country and year for more context
                    article.country = country;
                    article.year = year;

                    // Convert article details including invoices into JSON string
                    const articleData = JSON.stringify(article);

                    // Insert into PostgreSQL
                    await client.query('INSERT INTO claims(data) VALUES($1)', [articleData]);
                    console.log(`Inserted data for article ${articleType} of year ${year} in ${country}`);
                }
            }
        }
    } catch (err) {
        console.error('Failed to import data:', err);
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

importData();




