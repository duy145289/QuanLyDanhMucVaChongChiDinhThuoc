import { useEffect, useMemo, useState } from 'react';

const categoryOptions = ['Kháng sinh', 'Giảm đau - hạ sốt', 'Tim mạch', 'Tiêu hóa', 'Hô hấp', 'Dị ứng', 'Vitamin - khoáng chất', 'Khác'];
const unitOptions = ['viên', 'vỉ', 'hộp', 'chai', 'ống', 'gói', 'tuýp', 'lọ'];
const atcPattern = /^[A-Z][0-9]{2}[A-Z]{2}[0-9]{2}$/;

const emptyForm = {
  thuocID: null,
  maATC: '',
  tenThuongMai: '',
  hoatChat: '',
  hamLuong: '',
  phanLoai: 'Kháng sinh',
  donViTinh: 'viên',
  tonKhoHienTai: 0,
  tonToiThieu: 10,
  ngaySanXuat: '',
  ngayHetHan: ''
};

const sampleMedicines = [
  {
    thuocID: 1,
    maATC: 'J01CA04',
    tenThuongMai: 'Amoxicillin 500mg',
    hoatChat: 'Amoxicillin',
    hamLuong: '500mg',
    phanLoai: 'Kháng sinh',
    donViTinh: 'viên',
    tonKhoHienTai: 348,
    tonToiThieu: 80,
    ngayHetHan: '2027-04-30'
  },
  {
    thuocID: 2,
    maATC: 'N02BE01',
    tenThuongMai: 'Paracetamol 500mg',
    hoatChat: 'Paracetamol',
    hamLuong: '500mg',
    phanLoai: 'Giảm đau - hạ sốt',
    donViTinh: 'viên',
    tonKhoHienTai: 72,
    tonToiThieu: 120,
    ngayHetHan: '2026-12-15'
  },
  {
    thuocID: 3,
    maATC: 'C09AA03',
    tenThuongMai: 'Lisinopril 10mg',
    hoatChat: 'Lisinopril',
    hamLuong: '10mg',
    phanLoai: 'Tim mạch',
    donViTinh: 'hộp',
    tonKhoHienTai: 24,
    tonToiThieu: 30,
    ngayHetHan: '2028-02-01'
  }
];

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
}

function stockStatus(medicine) {
  if (Number(medicine.tonKhoHienTai) <= Number(medicine.tonToiThieu)) {
    return { label: 'Cần nhập', tone: 'warning' };
  }

  return { label: 'Ổn định', tone: 'success' };
}

