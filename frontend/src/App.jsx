import React, { useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">M</div>
          <div className="logo-text">MedDirectory</div>
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span>📊 Bảng điều khiển</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'thuoc' ? 'active' : ''}`}
          onClick={() => setActiveTab('thuoc')}
        >
          <span>💊 Danh mục thuốc</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'chongchidinh' ? 'active' : ''}`}
          onClick={() => setActiveTab('chongchidinh')}
        >
          <span>🚫 Chống chỉ định</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>{activeTab === 'dashboard' ? 'Bảng điều khiển' : 'Danh mục thuốc'}</h1>
          <div className="user-profile">
            <span>Bác sĩ Hiến</span>
            <div className="avatar">H</div>
          </div>
        </div>

        <div className="page-content">
          {activeTab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-title">Tổng số thuốc</div>
                  <div className="stat-value">1,245</div>
                </div>
                <div className="stat-card danger">
                  <div className="stat-title">Sắp hết hàng (Dưới mức tối thiểu)</div>
                  <div className="stat-value">15</div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-title">Sắp hết hạn</div>
                  <div className="stat-value">28</div>
                </div>
                <div className="stat-card danger">
                  <div className="stat-title">Chống chỉ định</div>
                  <div className="stat-value">368</div>
                </div>
              </div>

              <h2 className="section-title">Cảnh báo hệ thống gần đây</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Nội dung cảnh báo</th>
                    <th>Mức độ</th>
                    <th>Người xử lý</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hôm nay 08:30</td>
                    <td>Thuốc <b>Ibuprofen 400mg</b> tồn kho hiện tại (12) rớt xuống dưới mức tối thiểu (50). Đề nghị nhập thêm!</td>
                    <td><span className="badge warning">Cảnh báo Tồn kho</span></td>
                    <td>Hệ thống</td>
                  </tr>
                  <tr>
                    <td>20/05/2026 09:15</td>
                    <td>Kê đơn Amoxicillin + Warfarin (Tương tác thuốc)</td>
                    <td><span className="badge danger">Tuyệt đối</span></td>
                    <td>Trần Minh Anh</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'thuoc' && (
            <>
              <h2 className="section-title">Quản lý danh mục thuốc</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã Thuốc</th>
                    <th>Tên Thuốc</th>
                    <th>Hoạt chất</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AMX500</td>
                    <td>Amoxicillin 500mg</td>
                    <td>Amoxicillin</td>
                    <td>348</td>
                    <td><span className="badge success">Còn hạn</span></td>
                  </tr>
                  <tr style={{ backgroundColor: '#fffbeb' }}>
                    <td>IBU400</td>
                    <td>Ibuprofen 400mg</td>
                    <td>Ibuprofen</td>
                    <td style={{ color: '#d97706', fontWeight: 'bold' }}>
                      12 <span style={{fontSize: '12px', fontWeight: 'normal'}}> / 50 (Tối thiểu)</span>
                      <br/><span className="badge warning" style={{marginTop: '4px', display: 'inline-block'}}>Sắp hết hàng</span>
                    </td>
                    <td><span className="badge success">Còn hạn</span></td>
                  </tr>
                  <tr className="expired-row">
                    <td>VTM-C</td>
                    <td>Vitamin C 500mg</td>
                    <td>Ascorbic Acid</td>
                    <td>0</td>
                    <td><span className="badge secondary">Hết hạn</span></td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
