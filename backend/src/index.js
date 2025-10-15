import 'dotenv/config';
import app from './app.js';
import pool from './db/pool.js';

const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log('Connected to MySQL successfully');
  } catch (error) {
    console.error('Unable to verify database connection', error);
  }

  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
};

startServer();