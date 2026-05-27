process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:password123@localhost:5432/futbol_db';

const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS equipos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL,
      puntos INT DEFAULT 0,
      diferencia_goles INT DEFAULT 0
    );
  `);
  await pool.query(`
    INSERT INTO equipos (nombre, puntos, diferencia_goles)
    VALUES ('ITP F.C.', 9, 5)
    ON CONFLICT DO NOTHING;
  `);
});

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS equipos;');
  await pool.end();
});

describe('GET /api/posiciones', () => {
  it('returns teams sorted by points', async () => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Tests must run with NODE_ENV=test.');
    }

    const res = await request(app).get('/api/posiciones');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].nombre).toBe('ITP F.C.');
  });
});
