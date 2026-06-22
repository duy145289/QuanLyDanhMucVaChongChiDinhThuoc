import { AlertTriangle, X } from 'lucide-react';

export default function DoseWarningDialog({ warning, onClose }) {
  if (!warning) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="dose-warning-dialog" role="alertdialog" aria-modal="true" aria-labelledby="dose-warning-title">
        <div className="warning-dialog-heading">
          <span className="warning-icon"><AlertTriangle size={22} /></span>
          <div>
            <p>Cảnh báo an toàn liều</p>
            <h3 id="dose-warning-title">Tổng liều vượt định mức</h3>
          </div>
          <button className="icon-button" type="button" title="Đóng cảnh báo" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="warning-dialog-body">
          <strong>{warning.medicine?.tenThuongMai || 'Thuốc đã chọn'}</strong>
          <dl>
            <div><dt>Tổng liều/ngày</dt><dd>{warning.dose.tongLieuNgay}</dd></div>
            <div><dt>Giới hạn/ngày</dt><dd>{warning.dose.maxLieuNgay}</dd></div>
            <div><dt>Vượt mức</dt><dd>+{Number((warning.dose.tongLieuNgay - warning.dose.maxLieuNgay).toFixed(2))}</dd></div>
          </dl>
          <p>Hãy giảm liều mỗi lần hoặc số lần dùng trong ngày trước khi lưu đơn thuốc.</p>
        </div>
        <div className="warning-dialog-actions">
          <button className="primary-button" type="button" onClick={onClose}>Điều chỉnh liều</button>
        </div>
      </section>
    </div>
  );
}
