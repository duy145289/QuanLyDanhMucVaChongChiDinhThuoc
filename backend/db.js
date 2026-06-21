const sql = require('mssql/msnodesqlv8');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  driver: 'ODBC Driver 17 for SQL Server',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'QuanLyThuoc_ChongChiDinh',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    throw error;
  });

module.exports = {
  sql,
  poolPromise
};
