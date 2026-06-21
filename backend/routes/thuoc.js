const express = require('express');
const { poolPromise, sql } = require('../db');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

router.get('/', async (req, res) => {
  const keyword = (req.query.q || '').trim();

  try {
    const pool = await poolPromise;
    const request = pool.request();
    let query = 'SELECT * FROM Thuoc ORDER BY tenThuongMai ASC';

    if (keyword) {
      request.input('keyword', sql.NVarChar(150), `%${keyword}%`);
      query = `
        SELECT *
        FROM Thuoc
        WHERE tenThuongMai LIKE @keyword
          OR maATC LIKE @keyword
          OR hoatChat LIKE @keyword
        ORDER BY tenThuongMai ASC
      `;
    }

    const result = await request.query(query);
    return res.json(result.recordset);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Loi lay danh sach thuoc' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('thuocID', sql.Int, req.params.id)
      .query('SELECT * FROM Thuoc WHERE thuocID = @thuocID');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Khong tim thay thuoc' });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Loi lay chi tiet thuoc' });
  }
});

router.post('/', verifyToken, checkRole(['Admin', 'BacSi', 'DuocSi']), async (req, res) => {
  const {
    maATC,
    tenThuongMai,
    hoatChat,
    hamLuong,
    donViTinh,
    tonKhoHienTai,
    tonToiThieu,
    ngaySanXuat,
    ngayHetHan
  } = req.body;

  if (!maATC || !tenThuongMai || !hoatChat || !donViTinh) {
    return res.status(400).json({ message: 'Ma ATC, ten thuoc, hoat chat va don vi tinh la bat buoc' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('maATC', sql.VarChar(20), maATC.trim().toUpperCase())
      .input('tenThuongMai', sql.NVarChar(150), tenThuongMai.trim())
      .input('hoatChat', sql.NVarChar(150), hoatChat.trim())
      .input('hamLuong', sql.NVarChar(50), hamLuong || null)
      .input('donViTinh', sql.NVarChar(20), donViTinh.trim())
      .input('tonKhoHienTai', sql.Int, toInt(tonKhoHienTai))
      .input('tonToiThieu', sql.Int, toInt(tonToiThieu))
      .input('ngaySanXuat', sql.Date, ngaySanXuat || null)
      .input('ngayHetHan', sql.Date, ngayHetHan || null)
      .query(`
        INSERT INTO Thuoc (
          maATC, tenThuongMai, hoatChat, hamLuong, donViTinh,
          tonKhoHienTai, tonToiThieu, ngaySanXuat, ngayHetHan
        )
        OUTPUT INSERTED.*
        VALUES (
          @maATC, @tenThuongMai, @hoatChat, @hamLuong, @donViTinh,
          @tonKhoHienTai, @tonToiThieu, @ngaySanXuat, @ngayHetHan
        )
      `);

    return res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Loi them thuoc hoac trung ma ATC' });
  }
});

router.put('/:id', verifyToken, checkRole(['Admin', 'BacSi', 'DuocSi']), async (req, res) => {
  const {
    maATC,
    tenThuongMai,
    hoatChat,
    hamLuong,
    donViTinh,
    tonKhoHienTai,
    tonToiThieu,
    ngaySanXuat,
    ngayHetHan
  } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('thuocID', sql.Int, req.params.id)
      .input('maATC', sql.VarChar(20), maATC ? maATC.trim().toUpperCase() : null)
      .input('tenThuongMai', sql.NVarChar(150), tenThuongMai ? tenThuongMai.trim() : null)
      .input('hoatChat', sql.NVarChar(150), hoatChat ? hoatChat.trim() : null)
      .input('hamLuong', sql.NVarChar(50), hamLuong || null)
      .input('donViTinh', sql.NVarChar(20), donViTinh ? donViTinh.trim() : null)
      .input('tonKhoHienTai', sql.Int, toInt(tonKhoHienTai))
      .input('tonToiThieu', sql.Int, toInt(tonToiThieu))
      .input('ngaySanXuat', sql.Date, ngaySanXuat || null)
      .input('ngayHetHan', sql.Date, ngayHetHan || null)
      .query(`
        UPDATE Thuoc
        SET maATC = @maATC,
            tenThuongMai = @tenThuongMai,
            hoatChat = @hoatChat,
            hamLuong = @hamLuong,
            donViTinh = @donViTinh,
            tonKhoHienTai = @tonKhoHienTai,
            tonToiThieu = @tonToiThieu,
            ngaySanXuat = @ngaySanXuat,
            ngayHetHan = @ngayHetHan
        OUTPUT INSERTED.*
        WHERE thuocID = @thuocID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Khong tim thay thuoc' });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Loi cap nhat thuoc' });
  }
});

router.delete('/:id', verifyToken, checkRole(['Admin']), async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('thuocID', sql.Int, req.params.id)
      .query('DELETE FROM Thuoc WHERE thuocID = @thuocID');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Khong tim thay thuoc de xoa' });
    }

    return res.json({ message: 'Da xoa thuoc thanh cong' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Khong the xoa thuoc dang co rang buoc du lieu' });
  }
});

module.exports = router;
