import mysql from 'mysql2';

const pool = mysql
  .createPool({
    host: '127.0.0.1',
    port: Number(3306),
    user: 'root',
    password: 'rajitha',
    database: 'supplychain',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
  })
  .promise()

export default pool;