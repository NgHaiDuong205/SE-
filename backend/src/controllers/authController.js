const { sql } = require('../config/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const request = new sql.Request();
    request.input('username', sql.VarChar, username);
    request.input('password', sql.VarChar, password);
    
    const result = await request.query(`
      SELECT t.MaTK, t.TenDangNhap, t.VaiTro, t.TrangThai, n.MaNV, n.HoTen
      FROM TaiKhoan t
      LEFT JOIN NhanVien n ON t.MaTK = n.MaTK
      WHERE t.TenDangNhap = @username AND t.MatKhau = @password
    `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    const user = result.recordset[0];

    if (user.TrangThai === 'Ngừng hoạt động') {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    const token = jwt.sign(
      { 
        MaTK: user.MaTK, 
        VaiTro: user.VaiTro, 
        MaNV: user.MaNV,
        HoTen: user.HoTen 
      }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        MaTK: user.MaTK,
        MaNV: user.MaNV,
        HoTen: user.HoTen,
        VaiTro: user.VaiTro
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(`
      SELECT t.MaTK, t.TenDangNhap, t.VaiTro, t.TrangThai, n.MaNV, n.HoTen, n.DiaChi, n.Sdt
      FROM TaiKhoan t
      LEFT JOIN NhanVien n ON t.MaTK = n.MaTK
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const createUser = async (req, res) => {
  try {
    const { TenDangNhap, MatKhau, VaiTro, HoTen, DiaChi, Sdt } = req.body;
    
    // Check if username exists
    const checkReq = new sql.Request();
    checkReq.input('username', sql.VarChar, TenDangNhap);
    const check = await checkReq.query('SELECT * FROM TaiKhoan WHERE TenDangNhap = @username');
    if (check.recordset.length > 0) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });

    // Insert TaiKhoan
    const reqTK = new sql.Request();
    reqTK.input('user', sql.VarChar, TenDangNhap);
    reqTK.input('pass', sql.VarChar, MatKhau);
    reqTK.input('role', sql.NVarChar, VaiTro);
    const resultTK = await reqTK.query(`
      INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro, TrangThai)
      OUTPUT INSERTED.MaTK
      VALUES (@user, @pass, @role, N'Hoạt động')
    `);
    const maTK = resultTK.recordset[0].MaTK;

    // Insert NhanVien
    const reqNV = new sql.Request();
    reqNV.input('hoten', sql.NVarChar, HoTen);
    reqNV.input('diachi', sql.NVarChar, DiaChi);
    reqNV.input('sdt', sql.VarChar, Sdt);
    reqNV.input('matk', sql.Int, maTK);
    await reqNV.query(`
      INSERT INTO NhanVien (HoTen, DiaChi, Sdt, MaTK)
      VALUES (@hoten, @diachi, @sdt, @matk)
    `);

    res.json({ message: 'Tạo tài khoản thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // MaTK
    const { MatKhau, VaiTro, HoTen, DiaChi, Sdt } = req.body;

    const reqTK = new sql.Request();
    reqTK.input('id', sql.Int, id);
    reqTK.input('role', sql.NVarChar, VaiTro);
    
    let updateTkQuery = 'UPDATE TaiKhoan SET VaiTro = @role';
    if (MatKhau) {
      reqTK.input('pass', sql.VarChar, MatKhau);
      updateTkQuery += ', MatKhau = @pass';
    }
    updateTkQuery += ' WHERE MaTK = @id';
    await reqTK.query(updateTkQuery);

    const reqNV = new sql.Request();
    reqNV.input('id', sql.Int, id);
    reqNV.input('hoten', sql.NVarChar, HoTen);
    reqNV.input('diachi', sql.NVarChar, DiaChi);
    reqNV.input('sdt', sql.VarChar, Sdt);
    await reqNV.query(`
      UPDATE NhanVien SET HoTen = @hoten, DiaChi = @diachi, Sdt = @sdt WHERE MaTK = @id
    `);

    res.json({ message: 'Cập nhật tài khoản thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const lockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { TrangThai } = req.body; // 'Ngừng hoạt động' or 'Hoạt động'
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('status', sql.NVarChar, TrangThai);
    await request.query(`UPDATE TaiKhoan SET TrangThai = @status WHERE MaTK = @id`);
    res.json({ message: 'Thay đổi trạng thái tài khoản thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  login,
  getAllUsers,
  createUser,
  updateUser,
  lockUser
};
