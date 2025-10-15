import mysql from 'mysql2';

const pool = mysql
  .createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER || 'group_19',
    password: process.env.DB_PASSWORD || 'group#19',
    database: process.env.DB_NAME || 'supplychain',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
  })
  .promise()

export default pool;