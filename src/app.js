const express = require('express');
const pool = require('./config/db');

const app = express();
app.use(express.json());

// Render liveness check. Database readiness is exposed separately.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/api/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'UP', database: 'CONNECTED' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
});

// Obtener tabla de posiciones
app.get('/api/posiciones', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS equipos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        puntos INT DEFAULT 0,
        diferencia_goles INT DEFAULT 0
      );
    `);
    const result = await pool.query(
      'SELECT * FROM equipos ORDER BY puntos DESC, diferencia_goles DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch standings:', error.message);
    res.status(500).json({ error: 'Error al obtener la tabla de posiciones' });
  }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    pool
      .query('SELECT 1')
      .then(() => console.log('Startup database check passed'))
      .catch((error) => console.error('Startup database check failed:', error.message));
  });
}

module.exports = app;
