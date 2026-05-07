import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getMenu, addMenuItem, updateMenuItem, deleteMenuItem, 
  getUsers, createUser, updateUser, lockUser,
  getCombos, createCombo, updateCombo, deleteCombo,
  getAllInvoices
} from '../services/api';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [users, setUsers] = useState([]);
  const [combos, setCombos] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [filterToday, setFilterToday] = useState(true);

  // States cho tính năng Sửa (Edit)
  const [editMenuId, setEditMenuId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editComboId, setEditComboId] = useState(null);

  // Forms
  const [menuForm, setMenuForm] = useState({ TenMon: '', MoTa: '', Gia: '', TrangThai: 'Còn' });
  const [userForm, setUserForm] = useState({ TenDangNhap: '', MatKhau: '', VaiTro: 'Nhân viên', HoTen: '', DiaChi: '', Sdt: '' });
  const [comboForm, setComboForm] = useState({ TenCombo: '', Gia: '', TrangThai: 'Hoạt động', ChiTiet: [] });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'menu') setMenu((await getMenu()).data);
      if (activeTab === 'users') setUsers((await getUsers()).data);
      if (activeTab === 'invoices') setInvoices((await getAllInvoices()).data);
      if (activeTab === 'combo') {
        setCombos((await getCombos()).data);
        setMenu((await getMenu()).data); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  /* ----- MENU HANDLERS ----- */
  const handleSubmitMenu = async (e) => {
    e.preventDefault();
    try {
      if (editMenuId) {
        await updateMenuItem(editMenuId, menuForm);
        setEditMenuId(null);
      } else {
        await addMenuItem(menuForm);
      }
      setMenuForm({ TenMon: '', MoTa: '', Gia: '', TrangThai: 'Còn' });
      fetchData();
    } catch (err) {
      alert('Lỗi thao tác món ăn');
    }
  };

  const handleEditMenu = (m) => {
    setEditMenuId(m.MaMon);
    setMenuForm({ TenMon: m.TenMon, MoTa: m.MoTa || '', Gia: m.Gia, TrangThai: m.TrangThai });
  };

  const cancelEditMenu = () => {
    setEditMenuId(null);
    setMenuForm({ TenMon: '', MoTa: '', Gia: '', TrangThai: 'Còn' });
  };

  const handleDeleteMenu = async (id) => {
    try {
      console.log('Sending delete request for ID:', id);
      const response = await deleteMenuItem(id);
      console.log('Delete response:', response.data);
      alert('Hệ thống: ' + response.data.message);
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Lỗi khi ngừng bán: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRestoreMenu = async (m) => {
    try {
      await updateMenuItem(m.MaMon, { ...m, TrangThai: 'Còn' });
      fetchData();
    } catch (err) {
      alert('Lỗi khi mở bán lại');
    }
  };

  /* ----- USER HANDLERS ----- */
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        // Khi sửa, không bắt buộc nhập mật khẩu mới
        await updateUser(editUserId, userForm);
        setEditUserId(null);
      } else {
        await createUser(userForm);
      }
      setUserForm({ TenDangNhap: '', MatKhau: '', VaiTro: 'Nhân viên', HoTen: '', DiaChi: '', Sdt: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi thao tác tài khoản');
    }
  };

  const handleEditUser = (u) => {
    setEditUserId(u.MaTK);
    setUserForm({
      TenDangNhap: u.TenDangNhap,
      MatKhau: '', // Không hiển thị mật khẩu cũ
      VaiTro: u.VaiTro,
      HoTen: u.HoTen,
      DiaChi: u.DiaChi || '',
      Sdt: u.Sdt || ''
    });
  };

  const cancelEditUser = () => {
    setEditUserId(null);
    setUserForm({ TenDangNhap: '', MatKhau: '', VaiTro: 'Nhân viên', HoTen: '', DiaChi: '', Sdt: '' });
  };

  const handleLockUser = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Hoạt động' ? 'Ngừng hoạt động' : 'Hoạt động';
    try {
      console.log('Sending lock/unlock request for user ID:', id, 'New status:', newStatus);
      const response = await lockUser(id, newStatus);
      alert('Hệ thống: ' + (response.data.message || 'Thành công'));
      fetchData();
    } catch (err) {
      console.error('Lock user error:', err);
      alert('Lỗi khi thao tác tài khoản: ' + (err.response?.data?.message || err.message));
    }
  };

  /* ----- COMBO HANDLERS ----- */
  const handleSubmitCombo = async (e) => {
    e.preventDefault();
    try {
      if (editComboId) {
        await updateCombo(editComboId, comboForm);
        setEditComboId(null);
      } else {
        await createCombo(comboForm);
      }
      setComboForm({ TenCombo: '', Gia: '', TrangThai: 'Hoạt động', ChiTiet: [] });
      fetchData();
    } catch (err) {
      alert('Lỗi thao tác combo');
    }
  };

  const handleEditCombo = (c) => {
    setEditComboId(c.MaCombo);
    setComboForm({
      TenCombo: c.TenCombo,
      Gia: c.Gia,
      TrangThai: c.TrangThai,
      ChiTiet: c.ChiTiet.map(item => Number(item.MaMon))
    });
  };

  const cancelEditCombo = () => {
    setEditComboId(null);
    setComboForm({ TenCombo: '', Gia: '', TrangThai: 'Hoạt động', ChiTiet: [] });
  };

  const handleDeleteCombo = async (id) => {
    try {
      console.log('Sending delete combo request for ID:', id);
      const response = await deleteCombo(id);
      alert('Hệ thống: ' + response.data.message);
      fetchData();
    } catch (err) {
      console.error('Delete combo error:', err);
      alert('Lỗi khi ngừng bán combo: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRestoreCombo = async (c) => {
    try {
      // Normalize ChiTiet to IDs only
      const chiTietIds = c.ChiTiet.map(item => Number(item.MaMon));
      await updateCombo(c.MaCombo, { ...c, TrangThai: 'Hoạt động', ChiTiet: chiTietIds });
      fetchData();
    } catch (err) {
      alert('Lỗi khi mở bán lại combo');
    }
  };


  const toggleComboItem = (id) => {
    const maMon = Number(id);
    const current = [...comboForm.ChiTiet];
    if (current.includes(maMon)) {
      setComboForm({ ...comboForm, ChiTiet: current.filter(item => item !== maMon) });
    } else {
      setComboForm({ ...comboForm, ChiTiet: [...current, maMon] });
    }
  };

  return (
    <div className="admin-page">
      <header className="header">
        <h1>Bảng Điều Khiển Quản Lý</h1>
        <div className="user-info">
          <span>Xin chào, Admin</span>
          <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
        </div>
      </header>
      
      <div className="tabs">
        <button className={activeTab === 'menu' ? 'active' : ''} onClick={() => setActiveTab('menu')}>Quản lý Thực Đơn</button>
        <button className={activeTab === 'combo' ? 'active' : ''} onClick={() => setActiveTab('combo')}>Quản lý Combo</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Quản lý Tài Khoản</button>
        <button className={activeTab === 'invoices' ? 'active' : ''} onClick={() => setActiveTab('invoices')}>Lịch sử Giao dịch</button>
      </div>

      <div className="admin-content">
        
        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <>
            <div className="form-section">
              <h2>{editMenuId ? 'Sửa Món Ăn' : 'Thêm Món Mới'}</h2>
              <form onSubmit={handleSubmitMenu}>
                <input type="text" placeholder="Tên món" value={menuForm.TenMon} onChange={e => setMenuForm({...menuForm, TenMon: e.target.value})} required />
                <input type="text" placeholder="Mô tả" value={menuForm.MoTa} onChange={e => setMenuForm({...menuForm, MoTa: e.target.value})} />
                <input type="number" placeholder="Giá bán" value={menuForm.Gia} onChange={e => setMenuForm({...menuForm, Gia: e.target.value})} required />
                
                {editMenuId && (
                  <select value={menuForm.TrangThai} onChange={e => setMenuForm({...menuForm, TrangThai: e.target.value})}>
                    <option value="Còn">Còn</option>
                    <option value="Hết">Hết</option>
                    <option value="Ngừng bán">Ngừng bán</option>
                  </select>
                )}

                <div style={{display:'flex', gap:'10px'}}>
                  <button type="submit" className="btn-success" style={{flex:1}}>{editMenuId ? 'Cập nhật' : 'Lưu Món Ăn'}</button>
                  {editMenuId && <button type="button" onClick={cancelEditMenu} className="btn-logout" style={{flex:1}}>Hủy</button>}
                </div>
              </form>
            </div>
            <div className="table-section">
              <h2>Danh sách Thực Đơn</h2>
              <table className="data-table">
                <thead><tr><th>Tên món</th><th>Mô tả</th><th>Giá</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                <tbody>
                  {menu.map(m => (
                    <tr key={m.MaMon}>
                      <td>{m.TenMon}</td><td>{m.MoTa}</td><td>{m.Gia.toLocaleString()} VNĐ</td>
                      <td style={{color: m.TrangThai === 'Ngừng bán' ? 'red' : m.TrangThai === 'Hết' ? 'orange' : 'green', fontWeight:'bold'}}>{m.TrangThai}</td>
                      <td>
                        <button onClick={() => handleEditMenu(m)} className="btn-edit" style={{marginRight: '5px'}}>Sửa</button>
                        {m.TrangThai === 'Ngừng bán' ? (
                          <button onClick={() => handleRestoreMenu(m)} className="btn-success">Mở bán lại</button>
                        ) : (
                          <button 
                            onClick={() => {
                              if (window.confirm('Ngừng bán món này?')) {
                                console.log('Confirm Ngừng bán ID:', m.MaMon);
                                handleDeleteMenu(m.MaMon);
                              }
                            }} 
                            className="btn-danger"
                          >
                            Ngừng bán
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* COMBO TAB */}
        {activeTab === 'combo' && (
          <>
            <div className="form-section">
              <h2>{editComboId ? 'Sửa Combo' : 'Tạo Combo Mới'}</h2>
              <form onSubmit={handleSubmitCombo}>
                <input type="text" placeholder="Tên Combo" value={comboForm.TenCombo} onChange={e => setComboForm({...comboForm, TenCombo: e.target.value})} required />
                <input type="number" placeholder="Giá Combo" value={comboForm.Gia} onChange={e => setComboForm({...comboForm, Gia: e.target.value})} required />
                
                {editComboId && (
                  <select value={comboForm.TrangThai} onChange={e => setComboForm({...comboForm, TrangThai: e.target.value})}>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                  </select>
                )}

                <div className="combo-selector">
                  <h4>Chọn các món trong Combo:</h4>
                  {menu.map(m => (
                    <label key={m.MaMon} style={{display:'block'}}>
                      <input type="checkbox" checked={comboForm.ChiTiet.includes(Number(m.MaMon))} onChange={() => toggleComboItem(m.MaMon)} />
                      {m.TenMon}
                    </label>
                  ))}
                </div>
                
                <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                  <button type="submit" className="btn-success" style={{flex:1}}>{editComboId ? 'Cập nhật' : 'Lưu Combo'}</button>
                  {editComboId && <button type="button" onClick={cancelEditCombo} className="btn-logout" style={{flex:1}}>Hủy</button>}
                </div>
              </form>
            </div>
            <div className="table-section">
              <h2>Danh sách Combo</h2>
              <table className="data-table">
                <thead><tr><th>Tên Combo</th><th>Các món gồm có</th><th>Giá Combo</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                <tbody>
                  {combos.map(c => (
                    <tr key={c.MaCombo}>
                      <td>{c.TenCombo}</td>
                      <td>{c.ChiTiet.map(ct => ct.TenMon).join(', ')}</td>
                      <td>{c.Gia.toLocaleString()} VNĐ</td>
                      <td style={{color: c.TrangThai === 'Ngừng hoạt động' ? 'red' : 'green', fontWeight:'bold'}}>{c.TrangThai}</td>
                      <td>
                        <button onClick={() => handleEditCombo(c)} className="btn-edit" style={{marginRight: '5px'}}>Sửa</button>
                        {c.TrangThai === 'Ngừng hoạt động' ? (
                          <button onClick={() => handleRestoreCombo(c)} className="btn-success">Mở bán lại</button>
                        ) : (
                          <button 
                            onClick={() => {
                              if (window.confirm('Ngừng bán combo này?')) {
                                console.log('Confirm Ngừng bán Combo ID:', c.MaCombo);
                                handleDeleteCombo(c.MaCombo);
                              }
                            }} 
                            className="btn-danger"
                          >
                            Ngừng bán
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <>
            <div className="form-section">
              <h2>{editUserId ? 'Sửa Thông Tin Tài Khoản' : 'Thêm Nhân Viên Mới'}</h2>
              <form onSubmit={handleSubmitUser}>
                <input type="text" placeholder="Họ Tên" value={userForm.HoTen} onChange={e => setUserForm({...userForm, HoTen: e.target.value})} required />
                <input type="text" placeholder="Tên Đăng Nhập" value={userForm.TenDangNhap} onChange={e => setUserForm({...userForm, TenDangNhap: e.target.value})} required disabled={!!editUserId} />
                <input type="password" placeholder={editUserId ? "Nhập mật khẩu mới (nếu muốn đổi)" : "Mật Khẩu"} value={userForm.MatKhau} onChange={e => setUserForm({...userForm, MatKhau: e.target.value})} required={!editUserId} />
                <select value={userForm.VaiTro} onChange={e => setUserForm({...userForm, VaiTro: e.target.value})}>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Quản lý">Quản lý</option>
                </select>
                <input type="text" placeholder="Địa chỉ" value={userForm.DiaChi} onChange={e => setUserForm({...userForm, DiaChi: e.target.value})} />
                <input type="text" placeholder="SĐT" value={userForm.Sdt} onChange={e => setUserForm({...userForm, Sdt: e.target.value})} />
                
                <div style={{display:'flex', gap:'10px'}}>
                  <button type="submit" className="btn-success" style={{flex:1}}>{editUserId ? 'Cập nhật' : 'Tạo Tài Khoản'}</button>
                  {editUserId && <button type="button" onClick={cancelEditUser} className="btn-logout" style={{flex:1}}>Hủy</button>}
                </div>
              </form>
            </div>
            <div className="table-section">
              <h2>Danh sách Tài Khoản</h2>
              <table className="data-table">
                <thead><tr><th>Họ Tên</th><th>Tên Đăng Nhập</th><th>Vai Trò</th><th>Trạng Thái</th><th>Thao tác</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.MaTK}>
                      <td>{u.HoTen}</td><td>{u.TenDangNhap}</td><td>{u.VaiTro}</td>
                      <td style={{color: u.TrangThai === 'Hoạt động' ? 'green' : 'red'}}>{u.TrangThai}</td>
                      <td>
                        <button onClick={() => handleEditUser(u)} className="btn-edit" style={{marginRight: '5px'}}>Sửa</button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Xác nhận ${u.TrangThai === 'Hoạt động' ? 'Khóa' : 'Mở'} tài khoản này?`)) {
                              handleLockUser(u.MaTK, u.TrangThai);
                            }
                          }} 
                          className="btn-danger"
                        >
                          {u.TrangThai === 'Hoạt động' ? 'Khóa TK' : 'Mở Khóa'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="table-section" style={{flex: '1 1 100%'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2>Danh sách Giao dịch & Hóa đơn</h2>
              <label style={{fontWeight:'bold', cursor:'pointer'}}>
                <input type="checkbox" checked={filterToday} onChange={e => setFilterToday(e.target.checked)} style={{marginRight:'5px'}} />
                Chỉ hiện doanh thu hôm nay
              </label>
            </div>
            <table className="data-table" style={{marginTop:'15px'}}>
              <thead><tr><th>Mã HD</th><th>Bàn</th><th>Khách hàng</th><th>Thu Ngân</th><th>Giờ Lập</th><th>Phương Thức</th><th>Tổng Tiền</th></tr></thead>
              <tbody>
                {invoices
                  .filter(inv => {
                    if (!filterToday) return true;
                    const today = new Date().toISOString().split('T')[0];
                    return inv.NgayLap && inv.NgayLap.startsWith(today);
                  })
                  .map(inv => (
                  <tr key={inv.MaHD}>
                    <td>#{inv.MaHD}</td>
                    <td>{inv.TenBan}</td>
                    <td>{inv.TenKhachHang || 'Vãng lai'}</td>
                    <td>{inv.ThuNgan || 'Không rõ'}</td>
                    <td>{new Date(inv.NgayLap).toLocaleString('vi-VN')}</td>
                    <td>{inv.PhuongThucThanhToan || 'Tiền mặt'}</td>
                    <td style={{fontWeight:'bold', color:'green'}}>{inv.TongTien.toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
