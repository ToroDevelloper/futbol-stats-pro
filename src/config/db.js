const { Pool } = require('pg');
require('dotenv').config();

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:password123@db_futbol:5432/futbol_db';

const caCert = process.env.PG_CA_CERT
  ? process.env.PG_CA_CERT.replace(/\\n/g, '\n').trim()
  : undefined;

const shouldUseSsl =
  process.env.NODE_ENV === 'production' ||
  /sslmode=require/i.test(connectionString) ||
  /sslmode=verify-full/i.test(connectionString) ||
  process.env.PGSSLMODE === 'require';

const sslConfig = shouldUseSsl
  ? caCert
    ? { rejectUnauthorized: true, ca: caCert }
    : { rejectUnauthorized: false }
  : false;

const pool = new Pool({
  connectionString,
  ssl: sslConfig,
});

pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error', err);
});

module.exports = pool;
