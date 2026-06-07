const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

// Lấy danh sách người dùng (Không lấy matKhauHash để bảo mật)
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT userId, tenDangNhap, hoTen, vaiTro, trangThai FROM NguoiDung');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy người dùng' });
  }
});

module.exports = router;
