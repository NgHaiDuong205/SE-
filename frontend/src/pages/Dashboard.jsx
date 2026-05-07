import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTables, bookTable, getInvoice, orderItem, getMenu, checkout, updateTableStatus, getAllDatBan, createDatBan, updateTrangThaiDatBan, checkVoucher } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [menu, setMenu] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [datBans, setDatBans] = useState([]);
  
  // Checkout Modal states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Dat Ban Modal states
  const [showDatBanModal, setShowDatBanModal] = useState(false);
  const [formDatBan, setFormDatBan] = useState({
    TenKhachHang: '',
    SoDienThoai: '',
    ThoiGianDat: ''
  });

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

  const fetchDatBans = async () => {
    try {
      const res = await getAllDatBan();
      setDatBans(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchMenu();
    fetchDatBans();
  }, []);

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    if (table.TrangThai === 'Đang phục vụ') {
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

  const handleDatBanSubmit = async () => {
    if (!selectedTable) return;
    try {
      await createDatBan({
        MaBan: selectedTable.MaBan,
        MaNhanVien: user.MaNV,
        TenKhachHang: formDatBan.TenKhachHang,
        SoDienThoai: formDatBan.SoDienThoai,
        ThoiGianDat: formDatBan.ThoiGianDat
      });
      alert('Đặt bàn thành công');
      setShowDatBanModal(false);
      setFormDatBan({ TenKhachHang: '', SoDienThoai: '', ThoiGianDat: '' });
      fetchTables();
      fetchDatBans();
      setSelectedTable({ ...selectedTable, TrangThai: 'Đã đặt' });
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi đặt bàn');
    }
  };

  const handleNhanBan = async (maDatBan) => {
    try {
      await updateTrangThaiDatBan(maDatBan, 'Đã nhận bàn');
      alert('Nhận bàn thành công, đã chuyển sang Đang phục vụ');
      fetchTables();
      fetchDatBans();
      setSelectedTable({ ...selectedTable, TrangThai: 'Đang phục vụ' });
      // Refresh invoice to show the empty invoice
      const res = await getInvoice(selectedTable.MaBan);
      if(res.data && res.data.data) setInvoice(res.data.data);
    } catch (err) {
      alert('Lỗi khi nhận bàn');
    }
  };

  const handleHuyDatBan = async (maDatBan) => {
    try {
      await updateTrangThaiDatBan(maDatBan, 'Đã hủy');
      alert('Hủy đặt bàn thành công');
      fetchTables();
      fetchDatBans();
      setSelectedTable({ ...selectedTable, TrangThai: 'Trống' });
    } catch (err) {
      alert('Lỗi khi hủy đặt bàn');
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

  const handleCheckVoucher = async () => {
    if (!voucherCode.trim()) {
      alert('Vui lòng nhập mã voucher');
      return;
    }
    try {
      const res = await checkVoucher(voucherCode, invoice.TongTien);
      setDiscountAmount(res.data.tienGiam);
      alert(`Áp dụng thành công! Được giảm ${res.data.phanTram}%`);
    } catch (err) {
      alert(err.response?.data?.message || 'Mã voucher không hợp lệ');
      setDiscountAmount(0);
    }
  };

  const handleConfirmCheckout = async () => {
    if (!invoice || !selectedTable) return;
    try {
      await checkout(invoice.MaHD, selectedTable.MaBan, paymentMethod, voucherCode || null, discountAmount);
      alert('Thanh toán thành công!');
      setShowCheckoutModal(false);
      setSelectedTable(null);
      setInvoice(null);
      setPaymentMethod('Tiền mặt');
      setVoucherCode('');
      setDiscountAmount(0);
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
              className={`table-card ${table.TrangThai === 'Trống' ? 'empty' : table.TrangThai === 'Đã đặt' ? 'reserved' : 'occupied'} ${selectedTable?.MaBan === table.MaBan ? 'selected' : ''}`}
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
                <>
                  <button onClick={handleDatBan} className="btn-primary" style={{marginBottom: '10px'}}>Mở Bàn (Phục vụ)</button>
                  <button onClick={() => setShowDatBanModal(true)} className="btn-warning">Đặt bàn trước</button>
                </>
              ) : selectedTable.TrangThai === 'Đã đặt' ? (
                (() => {
                  const datBanInfo = datBans.find(d => d.MaBan === selectedTable.MaBan && d.TrangThai === 'Chờ xác nhận');
                  return datBanInfo ? (
                    <div className="reservation-details">
                      <h3>Thông tin đặt bàn</h3>
                      <p><strong>Khách hàng:</strong> {datBanInfo.TenKhachHang}</p>
                      <p><strong>SĐT:</strong> {datBanInfo.SoDienThoai}</p>
                      <p><strong>Thời gian đến:</strong> {new Date(datBanInfo.ThoiGianDat).toLocaleString('vi-VN')}</p>
                      <p><strong>Người nhận đặt:</strong> {datBanInfo.TenNhanVien}</p>
                      <hr/>
                      <button onClick={() => handleNhanBan(datBanInfo.MaDatBan)} className="btn-success" style={{marginBottom: '10px'}}>Khách nhận bàn</button>
                      <button onClick={() => handleHuyDatBan(datBanInfo.MaDatBan)} className="btn-logout" style={{width: '100%'}}>Hủy đặt bàn</button>
                    </div>
                  ) : <p>Đang tải thông tin đặt bàn...</p>;
                })()
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
            <p><strong>Giờ vào:</strong> {new Date(invoice.NgayLap).toLocaleString('vi-VN')}</p>
            
            <div className="invoice-preview-list">
              {invoice.ChiTiet?.map((item, idx) => (
                <div key={idx} className="invoice-preview-item">
                  <span>{item.TenMon} (x{item.SoLuong})</span>
                  <span>{(item.SoLuong * item.DonGia).toLocaleString()} đ</span>
                </div>
              ))}
            </div>
            
            <h3 className="modal-total" style={{marginBottom: '10px'}}>Tổng cộng: <span>{invoice.TongTien.toLocaleString()} đ</span></h3>
            
            <div className="voucher-section">
              <input type="text" placeholder="Nhập mã giảm giá..." value={voucherCode} onChange={e => setVoucherCode(e.target.value)} />
              <button onClick={handleCheckVoucher} className="btn-primary" style={{width: 'auto'}}>Áp dụng</button>
            </div>
            {discountAmount > 0 && (
              <h4 className="modal-discount" style={{color:'red', textAlign: 'right', margin: '5px 0'}}>
                Được giảm: -{discountAmount.toLocaleString()} đ
              </h4>
            )}
            
            <h2 className="modal-total" style={{marginTop: '15px'}}>
              Thanh toán: <span style={{color:'green'}}>{Math.max(0, invoice.TongTien - discountAmount).toLocaleString()} VNĐ</span>
            </h2>
            
            <div className="payment-method-selector">
              <label><strong>Phương thức thanh toán:</strong></label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Quẹt thẻ">Quẹt thẻ (POS)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={() => {setShowCheckoutModal(false); setVoucherCode(''); setDiscountAmount(0);}} className="btn-logout">Hủy</button>
              <button onClick={handleConfirmCheckout} className="btn-success">Xác nhận Thanh toán</button>
            </div>
          </div>
        </div>
      )}

      {/* DAT BAN MODAL */}
      {showDatBanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Đặt Bàn Trước</h2>
            <p><strong>Bàn:</strong> {selectedTable?.TenBan}</p>
            
            <div className="form-group">
              <label>Tên khách hàng:</label>
              <input type="text" value={formDatBan.TenKhachHang} onChange={e => setFormDatBan({...formDatBan, TenKhachHang: e.target.value})} placeholder="Nhập tên khách hàng" />
            </div>
            
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input type="text" value={formDatBan.SoDienThoai} onChange={e => setFormDatBan({...formDatBan, SoDienThoai: e.target.value})} placeholder="Nhập số điện thoại" />
            </div>
            
            <div className="form-group">
              <label>Thời gian đến:</label>
              <input type="datetime-local" value={formDatBan.ThoiGianDat} onChange={e => setFormDatBan({...formDatBan, ThoiGianDat: e.target.value})} />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowDatBanModal(false)} className="btn-logout">Hủy</button>
              <button onClick={handleDatBanSubmit} className="btn-success">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
