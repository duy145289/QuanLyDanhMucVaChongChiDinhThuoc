import { AlertTriangle, X } from 'lucide-react';

export default function DoseWarningDialog({ warning, onClose }) {
  if (!warning) return null;
  const isAbsolute = warning.dose.isTuyetDoi;
  const toneClass = isAbsolute ? 'absolute-risk' : 'caution-risk';

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className={`dose-warning-dialog ${toneClass}`} role="alertdialog" aria-modal="true" aria-labelledby="dose-warning-title">
        <div className="warning-dialog-heading">
          <span className="warning-icon"><AlertTriangle size={22} /></span>
          <div>
            <p>{isAbsolute ? 'Rủi ro tuyệt đối' : 'Rủi ro thận trọng'}</p>
            <h3 id="dose-warning-title">{isAbsolute ? 'Không thể lưu đơn thuốc' : 'Tổng liều vượt định mức'}</h3>
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
          <p>
            {isAbsolute
              ? 'Cảnh báo đỏ mức Tuyệt đối yêu cầu điều chỉnh thuốc hoặc liều trước khi lưu.'
              : 'Hãy kiểm tra lại phác đồ và chỉ tiếp tục khi đã có lý do chuyên môn.'}
          </p>
        </div>
        <div className="warning-dialog-actions">
          <button className="primary-button" type="button" onClick={onClose}>Điều chỉnh liều</button>
        </div>
      </section>
    </div>
  );
}
