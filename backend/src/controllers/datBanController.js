const { sql } = require('../config/db');

// Lấy danh sách đặt bàn chưa xác nhận hoặc đã nhận
const getAllDatBan = async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(`
      SELECT db.*, b.TenBan, nv.HoTen as TenNhanVien 
      FROM DatBan db
      JOIN Ban b ON db.MaBan = b.MaBan
      JOIN NhanVien nv ON db.MaNhanVien = nv.MaNV
      ORDER BY db.NgayTao DESC
    `);
    res.json({ data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đặt bàn' });
  }
};

// Đặt bàn mới
const createDatBan = async (req, res) => {
  try {
    const { MaBan, MaNhanVien, TenKhachHang, SoDienThoai, ThoiGianDat } = req.body;
    
    if (!TenKhachHang || !TenKhachHang.trim()) {
      return res.status(400).json({ message: 'Tên khách hàng là bắt buộc' });
    }
    
    if (!SoDienThoai || !SoDienThoai.trim()) {
      return res.status(400).json({ message: 'Số điện thoại là bắt buộc' });
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(SoDienThoai)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ (phải có 10-11 chữ số)' });
    }
    
    // Kiểm tra bàn có đang trống không
    const checkBan = new sql.Request();
    checkBan.input('maBan', sql.Int, MaBan);
    const banInfo = await checkBan.query('SELECT TrangThai FROM Ban WHERE MaBan = @maBan');
    
    if (banInfo.recordset.length === 0) {
      return res.status(404).json({ message: 'Bàn không tồn tại' });
    }
    
    if (banInfo.recordset[0].TrangThai !== 'Trống') {
      return res.status(400).json({ message: 'Bàn hiện không trống' });
    }

    // Thêm vào bảng DatBan
    const insertRequest = new sql.Request();
    insertRequest.input('maBan', sql.Int, MaBan);
    insertRequest.input('maNhanVien', sql.Int, MaNhanVien);
    insertRequest.input('tenKhach', sql.NVarChar, TenKhachHang);
    insertRequest.input('sdt', sql.VarChar, SoDienThoai);
    insertRequest.input('thoiGian', sql.DateTime, ThoiGianDat);

    await insertRequest.query(`
      INSERT INTO DatBan (MaBan, MaNhanVien, TenKhachHang, SoDienThoai, ThoiGianDat, TrangThai)
      VALUES (@maBan, @maNhanVien, @tenKhach, @sdt, @thoiGian, N'Chờ xác nhận')
    `);

    // Đổi trạng thái bàn thành 'Đã đặt'
    const updateBan = new sql.Request();
    updateBan.input('maBan', sql.Int, MaBan);
    await updateBan.query(`UPDATE Ban SET TrangThai = N'Đã đặt' WHERE MaBan = @maBan`);

    res.json({ message: 'Đặt bàn thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đặt bàn' });
  }
};

// Cập nhật trạng thái đặt bàn (Nhận bàn hoặc Hủy)
const updateTrangThaiDatBan = async (req, res) => {
  try {
    const { id } = req.params; // MaDatBan
    const { TrangThai } = req.body; // 'Đã nhận bàn' hoặc 'Đã hủy'

    // Lấy thông tin đặt bàn
    const getDatBan = new sql.Request();
    getDatBan.input('id', sql.Int, id);
    const datBanResult = await getDatBan.query('SELECT * FROM DatBan WHERE MaDatBan = @id');
    
    if (datBanResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin đặt bàn' });
    }
    const datBanInfo = datBanResult.recordset[0];

    // Cập nhật trạng thái trong bảng DatBan
    const updateDB = new sql.Request();
    updateDB.input('id', sql.Int, id);
    updateDB.input('trangThai', sql.NVarChar, TrangThai);
    await updateDB.query('UPDATE DatBan SET TrangThai = @trangThai WHERE MaDatBan = @id');

    // Cập nhật trạng thái bàn tương ứng
    const updateBan = new sql.Request();
    updateBan.input('maBan', sql.Int, datBanInfo.MaBan);
    
    if (TrangThai === 'Đã nhận bàn') {
      // Khi khách đến nhận bàn, chuyển bàn thành 'Đang phục vụ' và mở Hóa đơn tự động?
      // Hoặc chỉ chuyển trạng thái bàn, hóa đơn sẽ tự mở khi gọi món
      await updateBan.query(`UPDATE Ban SET TrangThai = N'Đang phục vụ' WHERE MaBan = @maBan`);
      
      // Tạo hóa đơn trống để sẵn sàng gọi món
      await updateBan.query(`
        INSERT INTO HoaDon (MaBan, MaNV, TongTien)
        VALUES (@maBan, ${datBanInfo.MaNhanVien}, 0)
      `);
    } else if (TrangThai === 'Đã hủy') {
      // Khi hủy, bàn trở lại 'Trống'
      await updateBan.query(`UPDATE Ban SET TrangThai = N'Trống' WHERE MaBan = @maBan`);
    }

    res.json({ message: 'Cập nhật trạng thái đặt bàn thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái đặt bàn' });
  }
};

module.exports = {
  getAllDatBan,
  createDatBan,
  updateTrangThaiDatBan
};
