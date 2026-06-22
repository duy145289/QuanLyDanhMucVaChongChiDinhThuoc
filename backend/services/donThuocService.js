const donThuocRepository = require('../repositories/donThuocRepository');

function createPrescriptionCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DT-${date}-${suffix}`;
}

function normalizeHeader(payload, user) {
  return {
    maDonThuoc: payload.maDonThuoc?.trim() || createPrescriptionCode(),
    tenBenhNhan: payload.tenBenhNhan?.trim() || '',
    ngayKeDon: payload.ngayKeDon || new Date().toISOString().slice(0, 10),
    ghiChu: payload.ghiChu?.trim() || null,
    createdBy: user?.displayName || user?.email || user?.role || null
  };
}

function validateHeader(data) {
  const errors = [];
  if (!data.tenBenhNhan) errors.push('Ten benh nhan la bat buoc');
  if (data.tenBenhNhan.length > 150) errors.push('Ten benh nhan khong duoc vuot qua 150 ky tu');
  if (!/^DT-[A-Z0-9-]+$/.test(data.maDonThuoc)) errors.push('Ma don thuoc khong hop le');
  return errors;
}

function throwValidationError(errors) {
  const error = new Error('Du lieu don thuoc khong hop le');
  error.statusCode = 400;
  error.details = errors;
  throw error;
}

async function listDonThuoc() {
  return donThuocRepository.findAll();
}

async function getDonThuoc(donThuocID) {
  return donThuocRepository.findById(donThuocID);
}

async function createDraft(payload, user) {
  const data = normalizeHeader(payload, user);
  const errors = validateHeader(data);
  if (errors.length) throwValidationError(errors);
  return donThuocRepository.createDraft(data);
}

module.exports = {
  listDonThuoc,
  getDonThuoc,
  createDraft,
  normalizeHeader,
  validateHeader,
  throwValidationError
};
