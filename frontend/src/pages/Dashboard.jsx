import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTables, bookTable, getInvoice, orderItem, getMenu, checkout, updateTableStatus } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [menu, setMenu] = useState([]);
  const [invoice, setInvoice] = useState(null);
  
  // Checkout Modal states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchTables = async () => {
    try {
      const res = await getTables();
      setTables(res.data);
    } catch (err) {
      if(err.response?.status === 401) navigate('/login');
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await getMenu();
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchMenu();
  }, []);

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    if (table.TrangThai !== 'Trống') {
      try {
        const res = await getInvoice(table.MaBan);
        if (res.data.data) {
          setInvoice(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setInvoice(null);
    }
  };

  const handleDatBan = async () => {
    if (!selectedTable) return;
    try {
      const res = await bookTable(selectedTable.MaBan, user.MaNV);
      setInvoice({ MaHD: res.data.maHD, ChiTiet: [], TongTien: 0 });
      fetchTables();
      setSelectedTable({ ...selectedTable, TrangThai: 'Đang phục vụ' });
    } catch (err) {
      alert('Lỗi đặt bàn');
    }
  };

  const handleGoiMon = async (mon) => {
    if (!invoice) return;
    try {
      await orderItem({
        maHD: invoice.MaHD,
        maMon: mon.MaMon,
        soLuong: 1,
        donGia: mon.Gia
      });
      // Refresh invoice
      const res = await getInvoice(selectedTable.MaBan);
      setInvoice(res.data.data);
    } catch (err) {
      alert('Lỗi gọi món');
    }
  };

  const handleConfirmCheckout = async () => {
    if (!invoice || !selectedTable) return;
    try {
      await checkout(invoice.MaHD, selectedTable.MaBan, paymentMethod);
      alert('Thanh toán thành công!');
      setShowCheckoutModal(false);
      setSelectedTable(null);
      setInvoice(null);
      setPaymentMethod('Tiền mặt');
      fetchTables();
    } catch (err) {
      alert('Lỗi thanh toán');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Sơ Đồ Bàn - Nhà Hàng</h1>
        <div className="user-info">
          <span>Xin chào, {user?.HoTen}</span>
          <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
        </div>
      </header>
      
      <div className="main-content">
        <div className="table-grid">
          {tables.map(table => (
            <div 
              key={table.MaBan} 
              className={`table-card ${table.TrangThai === 'Trống' ? 'empty' : 'occupied'} ${selectedTable?.MaBan === table.MaBan ? 'selected' : ''}`}
              onClick={() => handleTableClick(table)}
            >
              <h3>{table.TenBan}</h3>
              <p>{table.TrangThai}</p>
            </div>
          ))}
        </div>

        <div className="side-panel">
          {selectedTable ? (
            <div className="table-details">
              <h2>{selectedTable.TenBan}</h2>
              <p style={{margin: '10px 0', fontSize: '1.1rem', fontWeight: 'bold'}}>Trạng thái: {selectedTable.TrangThai}</p>
              <hr/>

              {selectedTable.TrangThai === 'Trống' ? (
                <button onClick={handleDatBan} className="btn-primary">Mở Bàn (Phục vụ)</button>
              ) : (
                <div className="order-section">
                  <h3>Hóa đơn (Mã HD: {invoice?.MaHD})</h3>
                  <ul className="invoice-items">
                    {invoice?.ChiTiet?.map((item, idx) => (
                      <li key={idx}>
                        <span>{item.TenMon} x {item.SoLuong}</span>
                        <span>{(item.SoLuong * item.DonGia).toLocaleString()} đ</span>
                      </li>
                    ))}
                  </ul>
                  <div className="total">
                    <strong>Tổng tiền: {invoice?.TongTien?.toLocaleString() || 0} đ</strong>
                  </div>
                  <button onClick={() => setShowCheckoutModal(true)} className="btn-success">Thanh toán</button>
                  
                  <hr/>
                  <h3>Thực đơn</h3>
                  <div className="menu-list">
                    {menu.map(mon => (
                      <div key={mon.MaMon} className="menu-item">
                        <span>{mon.TenMon} - {mon.Gia.toLocaleString()} đ</span>
                        <button onClick={() => handleGoiMon(mon)} className="btn-add">+</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>Chọn một bàn để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && invoice && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Chi tiết Hóa đơn #{invoice.MaHD}</h2>
            <p><strong>Bàn:</strong> {selectedTable?.TenBan}</p>
            <p><strong>Giờ vào:</strong> {new Date(invoice.ThoiGianVao).toLocaleString('vi-VN')}</p>
            
            <div className="invoice-preview-list">
              {invoice.ChiTiet?.map((item, idx) => (
                <div key={idx} className="invoice-preview-item">
                  <span>{item.TenMon} (x{item.SoLuong})</span>
                  <span>{(item.SoLuong * item.DonGia).toLocaleString()} đ</span>
                </div>
              ))}
            </div>
            
            <h3 className="modal-total">Tổng thanh toán: <span style={{color:'green'}}>{invoice.TongTien.toLocaleString()} VNĐ</span></h3>
            
            <div className="payment-method-selector">
              <label><strong>Phương thức thanh toán:</strong></label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Quẹt thẻ">Quẹt thẻ (POS)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowCheckoutModal(false)} className="btn-logout">Hủy</button>
              <button onClick={handleConfirmCheckout} className="btn-success">Xác nhận Thanh toán</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
