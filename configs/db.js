const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction ? process.env.DATABASE_URL : process.env.LOCAL_DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

module.exports = pool;

