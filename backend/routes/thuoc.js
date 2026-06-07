const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

// Lấy danh sách thuốc
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Thuoc');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm thuốc mới
router.post('/', async (req, res) => {
  const { maATC, tenThuongMai, hoatChat, hamLuong, donViTinh, tonKhoHienTai, tonToiThieu, ngaySanXuat, ngayHetHan } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('maATC', sql.VarChar(20), maATC)
      .input('tenThuongMai', sql.NVarChar(150), tenThuongMai)
      .input('hoatChat', sql.NVarChar(150), hoatChat)
      .input('hamLuong', sql.NVarChar(50), hamLuong)
      .input('donViTinh', sql.NVarChar(20), donViTinh)
      .input('tonKhoHienTai', sql.Int, tonKhoHienTai || 0)
      .input('tonToiThieu', sql.Int, tonToiThieu || 0)
      .input('ngaySanXuat', sql.Date, ngaySanXuat || null)
      .input('ngayHetHan', sql.Date, ngayHetHan)
      .query(`
        INSERT INTO Thuoc (maATC, tenThuongMai, hoatChat, hamLuong, donViTinh, tonKhoHienTai, tonToiThieu, ngaySanXuat, ngayHetHan) 
        OUTPUT INSERTED.thuocID
        VALUES (@maATC, @tenThuongMai, @hoatChat, @hamLuong, @donViTinh, @tonKhoHienTai, @tonToiThieu, @ngaySanXuat, @ngayHetHan)
      `);
    
    // OUTPUT INSERTED.thuocID dùng để trả về ID vừa thêm trong SQL Server
    res.status(201).json({ id: result.recordset[0].thuocID, message: 'Thêm thuốc thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server hoặc trùng mã ATC' });
  }
});

module.exports = router;
