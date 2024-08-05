require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const checkTables = async () => {
  try {
    await client.connect();

    const tables = ['claims', 'invoices', 'persons'];

    for (const table of tables) {
      const res = await client.query(`SELECT * FROM ${table}`);
      console.log(`Data in table ${table}:`);
      console.table(res.rows);
    }

    await client.end();
  } catch (err) {
    console.error('Error querying the database:', err);
  }
};

checkTables();