function App() {
  const [medicines, setMedicines] = useState(sampleMedicines);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('Đang dùng dữ liệu mẫu nếu backend chưa sẵn sàng.');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadMedicines() {
    setLoading(true);
    try {
      const response = await fetch('/api/thuoc');
      if (!response.ok) throw new Error('API unavailable');
      const data = await response.json();
      setMedicines(data);
      setNotice('Đã đồng bộ danh mục thuốc từ backend.');
    } catch (_error) {
      setMedicines(sampleMedicines);
      setNotice('Backend chưa chạy, giao diện đang hiển thị dữ liệu mẫu.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedicines();
  }, []);

  const filteredMedicines = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return medicines;

    return medicines.filter((medicine) => (
      medicine.maATC?.toLowerCase().includes(keyword)
      || medicine.tenThuongMai?.toLowerCase().includes(keyword)
      || medicine.hoatChat?.toLowerCase().includes(keyword)
      || medicine.phanLoai?.toLowerCase().includes(keyword)
    ));
  }, [medicines, query]);

  function updateField(field, value) {
    if (formError) setFormError('');
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editMedicine(medicine) {
    setForm({
      ...emptyForm,
      ...medicine,
      phanLoai: medicine.phanLoai || 'Khác',
      ngaySanXuat: medicine.ngaySanXuat?.slice(0, 10) || '',
      ngayHetHan: medicine.ngayHetHan?.slice(0, 10) || ''
    });
  }

  async function saveMedicine(event) {
    event.preventDefault();
    const payload = {
      ...form,
      maATC: form.maATC.trim().toUpperCase(),
      tenThuongMai: form.tenThuongMai.trim(),
      hoatChat: form.hoatChat.trim(),
      tonKhoHienTai: Number(form.tonKhoHienTai),
      tonToiThieu: Number(form.tonToiThieu)
    };

    if (!atcPattern.test(payload.maATC)) {
      setFormError('Mã ATC phải đúng định dạng, ví dụ J01CA04.');
      return;
    }

    const method = form.thuocID ? 'PUT' : 'POST';
    const url = form.thuocID ? `/api/thuoc/${form.thuocID}` : '/api/thuoc';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Save failed');
      const saved = await response.json();
      setMedicines((current) => (
        form.thuocID
          ? current.map((item) => (item.thuocID === saved.thuocID ? saved : item))
          : [saved, ...current]
      ));
      setForm(emptyForm);
      setNotice(form.thuocID ? 'Đã cập nhật thuốc.' : 'Đã thêm thuốc mới.');
    } catch (_error) {
      setMedicines((current) => {
        if (form.thuocID) {
          return current.map((item) => (item.thuocID === form.thuocID ? payload : item));
        }

        return [{ ...payload, thuocID: Date.now() }, ...current];
      });
      setForm(emptyForm);
      setNotice('Đã lưu tạm trên giao diện vì backend chưa phản hồi.');
    }
  }

  async function deleteMedicine(thuocID) {
    try {
      const response = await fetch(`/api/thuoc/${thuocID}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setNotice('Đã xóa thuốc.');
    } catch (_error) {
      setNotice('Đã xóa khỏi giao diện demo, backend chưa phản hồi.');
    }

    setMedicines((current) => current.filter((item) => item.thuocID !== thuocID));
  }

  const totalStock = medicines.reduce((sum, item) => sum + Number(item.tonKhoHienTai || 0), 0);
  const lowStockCount = medicines.filter((item) => Number(item.tonKhoHienTai) <= Number(item.tonToiThieu)).length;
  const categoryCount = new Set(medicines.map((item) => item.phanLoai || 'Khác')).size;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">Rx</div>
        <h1>QLDM CCDT</h1>
        <nav aria-label="Điều hướng chính">
          <button className="nav-button active" type="button">Danh mục thuốc</button>
          <button className="nav-button" type="button">Chống chỉ định</button>
          <button className="nav-button" type="button">Kho thuốc</button>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Quản lý danh mục</p>
            <h2>Danh mục thuốc</h2>
          </div>
          <div className="sync-state">{loading ? 'Đang tải...' : notice}</div>
        </header>

        <section className="metrics" aria-label="Tổng quan danh mục thuốc">
          <article>
            <span>Tổng thuốc</span>
            <strong>{medicines.length}</strong>
          </article>
          <article>
            <span>Tổng tồn kho</span>
            <strong>{totalStock}</strong>
          </article>
          <article>
            <span>Cần nhập thêm</span>
            <strong>{lowStockCount}</strong>
          </article>
          <article>
            <span>Phân loại</span>
            <strong>{categoryCount}</strong>
          </article>
        </section>

        <section className="content-grid">
          <form className="medicine-form" onSubmit={saveMedicine}>
            <div className="section-heading">
              <h3>{form.thuocID ? 'Sửa thuốc' : 'Thêm thuốc'}</h3>
              {form.thuocID && (
                <button className="ghost-button" type="button" onClick={() => setForm(emptyForm)}>
                  Hủy sửa
                </button>
              )}
            </div>

            <label>
              Mã ATC
              <input
                value={form.maATC}
                onChange={(event) => updateField('maATC', event.target.value.toUpperCase())}
                placeholder="J01CA04"
                required
              />
            </label>
            {formError && <p className="form-error">{formError}</p>}
            <label>
              Tên thương mại
              <input value={form.tenThuongMai} onChange={(event) => updateField('tenThuongMai', event.target.value)} required />
            </label>
            <label>
              Hoạt chất
              <input value={form.hoatChat} onChange={(event) => updateField('hoatChat', event.target.value)} required />
            </label>
            <div className="form-row">
              <label>
                Phân loại
                <select value={form.phanLoai} onChange={(event) => updateField('phanLoai', event.target.value)}>
                  {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <label>
                Đơn vị
                <select value={form.donViTinh} onChange={(event) => updateField('donViTinh', event.target.value)} required>
                  {unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                </select>
              </label>
            </div>
            <label>
              Hàm lượng
              <input value={form.hamLuong} onChange={(event) => updateField('hamLuong', event.target.value)} />
            </label>
            <div className="form-row">
              <label>
                Tồn kho
                <input type="number" min="0" value={form.tonKhoHienTai} onChange={(event) => updateField('tonKhoHienTai', event.target.value)} />
              </label>
              <label>
                Tồn tối thiểu
                <input type="number" min="0" value={form.tonToiThieu} onChange={(event) => updateField('tonToiThieu', event.target.value)} />
              </label>
            </div>
            <label>
              Ngày hết hạn
              <input type="date" value={form.ngayHetHan} onChange={(event) => updateField('ngayHetHan', event.target.value)} />
            </label>
            <button className="primary-button" type="submit">
              {form.thuocID ? 'Cập nhật thuốc' : 'Thêm thuốc'}
            </button>
          </form>

          <section className="table-panel">
            <div className="table-toolbar">
              <h3>Danh sách thuốc</h3>
              <input
                aria-label="Tìm kiếm thuốc"
                placeholder="Tìm mã ATC, tên thuốc, hoạt chất, phân loại"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Mã ATC</th>
                    <th>Tên thuốc</th>
                    <th>Phân loại</th>
                    <th>Hoạt chất</th>
                    <th>Tồn kho</th>
                    <th>Hạn dùng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine) => {
                    const status = stockStatus(medicine);
                    return (
                      <tr key={medicine.thuocID}>
                        <td>{medicine.maATC}</td>
                        <td>
                          <strong>{medicine.tenThuongMai}</strong>
                          <small>{medicine.hamLuong || 'Chưa nhập hàm lượng'}</small>
                        </td>
                        <td>{medicine.phanLoai || 'Khác'}</td>
                        <td>{medicine.hoatChat}</td>
                        <td>{medicine.tonKhoHienTai} {medicine.donViTinh}</td>
                        <td>{formatDate(medicine.ngayHetHan)}</td>
                        <td><span className={`badge ${status.tone}`}>{status.label}</span></td>
                        <td>
                          <div className="row-actions">
                            <button type="button" onClick={() => editMedicine(medicine)}>Sửa</button>
                            <button className="danger-link" type="button" onClick={() => deleteMedicine(medicine.thuocID)}>Xóa</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;
