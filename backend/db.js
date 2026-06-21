let sql;
try {
  sql = require('mssql/msnodesqlv8');
} catch (e) {
  sql = require('mssql'); // Fallback cho môi trường CI (Linux) để Jest không bị crash
}
const dotenv = require('dotenv');

dotenv.config();

// Cấu hình kết nối SQL Server sử dụng Windows Authentication
const config = {
  driver: 'ODBC Driver 17 for SQL Server',
  server: process.env.DB_HOST || 'localhost', 
  database: process.env.DB_NAME || 'QuanLyThuoc_ChongChiDinh',
  options: {
    trustedConnection: true, // Kích hoạt Windows Authentication
    trustServerCertificate: true // Bỏ qua lỗi SSL
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(async pool => {
    console.log('✅ Connected to SQL Server thành công!');
    
    // Tự động thêm cột trangThai vào bảng Thuoc nếu chưa có (để xử lý vụ Hết hạn)
    try {
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'Thuoc' AND COLUMN_NAME = 'trangThai'
        )
        BEGIN
          ALTER TABLE Thuoc ADD trangThai INT DEFAULT 1;
          EXEC('UPDATE Thuoc SET trangThai = 1 WHERE trangThai IS NULL');
        END
      `);
    } catch (e) {
      console.error('❌ Lỗi khi tự động thêm cột trangThai:', e);
    }

    return pool;
  })
  .catch(err => console.log('❌ Database Connection Failed! Lỗi: ', err));

module.exports = {
  sql, poolPromise
};
