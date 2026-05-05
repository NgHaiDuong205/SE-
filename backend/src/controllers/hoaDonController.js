const { sql } = require('../config/db');

// Lấy hóa đơn chưa thanh toán của 1 bàn
const getHoaDonByBan = async (req, res) => {
  try {
    const { maBan } = req.params;
    const request = new sql.Request();
    request.input('maBan', sql.Int, maBan);
    
    const hdResult = await request.query(`
      SELECT * FROM HoaDon 
      WHERE MaBan = @maBan AND TrangThai = N'Chưa thanh toán'
    `);
    
    if (hdResult.recordset.length === 0) {
      return res.json({ message: 'Bàn chưa có hóa đơn', data: null });
    }
    
    const hoadon = hdResult.recordset[0];
    
    // Lấy chi tiết hóa đơn
    const cthdReq = new sql.Request();
    cthdReq.input('maHD', sql.Int, hoadon.MaHD);
    const cthdResult = await cthdReq.query(`
      SELECT c.*, m.TenMon 
      FROM ChiTietHoaDon c
      JOIN MonAn m ON c.MaMon = m.MaMon
      WHERE c.MaHD = @maHD
    `);
    
    hoadon.ChiTiet = cthdResult.recordset;
    res.json({ data: hoadon });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đặt bàn / Tạo hóa đơn mới
const datBan = async (req, res) => {
  try {
    const { maBan, maNV } = req.body;
    
    // Tạo hóa đơn
    const request = new sql.Request();
    request.input('maBan', sql.Int, maBan);
    request.input('maNV', sql.Int, maNV);
    
    const result = await request.query(`
      INSERT INTO HoaDon (NgayLap, TongTien, TrangThai, MaNV, MaBan)
      OUTPUT INSERTED.MaHD
      VALUES (GETDATE(), 0, N'Chưa thanh toán', @maNV, @maBan)
    `);
    
    // Cập nhật trạng thái bàn
    const updateBan = new sql.Request();
    updateBan.input('maBan', sql.Int, maBan);
    await updateBan.query(`UPDATE Ban SET TrangThai = N'Đang phục vụ' WHERE MaBan = @maBan`);
    
    res.json({ message: 'Đặt bàn thành công', maHD: result.recordset[0].MaHD });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Gọi món (Thêm vào ChiTietHoaDon và cập nhật tổng tiền)
const goiMon = async (req, res) => {
  try {
    const { maHD, maMon, soLuong, donGia } = req.body;
    
    const request = new sql.Request();
    request.input('maHD', sql.Int, maHD);
    request.input('maMon', sql.Int, maMon);
    request.input('soLuong', sql.Int, soLuong);
    request.input('donGia', sql.Decimal(18,2), donGia);
    
    // Kiểm tra xem món đã có trong hóa đơn chưa
    const checkReq = new sql.Request();
    checkReq.input('maHD', sql.Int, maHD);
    checkReq.input('maMon', sql.Int, maMon);
    const checkRes = await checkReq.query('SELECT * FROM ChiTietHoaDon WHERE MaHD = @maHD AND MaMon = @maMon');
    
    if (checkRes.recordset.length > 0) {
      // Đã có -> Cập nhật số lượng
      await request.query(`
        UPDATE ChiTietHoaDon 
        SET SoLuong = SoLuong + @soLuong 
        WHERE MaHD = @maHD AND MaMon = @maMon
      `);
    } else {
      // Chưa có -> Thêm mới
      await request.query(`
        INSERT INTO ChiTietHoaDon (MaHD, MaMon, SoLuong, DonGia)
        VALUES (@maHD, @maMon, @soLuong, @donGia)
      `);
    }
    
    // Cập nhật tổng tiền hóa đơn
    const updateHD = new sql.Request();
    updateHD.input('maHD', sql.Int, maHD);
    await updateHD.query(`
      UPDATE HoaDon 
      SET TongTien = (SELECT SUM(SoLuong * DonGia) FROM ChiTietHoaDon WHERE MaHD = @maHD)
      WHERE MaHD = @maHD
    `);
    
    res.json({ message: 'Gọi món thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thanh toán
const thanhToan = async (req, res) => {
  try {
    const { maHD, maBan, phuongThuc } = req.body;
    const pt = phuongThuc || N'Tiền mặt';
    
    // Cập nhật hóa đơn
    const reqHD = new sql.Request();
    reqHD.input('maHD', sql.Int, maHD);
    reqHD.input('phuongThuc', sql.NVarChar, pt);
    await reqHD.query(`UPDATE HoaDon SET TrangThai = N'Đã thanh toán', PhuongThucThanhToan = @phuongThuc, ThoiGianRa = GETDATE() WHERE MaHD = @maHD`);
    
    // Giải phóng bàn
    const reqBan = new sql.Request();
    reqBan.input('maBan', sql.Int, maBan);
    await reqBan.query(`UPDATE Ban SET TrangThai = N'Trống' WHERE MaBan = @maBan`);
    
    res.json({ message: 'Thanh toán thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(`
      SELECT h.MaHD, h.ThoiGianVao, h.ThoiGianRa, h.TongTien, h.PhuongThucThanhToan, b.TenBan, n.HoTen as ThuNgan
      FROM HoaDon h
      JOIN Ban b ON h.MaBan = b.MaBan
      LEFT JOIN NhanVien n ON h.MaNV = n.MaNV
      WHERE h.TrangThai = N'Đã thanh toán'
      ORDER BY h.ThoiGianRa DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getHoaDonByBan,
  datBan,
  goiMon,
  thanhToan,
  getAllInvoices
};
