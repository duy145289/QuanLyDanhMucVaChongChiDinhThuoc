const { poolPromise, sql } = require('../db');

async function findAll() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT d.*,
           COUNT(c.chiTietID) AS soLoaiThuoc
    FROM DonThuoc d
    LEFT JOIN ChiTietDonThuoc c ON c.donThuocID = d.donThuocID
    GROUP BY d.donThuocID, d.maDonThuoc, d.tenBenhNhan, d.ngayKeDon,
             d.ghiChu, d.trangThai, d.createdBy, d.createdAt, d.updatedAt
    ORDER BY d.createdAt DESC
  `);

  return result.recordset;
}

async function findById(donThuocID) {
  const pool = await poolPromise;
  const headerResult = await pool.request()
    .input('donThuocID', sql.Int, donThuocID)
    .query('SELECT * FROM DonThuoc WHERE donThuocID = @donThuocID');

  const header = headerResult.recordset[0];
  if (!header) return null;

  const detailResult = await pool.request()
    .input('donThuocID', sql.Int, donThuocID)
    .query(`
      SELECT c.*, t.maATC, t.tenThuongMai, t.hoatChat, t.hamLuong, t.donViTinh
      FROM ChiTietDonThuoc c
      INNER JOIN Thuoc t ON t.thuocID = c.thuocID
      WHERE c.donThuocID = @donThuocID
      ORDER BY c.chiTietID
    `);

  return { ...header, chiTiet: detailResult.recordset };
}

async function createDraft(data) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('maDonThuoc', sql.VarChar(30), data.maDonThuoc)
    .input('tenBenhNhan', sql.NVarChar(150), data.tenBenhNhan)
    .input('ngayKeDon', sql.Date, data.ngayKeDon)
    .input('ghiChu', sql.NVarChar(500), data.ghiChu)
    .input('createdBy', sql.NVarChar(120), data.createdBy)
    .query(`
      INSERT INTO DonThuoc (maDonThuoc, tenBenhNhan, ngayKeDon, ghiChu, trangThai, createdBy)
      OUTPUT INSERTED.*
      VALUES (@maDonThuoc, @tenBenhNhan, @ngayKeDon, @ghiChu, N'Nháp', @createdBy)
    `);

  return { ...result.recordset[0], chiTiet: [] };
}

module.exports = {
  findAll,
  findById,
  createDraft
};
