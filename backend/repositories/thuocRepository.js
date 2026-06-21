const { poolPromise, sql } = require('../db');

function mapThuoc(row) {
  return row;
}

async function findAll({ keyword } = {}) {
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
  return result.recordset.map(mapThuoc);
}

async function findById(thuocID) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('thuocID', sql.Int, thuocID)
    .query('SELECT * FROM Thuoc WHERE thuocID = @thuocID');

  return result.recordset[0] ? mapThuoc(result.recordset[0]) : null;
}

async function createThuoc(data) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('maATC', sql.VarChar(20), data.maATC)
    .input('tenThuongMai', sql.NVarChar(150), data.tenThuongMai)
    .input('hoatChat', sql.NVarChar(150), data.hoatChat)
    .input('hamLuong', sql.NVarChar(50), data.hamLuong)
    .input('phanLoai', sql.NVarChar(80), data.phanLoai)
    .input('nhomThuocID', sql.Int, data.nhomThuocID)
    .input('donViTinh', sql.NVarChar(20), data.donViTinh)
    .input('tonKhoHienTai', sql.Int, data.tonKhoHienTai)
    .input('tonToiThieu', sql.Int, data.tonToiThieu)
    .input('ngaySanXuat', sql.Date, data.ngaySanXuat)
    .input('ngayHetHan', sql.Date, data.ngayHetHan)
    .query(`
      INSERT INTO Thuoc (
        maATC, tenThuongMai, hoatChat, hamLuong, phanLoai, nhomThuocID, donViTinh,
        tonKhoHienTai, tonToiThieu, ngaySanXuat, ngayHetHan
      )
      OUTPUT INSERTED.*
      VALUES (
        @maATC, @tenThuongMai, @hoatChat, @hamLuong, @phanLoai, @nhomThuocID, @donViTinh,
        @tonKhoHienTai, @tonToiThieu, @ngaySanXuat, @ngayHetHan
      )
    `);

  return mapThuoc(result.recordset[0]);
}

async function updateThuoc(thuocID, data) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('thuocID', sql.Int, thuocID)
    .input('maATC', sql.VarChar(20), data.maATC)
    .input('tenThuongMai', sql.NVarChar(150), data.tenThuongMai)
    .input('hoatChat', sql.NVarChar(150), data.hoatChat)
    .input('hamLuong', sql.NVarChar(50), data.hamLuong)
    .input('phanLoai', sql.NVarChar(80), data.phanLoai)
    .input('nhomThuocID', sql.Int, data.nhomThuocID)
    .input('donViTinh', sql.NVarChar(20), data.donViTinh)
    .input('tonKhoHienTai', sql.Int, data.tonKhoHienTai)
    .input('tonToiThieu', sql.Int, data.tonToiThieu)
    .input('ngaySanXuat', sql.Date, data.ngaySanXuat)
    .input('ngayHetHan', sql.Date, data.ngayHetHan)
    .query(`
      UPDATE Thuoc
      SET maATC = @maATC,
          tenThuongMai = @tenThuongMai,
          hoatChat = @hoatChat,
          hamLuong = @hamLuong,
          phanLoai = @phanLoai,
          nhomThuocID = @nhomThuocID,
          donViTinh = @donViTinh,
          tonKhoHienTai = @tonKhoHienTai,
          tonToiThieu = @tonToiThieu,
          ngaySanXuat = @ngaySanXuat,
          ngayHetHan = @ngayHetHan
      OUTPUT INSERTED.*
      WHERE thuocID = @thuocID
    `);

  return result.recordset[0] ? mapThuoc(result.recordset[0]) : null;
}

async function removeThuoc(thuocID) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('thuocID', sql.Int, thuocID)
    .query('DELETE FROM Thuoc WHERE thuocID = @thuocID');

  return result.rowsAffected[0] > 0;
}

module.exports = {
  findAll,
  findById,
  createThuoc,
  updateThuoc,
  removeThuoc
};
