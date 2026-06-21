const thuocRepository = require('../repositories/thuocRepository');
const { getAtcMessage, normalizeAtc } = require('../utils/atcValidator');
const { isValidCategory, isValidUnit } = require('../constants/medicineCatalog');

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function normalizeThuocPayload(payload) {
  return {
    maATC: normalizeAtc(payload.maATC),
    tenThuongMai: payload.tenThuongMai ? payload.tenThuongMai.trim() : null,
    hoatChat: payload.hoatChat ? payload.hoatChat.trim() : null,
    hamLuong: payload.hamLuong || null,
    phanLoai: payload.phanLoai ? payload.phanLoai.trim() : 'Khác',
    donViTinh: payload.donViTinh ? payload.donViTinh.trim() : null,
    tonKhoHienTai: toInt(payload.tonKhoHienTai),
    tonToiThieu: toInt(payload.tonToiThieu),
    ngaySanXuat: payload.ngaySanXuat || null,
    ngayHetHan: payload.ngayHetHan || null
  };
}

function validateRequiredFields(data) {
  const errors = [];

  const atcMessage = getAtcMessage(data.maATC);
  if (atcMessage) errors.push(atcMessage);
  if (!data.tenThuongMai) errors.push('Ten thuoc la bat buoc');
  if (!data.hoatChat) errors.push('Hoat chat la bat buoc');
  if (!data.donViTinh) errors.push('Don vi tinh la bat buoc');
  if (data.phanLoai && !isValidCategory(data.phanLoai)) errors.push('Phan loai thuoc khong hop le');
  if (data.donViTinh && !isValidUnit(data.donViTinh)) errors.push('Don vi tinh khong hop le');
  if (data.tonKhoHienTai < 0 || data.tonToiThieu < 0) errors.push('Ton kho khong duoc am');

  return errors;
}

async function listThuoc(filters) {
  return thuocRepository.findAll({
    keyword: filters.keyword ? filters.keyword.trim() : ''
  });
}

async function getThuoc(thuocID) {
  return thuocRepository.findById(thuocID);
}

async function createThuoc(payload) {
  const data = normalizeThuocPayload(payload);
  const errors = validateRequiredFields(data);

  if (errors.length > 0) {
    const error = new Error('Du lieu thuoc khong hop le');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  return thuocRepository.createThuoc(data);
}

async function updateThuoc(thuocID, payload) {
  const data = normalizeThuocPayload(payload);
  const errors = validateRequiredFields(data);

  if (errors.length > 0) {
    const error = new Error('Du lieu thuoc khong hop le');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  return thuocRepository.updateThuoc(thuocID, data);
}

async function deleteThuoc(thuocID) {
  return thuocRepository.removeThuoc(thuocID);
}

module.exports = {
  listThuoc,
  getThuoc,
  createThuoc,
  updateThuoc,
  deleteThuoc
};
