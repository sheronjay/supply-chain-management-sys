import 'dotenv/config';
import app from './app.js'; // Helmet is already used inside app.js
import pool from './db/pool.js';

const port = Number(5000);

const startServer = async () => {
  try {
    // Verify DB connection
    const connection = await pool.getConnection();
    connection.release();
    console.log('✅ Connected to MySQL successfully');
  } catch (error) {
    console.error('❌ Unable to verify database connection', error);
  }

  // Start server
  app.listen(port, () => {
    console.log(`🚀 API server running securely on port ${port}`);
  });
};

startServer();
