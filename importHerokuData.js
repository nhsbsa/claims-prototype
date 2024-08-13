require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const connectionString = process.env.DATABASE_URL;

const createClient = () => new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function createTables() {
    const client = createClient();
    const createTableQueries = `
        CREATE TABLE IF NOT EXISTS claims (
            claimid SERIAL PRIMARY KEY,
            claimreference VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            financialyear INT NOT NULL,
            articletype VARCHAR(255) NOT NULL,
            claimtype VARCHAR(255) NOT NULL,
            claimstatus VARCHAR(255) NOT NULL,
            targetdate DATE NOT NULL,
            deadline DATE NOT NULL,
            datereceived DATE NOT NULL,
            invoicesnumber JSONB NOT NULL,
            claimamount JSONB NOT NULL,
            claimcost VARCHAR(255) NOT NULL,
            agebracket VARCHAR(255) NOT NULL,
            period VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS invoices (
            invoiceid SERIAL PRIMARY KEY,
            claimid INT NOT NULL,
            country VARCHAR(255) NOT NULL,
            invoicereference VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            startdate DATE NOT NULL,
            enddate DATE NOT NULL,
            status VARCHAR(255) NOT NULL,
            person JSONB NOT NULL,
            contestationreason TEXT,
            amounts JSONB,
            recorded DATE NOT NULL,
            foreigninstitutionname VARCHAR(255) NOT NULL,
            foreigninstitutionid VARCHAR(10) NOT NULL,
            FOREIGN KEY (claimid) REFERENCES claims (claimid) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS persons (
            personid SERIAL PRIMARY KEY,
            lastname VARCHAR(255) NOT NULL,
            firstname VARCHAR(255) NOT NULL,
            dob JSONB NOT NULL,
            dob_day INT NOT NULL,
            dob_month INT NOT NULL,
            dob_year INT NOT NULL,
            dob_formatted VARCHAR(255) NOT NULL,
            uniqueid JSONB NOT NULL,
            address JSONB NOT NULL,
            entitlements JSONB NOT NULL,
            treatments JSONB NOT NULL,
            agebracket VARCHAR(255) NOT NULL,
            articletype VARCHAR(255) NOT NULL
        );
    `;

    await executeQuery(client, createTableQueries);
    console.log('Tables created successfully.');
}

async function executeQuery(client, query) {
    await client.connect();
    try {
        await client.query(query);
    } finally {
        await client.end();
    }
}

async function importData(filePath, tableName, columns) {
    const client = createClient();
    const data = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => data.push(row))
        .on('end', async () => {
            await client.connect();
            try {
                for (const row of data) {
                    const values = columns.map(column => row[column]);
                    const queryText = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.map((v, i) => `$${i + 1}`).join(', ')})`;
                    await client.query(queryText, values);
                }
                console.log(`Data imported into ${tableName} successfully.`);
            } catch (err) {
                console.error(`Error importing data into ${tableName}:`, err);
            } finally {
                await client.end();
            }
        });
}

async function main() {
    await createTables();

    const claimsPath = path.join('C:/Users/RIOGSM', 'claims_202408051149.csv');
    const invoicesPath = path.join('C:/Users/RIOGSM', 'invoices_202408051149.csv');
    const personsPath = path.join('C:/Users/RIOGSM', 'persons_202408051149.csv');

    await importData(claimsPath, 'claims', ['claimreference', 'country', 'financialyear', 'articletype', 'claimtype', 'claimstatus', 'targetdate', 'deadline', 'datereceived', 'invoicesnumber', 'claimamount', 'claimcost', 'agebracket', 'period']);
    await importData(invoicesPath, 'invoices', ['claimid', 'country', 'invoicereference', 'amount', 'startdate', 'enddate', 'status', 'person', 'contestationreason', 'amounts', 'recorded', 'foreigninstitutionname', 'foreigninstitutionid']);
    await importData(personsPath, 'persons', ['lastname', 'firstname', 'dob', 'dob_day', 'dob_month', 'dob_year', 'dob_formatted', 'uniqueid', 'address', 'entitlements', 'treatments', 'agebracket', 'articletype']);
}

main();
