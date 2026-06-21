import { ClipboardList, PackageOpen, Pill, Plus, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

function createLine(medicine) {
  return {
    localID: `${Date.now()}-${Math.random()}`,
    thuocID: medicine?.thuocID || '',
    lieuMoiLan: 1,
    soLanNgay: 1,
    soNgay: 1,
    soLuong: 1,
    huongDan: ''
  };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function PrescriptionWorkspace({ medicines, onNavigate }) {
  const [header, setHeader] = useState({ tenBenhNhan: '', ngayKeDon: today(), ghiChu: '' });
  const [lines, setLines] = useState(() => [createLine(medicines[0])]);
  const [notice, setNotice] = useState('Đơn thuốc mới chưa được lưu.');
  const [saving, setSaving] = useState(false);

  const medicineById = useMemo(() => (
    medicines.reduce((map, medicine) => ({ ...map, [medicine.thuocID]: medicine }), {})
  ), [medicines]);

  function updateHeader(field, value) {
    setHeader((current) => ({ ...current, [field]: value }));
  }

  function updateLine(localID, field, value) {
    setLines((current) => current.map((line) => (
      line.localID === localID ? { ...line, [field]: value } : line
    )));
  }

  function addLine() {
    setLines((current) => [...current, createLine(medicines[0])]);
  }

  function removeLine(localID) {
    setLines((current) => current.length === 1
      ? [createLine(medicines[0])]
      : current.filter((line) => line.localID !== localID));
  }

  async function saveDraft() {
    if (!header.tenBenhNhan.trim()) {
      setNotice('Vui lòng nhập tên bệnh nhân trước khi lưu.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/don-thuoc/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(header)
      });
      if (!response.ok) throw new Error('Save failed');
      const saved = await response.json();
      setNotice(`Đã lưu bản nháp ${saved.maDonThuoc}.`);
    } catch (_error) {
      setNotice('Backend chưa sẵn sàng; dữ liệu vẫn được giữ trên màn hình.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">Rx</div>
        <h1>QLDM CCDT</h1>
        <nav aria-label="Điều hướng chính">
          <button className="nav-button" type="button" onClick={() => onNavigate('catalog')}>
            <Pill size={18} /> Danh mục thuốc
          </button>
          <button className="nav-button active" type="button">
            <ClipboardList size={18} /> Đơn thuốc
          </button>
          <button className="nav-button" type="button">
            <PackageOpen size={18} /> Kho thuốc
          </button>
        </nav>
      </aside>

      <section className="workspace prescription-workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Quản lý đơn thuốc</p>
            <h2>Lập toa thuốc mới</h2>
          </div>
          <div className="toolbar-actions">
            <span className="sync-state">{notice}</span>
            <button className="primary-button icon-text-button" type="button" onClick={saveDraft} disabled={saving}>
              <Save size={17} /> {saving ? 'Đang lưu' : 'Lưu bản nháp'}
            </button>
          </div>
        </header>

        <section className="prescription-header" aria-label="Thông tin đơn thuốc">
          <label>
            Bệnh nhân
            <input
              value={header.tenBenhNhan}
              onChange={(event) => updateHeader('tenBenhNhan', event.target.value)}
              placeholder="Nhập họ tên bệnh nhân"
            />
          </label>
          <label>
            Ngày kê đơn
            <input type="date" value={header.ngayKeDon} onChange={(event) => updateHeader('ngayKeDon', event.target.value)} />
          </label>
          <label className="wide-field">
            Ghi chú
            <input value={header.ghiChu} onChange={(event) => updateHeader('ghiChu', event.target.value)} placeholder="Chẩn đoán hoặc lưu ý sử dụng" />
          </label>
        </section>

        <section className="prescription-panel">
          <div className="section-heading prescription-table-heading">
            <div>
              <h3>Chi tiết toa thuốc</h3>
              <p>{lines.length} dòng thuốc</p>
            </div>
            <button className="ghost-button icon-text-button" type="button" onClick={addLine}>
              <Plus size={17} /> Thêm thuốc
            </button>
          </div>

          <div className="table-wrap">
            <table className="prescription-table">
              <thead>
                <tr>
                  <th>Thuốc</th>
                  <th>Liều/lần</th>
                  <th>Lần/ngày</th>
                  <th>Số ngày</th>
                  <th>Số lượng</th>
                  <th>Hướng dẫn</th>
                  <th aria-label="Xóa dòng" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const medicine = medicineById[line.thuocID];
                  return (
                    <tr key={line.localID}>
                      <td className="medicine-select-cell">
                        <select value={line.thuocID} onChange={(event) => updateLine(line.localID, 'thuocID', Number(event.target.value))}>
                          {medicines.map((item) => (
                            <option key={item.thuocID} value={item.thuocID}>{item.maATC} - {item.tenThuongMai}</option>
                          ))}
                        </select>
                        <small>{medicine?.hoatChat} · {medicine?.hamLuong}</small>
                      </td>
                      <td><input type="number" min="0.01" step="0.01" value={line.lieuMoiLan} onChange={(event) => updateLine(line.localID, 'lieuMoiLan', event.target.value)} /></td>
                      <td><input type="number" min="1" value={line.soLanNgay} onChange={(event) => updateLine(line.localID, 'soLanNgay', event.target.value)} /></td>
                      <td><input type="number" min="1" value={line.soNgay} onChange={(event) => updateLine(line.localID, 'soNgay', event.target.value)} /></td>
                      <td><input type="number" min="1" value={line.soLuong} onChange={(event) => updateLine(line.localID, 'soLuong', event.target.value)} /></td>
                      <td><input value={line.huongDan} onChange={(event) => updateLine(line.localID, 'huongDan', event.target.value)} placeholder="Sau ăn" /></td>
                      <td>
                        <button className="icon-button danger-link" type="button" title="Xóa dòng thuốc" onClick={() => removeLine(line.localID)}>
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
