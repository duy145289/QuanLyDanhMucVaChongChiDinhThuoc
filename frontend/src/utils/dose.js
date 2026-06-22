function positiveNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function round(value) {
  return Number(value.toFixed(2));
}

export function calculateLineDose(line) {
  const lieuMoiLan = positiveNumber(line.lieuMoiLan);
  const soLanNgay = positiveNumber(line.soLanNgay);
  const soNgay = positiveNumber(line.soNgay);
  const maxLieuNgay = positiveNumber(line.maxLieuNgay);
  const tongLieuNgay = round(lieuMoiLan * soLanNgay);
  const tongLieuDot = round(tongLieuNgay * soNgay);

  return {
    tongLieuNgay,
    tongLieuDot,
    maxLieuNgay,
    vuotLieu: maxLieuNgay > 0 && tongLieuNgay > maxLieuNgay
  };
}
