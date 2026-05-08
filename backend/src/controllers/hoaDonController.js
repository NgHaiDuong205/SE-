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
      SELECT c.*, ISNULL(m.TenMon, cb.TenCombo) as TenMon 
      FROM ChiTietHoaDon c
      LEFT JOIN MonAn m ON c.MaMon = m.MaMon
      LEFT JOIN Combo cb ON c.MaCombo = cb.MaCombo
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
    const { maBan, maNV, TenKhachHang, SoDienThoai } = req.body;
    
    // Tạo hóa đơn
    const request = new sql.Request();
    request.input('maBan', sql.Int, maBan);
    request.input('maNV', sql.Int, maNV);
    request.input('tenKH', sql.NVarChar, TenKhachHang || null);
    request.input('sdt', sql.VarChar, SoDienThoai || null);
    
    const result = await request.query(`
      INSERT INTO HoaDon (NgayLap, TongTien, TrangThai, MaNV, MaBan, TenKhachHang, SoDienThoai)
      OUTPUT INSERTED.MaHD
      VALUES (GETDATE(), 0, N'Chưa thanh toán', @maNV, @maBan, @tenKH, @sdt)
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
    const { maHD, maMon, maCombo, soLuong, donGia } = req.body;
    
    if (Number(soLuong) <= 0) {
      return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
    }
    if (Number(donGia) < 0) {
      return res.status(400).json({ message: 'Đơn giá không được âm' });
    }
    
    const request = new sql.Request();
    request.input('maHD', sql.Int, maHD);
    if (maMon) request.input('maMon', sql.Int, maMon);
    if (maCombo) request.input('maCombo', sql.Int, maCombo);
    request.input('soLuong', sql.Int, soLuong);
    request.input('donGia', sql.Decimal(18,2), donGia);
    
    // Kiểm tra xem món/combo đã có trong hóa đơn chưa
    const checkReq = new sql.Request();
    checkReq.input('maHD', sql.Int, maHD);
    let checkQuery = 'SELECT * FROM ChiTietHoaDon WHERE MaHD = @maHD';
    if (maMon) {
      checkReq.input('maMon', sql.Int, maMon);
      checkQuery += ' AND MaMon = @maMon';
    } else if (maCombo) {
      checkReq.input('maCombo', sql.Int, maCombo);
      checkQuery += ' AND MaCombo = @maCombo';
    }

    const checkRes = await checkReq.query(checkQuery);
    
    if (checkRes.recordset.length > 0) {
      // Đã có -> Cập nhật số lượng
      let updateQuery = 'UPDATE ChiTietHoaDon SET SoLuong = SoLuong + @soLuong WHERE MaHD = @maHD';
      if (maMon) updateQuery += ' AND MaMon = @maMon';
      if (maCombo) updateQuery += ' AND MaCombo = @maCombo';
      await request.query(updateQuery);
    } else {
      // Chưa có -> Thêm mới
      let insertQuery = '';
      if (maMon) {
        insertQuery = 'INSERT INTO ChiTietHoaDon (MaHD, MaMon, SoLuong, DonGia) VALUES (@maHD, @maMon, @soLuong, @donGia)';
      } else if (maCombo) {
        insertQuery = 'INSERT INTO ChiTietHoaDon (MaHD, MaCombo, SoLuong, DonGia) VALUES (@maHD, @maCombo, @soLuong, @donGia)';
      }
      await request.query(insertQuery);
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
    const { maHD, maBan, phuongThuc, maVoucher, tienGiam } = req.body;
    
    if (tienGiam && Number(tienGiam) < 0) {
      return res.status(400).json({ message: 'Số tiền giảm không được âm' });
    }
    const pt = phuongThuc || 'Tiền mặt';
    
    // Kiểm tra xem hóa đơn có món nào không
    const checkItems = new sql.Request();
    checkItems.input('maHD', sql.Int, maHD);
    const itemsResult = await checkItems.query('SELECT COUNT(*) as count FROM ChiTietHoaDon WHERE MaHD = @maHD');
    if (itemsResult.recordset[0].count === 0) {
      return res.status(400).json({ message: 'Không thể thanh toán hóa đơn không có món ăn' });
    }

    // Cập nhật hóa đơn
    const reqHD = new sql.Request();
    reqHD.input('maHD', sql.Int, maHD);
    reqHD.input('phuongThuc', sql.NVarChar, pt);
    
    if (tienGiam && maVoucher) {
      reqHD.input('tienGiam', sql.Decimal(18,2), tienGiam);
      await reqHD.query(`UPDATE HoaDon SET TrangThai = N'Đã thanh toán', PhuongThucThanhToan = @phuongThuc, TongTien = TongTien - @tienGiam WHERE MaHD = @maHD`);
      
      const reqVoucher = new sql.Request();
      reqVoucher.input('maVoucher', sql.VarChar, maVoucher);
      await reqVoucher.query(`UPDATE Voucher SET SoLuong = SoLuong - 1 WHERE MaVoucher = @maVoucher`);
    } else {
      await reqHD.query(`UPDATE HoaDon SET TrangThai = N'Đã thanh toán', PhuongThucThanhToan = @phuongThuc WHERE MaHD = @maHD`);
    }
    
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
      SELECT h.MaHD, h.NgayLap, h.TongTien, h.PhuongThucThanhToan, h.TenKhachHang, b.TenBan, n.HoTen as ThuNgan
      FROM HoaDon h
      JOIN Ban b ON h.MaBan = b.MaBan
      LEFT JOIN NhanVien n ON h.MaNV = n.MaNV
      WHERE h.TrangThai = N'Đã thanh toán'
      ORDER BY h.NgayLap DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Check Voucher
const checkVoucher = async (req, res) => {
  try {
    const { maVoucher, tongTien } = req.body;
    
    if (!maVoucher) return res.status(400).json({ message: 'Vui lòng nhập mã voucher' });

    const request = new sql.Request();
    request.input('maVoucher', sql.VarChar, maVoucher);
    const result = await request.query('SELECT * FROM Voucher WHERE MaVoucher = @maVoucher');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Mã voucher không tồn tại' });
    }
    
    const voucher = result.recordset[0];
    
    if (voucher.TrangThai !== 'Hoạt động' || voucher.SoLuong <= 0) {
      return res.status(400).json({ message: 'Mã voucher đã hết hạn hoặc hết lượt sử dụng' });
    }
    
    if (new Date(voucher.NgayHetHan) < new Date()) {
      return res.status(400).json({ message: 'Mã voucher đã quá hạn sử dụng' });
    }
    
    // Tính tiền giảm
    let tienGiam = (tongTien * voucher.PhanTramGiam) / 100;
    if (voucher.GiamToiDa && tienGiam > voucher.GiamToiDa) {
      tienGiam = voucher.GiamToiDa;
    }
    
    res.json({ message: 'Áp dụng mã thành công', tienGiam, phanTram: voucher.PhanTramGiam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa món khỏi hóa đơn
const xoaMon = async (req, res) => {
  try {
    const { id, maHD } = req.body; // id là ID của ChiTietHoaDon
    
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    await request.query(`DELETE FROM ChiTietHoaDon WHERE ID = @id`);
    
    // Cập nhật lại tổng tiền hóa đơn
    const updateHD = new sql.Request();
    updateHD.input('maHD', sql.Int, maHD);
    await updateHD.query(`
      UPDATE HoaDon 
      SET TongTien = ISNULL((SELECT SUM(SoLuong * DonGia) FROM ChiTietHoaDon WHERE MaHD = @maHD), 0)
      WHERE MaHD = @maHD
    `);
    
    res.json({ message: 'Xóa món thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Giảm số lượng hoặc xóa món khỏi hóa đơn
const giamSoLuong = async (req, res) => {
  try {
    const { id, maHD } = req.body; // id là ID của ChiTietHoaDon
    
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    
    // Kiểm tra số lượng hiện tại
    const checkRes = await request.query(`SELECT SoLuong FROM ChiTietHoaDon WHERE ID = @id`);
    if (checkRes.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy món trong hóa đơn' });
    }
    
    const hienTai = checkRes.recordset[0].SoLuong;
    
    if (hienTai > 1) {
      // Giảm 1
      await request.query(`UPDATE ChiTietHoaDon SET SoLuong = SoLuong - 1 WHERE ID = @id`);
    } else {
      // Xóa hẳn
      await request.query(`DELETE FROM ChiTietHoaDon WHERE ID = @id`);
    }
    
    // Cập nhật lại tổng tiền hóa đơn
    const updateHD = new sql.Request();
    updateHD.input('maHD', sql.Int, maHD);
    await updateHD.query(`
      UPDATE HoaDon 
      SET TongTien = ISNULL((SELECT SUM(SoLuong * DonGia) FROM ChiTietHoaDon WHERE MaHD = @maHD), 0)
      WHERE MaHD = @maHD
    `);
    
    res.json({ message: 'Cập nhật số lượng thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const cancelInvoice = async (req, res) => {
  try {
    const { maHD, maBan } = req.body;
    
    // Xóa chi tiết hóa đơn
    const reqCT = new sql.Request();
    reqCT.input('maHD', sql.Int, maHD);
    await reqCT.query('DELETE FROM ChiTietHoaDon WHERE MaHD = @maHD');
    
    // Xóa hóa đơn
    const reqHD = new sql.Request();
    reqHD.input('maHD', sql.Int, maHD);
    await reqHD.query('DELETE FROM HoaDon WHERE MaHD = @maHD');
    
    // Giải phóng bàn
    const reqBan = new sql.Request();
    reqBan.input('maBan', sql.Int, maBan);
    await reqBan.query("UPDATE Ban SET TrangThai = N'Trống' WHERE MaBan = @maBan");
    
    res.json({ message: 'Hủy hóa đơn và giải phóng bàn thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getHoaDonByBan,
  datBan,
  goiMon,
  xoaMon,
  giamSoLuong,
  thanhToan,
  getAllInvoices,
  checkVoucher,
  cancelInvoice
};
