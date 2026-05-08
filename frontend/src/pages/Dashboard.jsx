import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTables, bookTable, getInvoice, orderItem, getMenu, getCombos, checkout, updateTableStatus, getAllDatBan, createDatBan, updateTrangThaiDatBan, checkVoucher, removeItemFromInvoice, decreaseItemQuantity, cancelInvoice } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [menu, setMenu] = useState([]);
  const [combos, setCombos] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [datBans, setDatBans] = useState([]);
  const [quantities, setQuantities] = useState({}); // { itemKey: quantity }

  
  // Checkout Modal states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Receipt Modal states
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Dat Ban Modal states
  const [showDatBanModal, setShowDatBanModal] = useState(false);
  const [formDatBan, setFormDatBan] = useState({
    TenKhachHang: '',
    SoDienThoai: ''
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
      setMenu(res.data.filter(m => m.TrangThai !== 'Ngừng bán'));
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

  const fetchCombos = async () => {
    try {
      const res = await getCombos();
      setCombos(res.data.filter(c => c.TrangThai !== 'Ngừng hoạt động'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchMenu();
    fetchCombos();
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

  const handleDatBanSubmit = async () => {
    if (!selectedTable) return;
    
    if (!formDatBan.TenKhachHang.trim()) {
      alert('Vui lòng nhập tên khách hàng');
      return;
    }
    
    if (!formDatBan.SoDienThoai.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formDatBan.SoDienThoai)) {
      alert('Số điện thoại không hợp lệ (phải có 10-11 chữ số)');
      return;
    }

    try {
      const res = await bookTable({
        maBan: selectedTable.MaBan,
        maNV: user.MaNV,
        TenKhachHang: formDatBan.TenKhachHang,
        SoDienThoai: formDatBan.SoDienThoai
      });
      alert('Đặt bàn thành công');
      setShowDatBanModal(false);
      setFormDatBan({ TenKhachHang: '', SoDienThoai: '' });
      setInvoice({ MaHD: res.data.maHD, ChiTiet: [], TongTien: 0, TenKhachHang: formDatBan.TenKhachHang, SoDienThoai: formDatBan.SoDienThoai });
      fetchTables();
      setSelectedTable({ ...selectedTable, TrangThai: 'Đang phục vụ' });
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
    const soLuong = quantities[`mon_${mon.MaMon}`] || 1;
    if (Number(soLuong) <= 0) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }
    try {
      await orderItem({
        maHD: invoice.MaHD,
        maMon: mon.MaMon,
        soLuong: Number(soLuong),
        donGia: mon.Gia
      });
      // Refresh invoice
      const res = await getInvoice(selectedTable.MaBan);
      setInvoice(res.data.data);
      // Reset quantity
      setQuantities({ ...quantities, [`mon_${mon.MaMon}`]: 1 });
    } catch (err) {
      alert('Lỗi gọi món');
    }
  };

  const handleGoiCombo = async (combo) => {
    if (!invoice) return;
    const soLuong = quantities[`combo_${combo.MaCombo}`] || 1;
    if (Number(soLuong) <= 0) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }
    try {
      await orderItem({
        maHD: invoice.MaHD,
        maCombo: combo.MaCombo,
        soLuong: Number(soLuong),
        donGia: combo.Gia
      });
      // Refresh invoice
      const res = await getInvoice(selectedTable.MaBan);
      setInvoice(res.data.data);
      // Reset quantity
      setQuantities({ ...quantities, [`combo_${combo.MaCombo}`]: 1 });
    } catch (err) {
      alert('Lỗi gọi combo');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!invoice) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa hẳn món này khỏi hóa đơn?')) return;
    
    try {
      await removeItemFromInvoice(itemId, invoice.MaHD);
      const res = await getInvoice(selectedTable.MaBan);
      setInvoice(res.data.data);
    } catch (err) {
      alert('Lỗi khi xóa món');
    }
  };

  const handleDecreaseQuantity = async (itemId) => {
    if (!invoice) return;
    try {
      await decreaseItemQuantity(itemId, invoice.MaHD);
      const res = await getInvoice(selectedTable.MaBan);
      setInvoice(res.data.data);
    } catch (err) {
      alert('Lỗi khi giảm số lượng');
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

  const handleHuyHoaDon = async () => {
    if (!invoice || !selectedTable) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy hóa đơn này và trả lại bàn trống?')) return;
    
    try {
      await cancelInvoice(invoice.MaHD, selectedTable.MaBan);
      alert('Hủy hóa đơn thành công');
      setSelectedTable(null);
      setInvoice(null);
      fetchTables();
    } catch (err) {
      alert('Lỗi khi hủy hóa đơn');
    }
  };

  const handleConfirmCheckout = async () => {
    if (!invoice || !selectedTable) return;
    try {
      await checkout(invoice.MaHD, selectedTable.MaBan, paymentMethod, voucherCode || null, discountAmount);
      
      // Prepare receipt data
      setReceiptData({
        MaHD: invoice.MaHD,
        TenBan: selectedTable.TenBan,
        TenKhachHang: invoice.TenKhachHang,
        SoDienThoai: invoice.SoDienThoai,
        ChiTiet: invoice.ChiTiet,
        TamTinh: invoice.TongTien,
        GiamGia: discountAmount,
        Voucher: voucherCode,
        TongThanhToan: Math.max(0, invoice.TongTien - discountAmount),
        PhuongThuc: paymentMethod,
        ThoiGian: new Date().toLocaleString('vi-VN'),
        TrangThai: 'Thành công'
      });

      setShowCheckoutModal(false);
      setShowReceipt(true);
      
      // Clear current states (will be refreshed by fetchTables anyway)
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
                <button onClick={() => setShowDatBanModal(true)} className="btn-primary">Đặt bàn và gọi món</button>
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
                  {invoice?.TenKhachHang && <p><strong>Khách hàng:</strong> {invoice.TenKhachHang} - {invoice.SoDienThoai}</p>}
                  <ul className="invoice-items">
                    {invoice?.ChiTiet?.map((item, idx) => (
                      <li key={idx}>
                        <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                          <button 
                            onClick={() => handleDecreaseQuantity(item.ID)} 
                            style={{
                              background: '#2196F3', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '50%', 
                              width: '24px', 
                              height: '24px', 
                              cursor: 'pointer',
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingBottom: '2px'
                            }}
                            title="Giảm 1"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => handleRemoveItem(item.ID)} 
                            style={{
                              background: '#ff4444', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '50%', 
                              width: '24px', 
                              height: '24px', 
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Xóa hẳn"
                          >
                            X
                          </button>
                          <span>{item.TenMon} x {item.SoLuong}</span>
                        </div>
                        <span>{(item.SoLuong * item.DonGia).toLocaleString()} đ</span>
                      </li>
                    ))}
                  </ul>
                  <div className="total">
                    <strong>Tổng tiền: {invoice?.TongTien?.toLocaleString() || 0} đ</strong>
                  </div>
                  {invoice?.ChiTiet?.length > 0 ? (
                    <button onClick={() => setShowCheckoutModal(true)} className="btn-success">Thanh toán</button>
                  ) : (
                    <button onClick={handleHuyHoaDon} className="btn-logout" style={{width: '100%'}}>Hủy hóa đơn & Trả bàn</button>
                  )}
                  
                  <hr/>
                  <h3>Thực đơn</h3>
                  <div className="menu-list">
                    {menu.map(mon => (
                      <div key={mon.MaMon} className={`menu-item ${mon.TrangThai === 'Hết' ? 'out-of-stock' : ''}`}>
                        <span>{mon.TenMon} - {mon.Gia.toLocaleString()} đ {mon.TrangThai === 'Hết' && <strong style={{color:'red'}}>(Hết)</strong>}</span>
                        <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                          <input 
                            type="number" 
                            min="1" 
                            value={quantities[`mon_${mon.MaMon}`] || 1} 
                            onChange={e => setQuantities({...quantities, [`mon_${mon.MaMon}`]: e.target.value})}
                            className="input-quantity"
                            disabled={mon.TrangThai === 'Hết'}
                          />
                          <button onClick={() => handleGoiMon(mon)} className="btn-add" disabled={mon.TrangThai === 'Hết'}>Thêm</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr style={{margin: '15px 0'}}/>
                  <h3>Danh sách Combo</h3>
                  <div className="menu-list">
                    {combos.map(combo => (
                      <div key={combo.MaCombo} className="menu-item combo-item">
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <strong>{combo.TenCombo} - {combo.Gia.toLocaleString()} đ</strong>
                          <small style={{fontSize: '0.8rem', color: '#666'}}>
                            ({combo.ChiTiet.map(ct => ct.TenMon).join(', ')})
                          </small>
                        </div>
                        <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                          <input 
                            type="number" 
                            min="1" 
                            value={quantities[`combo_${combo.MaCombo}`] || 1} 
                            onChange={e => setQuantities({...quantities, [`combo_${combo.MaCombo}`]: e.target.value})}
                            className="input-quantity"
                          />
                          <button onClick={() => handleGoiCombo(combo)} className="btn-add">Thêm</button>
                        </div>
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

      {/* DAT BAN MODAL (Merged) */}
      {showDatBanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Đặt bàn và gọi món</h2>
            <p><strong>Bàn:</strong> {selectedTable?.TenBan}</p>
            
            <div className="form-group">
              <label>Tên khách hàng:</label>
              <input type="text" value={formDatBan.TenKhachHang} onChange={e => setFormDatBan({...formDatBan, TenKhachHang: e.target.value})} placeholder="Nhập tên khách hàng" />
            </div>
            
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input type="text" value={formDatBan.SoDienThoai} onChange={e => setFormDatBan({...formDatBan, SoDienThoai: e.target.value})} placeholder="Nhập số điện thoại" />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowDatBanModal(false)} className="btn-logout">Hủy</button>
              <button onClick={handleDatBanSubmit} className="btn-success">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {showReceipt && receiptData && (
        <div className="modal-overlay">
          <div className="receipt-container">
            <div className="receipt-header">
              <h2>HÓA ĐƠN THANH TOÁN</h2>
              <p>Mã hóa đơn: #{receiptData.MaHD}</p>
              <p>Ngày: {receiptData.ThoiGian}</p>
            </div>
            
            <div className="receipt-info">
              <p><strong>Bàn:</strong> {receiptData.TenBan}</p>
              {receiptData.TenKhachHang && <p><strong>Khách hàng:</strong> {receiptData.TenKhachHang}</p>}
              {receiptData.SoDienThoai && <p><strong>SĐT:</strong> {receiptData.SoDienThoai}</p>}
              <p><strong>Trạng thái:</strong> <span style={{color:'green', fontWeight:'bold'}}>{receiptData.TrangThai}</span></p>
            </div>
            
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Tên món</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {receiptData.ChiTiet.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.TenMon}</td>
                    <td>{item.SoLuong}</td>
                    <td>{item.DonGia.toLocaleString()}</td>
                    <td>{(item.SoLuong * item.DonGia).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="receipt-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{receiptData.TamTinh.toLocaleString()} đ</span>
              </div>
              {receiptData.GiamGia > 0 && (
                <div className="summary-row" style={{color:'red'}}>
                  <span>Giảm giá ({receiptData.Voucher}):</span>
                  <span>-{receiptData.GiamGia.toLocaleString()} đ</span>
                </div>
              )}
              <div className="summary-row total-row">
                <span>TỔNG CỘNG:</span>
                <span>{receiptData.TongThanhToan.toLocaleString()} VNĐ</span>
              </div>
              <div className="summary-row">
                <span>Phương thức:</span>
                <span>{receiptData.PhuongThuc}</span>
              </div>
            </div>
            
            <div className="receipt-footer">
              <p>Cảm ơn quý khách. Hẹn gặp lại!</p>
              <button onClick={() => setShowReceipt(false)} className="btn-success">Đóng & Tiếp tục</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
