const MEDICINE_CATEGORIES = [
  'Kháng sinh',
  'Giảm đau - hạ sốt',
  'Tim mạch',
  'Tiêu hóa',
  'Hô hấp',
  'Dị ứng',
  'Vitamin - khoáng chất',
  'Khác'
];

const MEDICINE_UNITS = [
  'viên',
  'vỉ',
  'hộp',
  'chai',
  'ống',
  'gói',
  'tuýp',
  'lọ'
];

function isValidCategory(value) {
  return MEDICINE_CATEGORIES.includes(value);
}

function isValidUnit(value) {
  return MEDICINE_UNITS.includes(value);
}

module.exports = {
  MEDICINE_CATEGORIES,
  MEDICINE_UNITS,
  isValidCategory,
  isValidUnit
};
