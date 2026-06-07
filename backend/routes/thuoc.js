const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy danh sách thuốc
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Thuoc');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm thuốc mới
router.post('/', async (req, res) => {
  const { maATC, tenThuongMai, hoatChat, hamLuong, donViTinh, tonKhoHienTai, tonToiThieu, ngaySanXuat, ngayHetHan } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO Thuoc (maATC, tenThuongMai, hoatChat, hamLuong, donViTinh, tonKhoHienTai, tonToiThieu, ngaySanXuat, ngayHetHan) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [maATC, tenThuongMai, hoatChat, hamLuong, donViTinh, tonKhoHienTai || 0, tonToiThieu || 0, ngaySanXuat || null, ngayHetHan]
    );
    res.status(201).json({ id: result.insertId, message: 'Thêm thuốc thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server hoặc trùng mã ATC' });
  }
});

module.exports = router;
