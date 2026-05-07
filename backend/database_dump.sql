-- DATABASE DUMP
-- Generated on 5/7/2026, 9:52:45 PM


-- Table: TaiKhoan
INSERT INTO [TaiKhoan] (MaTK, TenDangNhap, MatKhau, VaiTro, TrangThai) VALUES (N'1', N'admin', N'123', N'Quản lý', N'Hoạt động');
INSERT INTO [TaiKhoan] (MaTK, TenDangNhap, MatKhau, VaiTro, TrangThai) VALUES (N'2', N'nhanvien1', N'123', N'Nhân viên', N'Hoạt động');
INSERT INTO [TaiKhoan] (MaTK, TenDangNhap, MatKhau, VaiTro, TrangThai) VALUES (N'3', N'nhanvien2', N'123', N'Nhân viên', N'Hoạt động');
INSERT INTO [TaiKhoan] (MaTK, TenDangNhap, MatKhau, VaiTro, TrangThai) VALUES (N'4', N'conchongu', N'123456789', N'Nhân viên', N'Hoạt động');

-- Table: NhanVien
INSERT INTO [NhanVien] (MaNV, HoTen, DiaChi, Sdt, MaTK) VALUES (N'1', N'Nguyễn Văn Quản Lý', N'Thành phố Hồ Chí Minh', N'0912345678', 1);
INSERT INTO [NhanVien] (MaNV, HoTen, DiaChi, Sdt, MaTK) VALUES (N'2', N'Trần Thị Phục Vụ', N'Hà Nội', N'0987654321', 2);
INSERT INTO [NhanVien] (MaNV, HoTen, DiaChi, Sdt, MaTK) VALUES (N'3', N'Lê Văn Phục Vụ', N'Hà Nội', N'0909090909', 3);
INSERT INTO [NhanVien] (MaNV, HoTen, DiaChi, Sdt, MaTK) VALUES (N'4', N'Phan Thành Đạt', N'gầm cầu ', N'0123456789', 4);

-- Table: Ban
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'1', N'Bàn 1', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'2', N'Bàn 2', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'3', N'Bàn 3', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'4', N'Bàn 4', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'5', N'Bàn 5', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'6', N'Bàn 6', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'7', N'Bàn VIP 1', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'8', N'Bàn VIP 2', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'9', N'Bàn 9', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'10', N'Bàn 10', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'11', N'Bàn 11', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'12', N'Bàn 12', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'13', N'Bàn 13', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'14', N'Bàn 14', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'15', N'Bàn 15', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'16', N'Bàn 16', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'17', N'Bàn 17', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'18', N'Bàn 18', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'19', N'Bàn 19', N'Trống');
INSERT INTO [Ban] (MaBan, TenBan, TrangThai) VALUES (N'20', N'Bàn 20', N'Trống');

-- Table: MonAn
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'1', N'Phở Bò tuôi', N'Phở bò tuôi', 450000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'2', N'Phở Gà', N'Phở gà ta', 400000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'3', N'Cơm Rang Dưa Bò', N'Cơm rang đậm đà', 50000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'4', N'Mỳ Xào Hải Sản', N'Mỳ xào tôm mực', 60000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'5', N'Gà Rán', N'Gà rán giòn', 35000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'6', N'Salad Trộn', N'Salad rau củ tươi', 30000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'7', N'Trà Đá', N'Đồ uống mát', 5000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'8', N'Nước Ngọt', N'Coca, Pepsi', 15000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'9', N'Sinh Tố Bơ', N'Sinh tố bơ đặc biệt', 35000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'10', N'pizza ', N'ok ', 100000, N'Còn');
INSERT INTO [MonAn] (MaMon, TenMon, MoTa, Gia, TrangThai) VALUES (N'11', N'kẹo', N'ngon', 15000, N'Còn');

-- Table: HoaDon
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'1', '2026-05-05T21:01:06.477Z', 540000, N'Đã thanh toán', 1, 5, NULL, NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'2', '2026-05-05T21:01:48.460Z', 185000, N'Đã thanh toán', 2, 2, NULL, NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'3', '2026-05-05T21:02:11.020Z', 0, N'Đã thanh toán', 2, 7, NULL, NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'4', '2026-05-05T21:51:32.083Z', 0, N'Đã thanh toán', 2, 5, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'5', '2026-05-06T09:00:56.120Z', 175000, N'Đã thanh toán', 2, 3, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'6', '2026-05-06T09:07:39.607Z', 170000, N'Đã thanh toán', 2, 5, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'7', '2026-05-06T09:07:50.960Z', 100000, N'Đã thanh toán', 2, 5, N'Quẹt thẻ', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'8', '2026-05-06T16:49:29.790Z', 175000, N'Đã thanh toán', 4, 1, N'Chuyển khoản', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'9', '2026-05-06T17:06:43.933Z', 275000, N'Đã thanh toán', 4, 1, N'Chuyển khoản', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'10', '2026-05-06T17:07:57.003Z', 0, N'Đã thanh toán', 4, 3, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'11', '2026-05-06T17:08:16.600Z', 215000, N'Đã thanh toán', 4, 2, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'12', '2026-05-06T17:08:43.820Z', 0, N'Đã thanh toán', 4, 6, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'13', '2026-05-06T17:12:40.047Z', 1310000, N'Đã thanh toán', 4, 1, N'Quẹt thẻ', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'14', '2026-05-07T11:13:35.400Z', 0, N'Đã thanh toán', 4, 1, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'15', '2026-05-07T12:03:12.227Z', 450000, N'Đã thanh toán', 4, 1, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'16', '2026-05-07T12:06:20.957Z', 850000, N'Đã thanh toán', 4, 2, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'17', '2026-05-07T12:06:48.520Z', 800000, N'Đã thanh toán', 4, 2, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'18', '2026-05-07T12:11:46.510Z', 750000, N'Đã thanh toán', 4, 6, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'19', '2026-05-07T12:52:10.467Z', 800000, N'Đã thanh toán', 4, 6, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'20', '2026-05-07T13:14:01.627Z', 0, N'Đã thanh toán', 4, 4, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'21', '2026-05-07T13:19:06.487Z', 0, N'Đã thanh toán', 4, 3, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'22', '2026-05-07T20:15:28.227Z', 414000, N'Đã thanh toán', 4, 1, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'23', '2026-05-07T20:43:26.230Z', 125000, N'Đã thanh toán', 4, 1, N'Tiền mặt', NULL, NULL, NULL);
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'24', '2026-05-07T20:56:32.840Z', 202500, N'Đã thanh toán', 4, 1, N'Tiền mặt', NULL, N'Nguyen ', N'012345678');
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'25', '2026-05-07T21:08:43.140Z', 430000, N'Đã thanh toán', 4, 1, N'Chuyển khoản', NULL, N'Phan Thanh Đạt', N'0495349534953');
INSERT INTO [HoaDon] (MaHD, NgayLap, TongTien, TrangThai, MaNV, MaBan, PhuongThucThanhToan, MaVoucher, TenKhachHang, SoDienThoai) VALUES (N'26', '2026-05-07T21:33:27.133Z', 1502255000, N'Đã thanh toán', 4, 1, N'Chuyển khoản', NULL, N'Nguyễn Hải Dương', N'03999999999');

-- Table: ChiTietHoaDon
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (1, 1, 3, 45000, N'1', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (1, 2, 4, 40000, N'2', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (1, 3, 1, 50000, N'3', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (1, 4, 1, 60000, N'4', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (1, 5, 3, 35000, N'5', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (1, 6, 1, 30000, N'6', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (2, 1, 1, 45000, N'7', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (2, 2, 1, 40000, N'8', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (2, 3, 2, 50000, N'9', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (5, 1, 3, 45000, N'10', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (5, 2, 1, 40000, N'11', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (6, 1, 2, 45000, N'12', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (6, 2, 2, 40000, N'13', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (7, 5, 2, 35000, N'14', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (7, 6, 1, 30000, N'15', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (8, 2, 1, 40000, N'16', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (8, 3, 1, 50000, N'17', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (8, 6, 1, 30000, N'18', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (8, 7, 1, 5000, N'19', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (8, 8, 1, 15000, N'20', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (8, 9, 1, 35000, N'21', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (9, 2, 2, 40000, N'22', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (9, 3, 2, 50000, N'23', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (9, 4, 1, 60000, N'24', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (9, 5, 1, 35000, N'25', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (11, 2, 1, 40000, N'26', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (11, 3, 1, 50000, N'27', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (11, 4, 1, 60000, N'28', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (11, 5, 1, 35000, N'29', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (11, 6, 1, 30000, N'30', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (13, 2, 3, 400000, N'31', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (13, 3, 1, 50000, N'32', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (13, 4, 1, 60000, N'33', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (15, 2, 1, 400000, N'34', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (15, 3, 1, 50000, N'35', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (16, 2, 2, 400000, N'36', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (16, 3, 1, 50000, N'37', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (17, 2, 2, 400000, N'38', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (18, 2, 2, 400000, N'39', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (19, 2, 2, 400000, N'40', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (19, 3, 1, 50000, N'41', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (22, NULL, 1, 60000, N'42', 2);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (22, 2, 1, 400000, N'43', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (23, NULL, 1, 60000, N'44', 2);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (23, 5, 1, 35000, N'45', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (23, 6, 1, 30000, N'46', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (24, 1, 5, 45000, N'47', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (25, 1, 6, 45000, N'48', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (25, 5, 2, 35000, N'49', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (25, 6, 1, 30000, N'50', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (25, NULL, 1, 60000, N'51', 2);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (26, 2, 1, 400000, N'52', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (26, 1, 4, 450000, N'53', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (26, 3, 1, 50000, N'54', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (26, 4, 1, 60000, N'55', NULL);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (26, NULL, 1, 45000, N'56', 1);
INSERT INTO [ChiTietHoaDon] (MaHD, MaMon, SoLuong, DonGia, ID, MaCombo) VALUES (26, NULL, 1, 1500000000, N'57', 3);

-- Table: Combo
INSERT INTO [Combo] (MaCombo, TenCombo, Gia, TrangThai) VALUES (N'1', N'Combo Phở Trà', 45000, N'Hoạt động');
INSERT INTO [Combo] (MaCombo, TenCombo, Gia, TrangThai) VALUES (N'2', N'Combo Cơm Nước', 60000, N'Hoạt động');
INSERT INTO [Combo] (MaCombo, TenCombo, Gia, TrangThai) VALUES (N'3', N'dcmm', 1500000000, N'Hoạt động');

-- Table: ChiTietCombo
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (1, 1);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (1, 2);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (1, 3);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (1, 5);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (1, 6);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (1, 7);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (1, 10);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (2, 2);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (2, 3);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (2, 8);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (2, 9);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (3, 2);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (3, 3);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (3, 8);
INSERT INTO [ChiTietCombo] (MaCombo, MaMon) VALUES (3, 9);

-- Table: sysdiagrams

-- Table: DatBan
INSERT INTO [DatBan] (MaDatBan, MaBan, MaNhanVien, TenKhachHang, SoDienThoai, ThoiGianDat, TrangThai, NgayTao) VALUES (N'1', 2, 4, N'Phan Dat', N'0123456', '2026-05-12T06:09:00.000Z', N'Chờ xác nhận', '2026-05-07T13:09:18.287Z');

-- Table: Voucher
INSERT INTO [Voucher] (MaVoucher, PhanTramGiam, GiamToiDa, SoLuong, NgayHetHan, TrangThai) VALUES (N'GIAM10', 10, 50000, 96, '2026-12-31T23:59:59.000Z', N'Hoạt động');
INSERT INTO [Voucher] (MaVoucher, PhanTramGiam, GiamToiDa, SoLuong, NgayHetHan, TrangThai) VALUES (N'GIAM20', 20, 100000, 49, '2026-12-31T23:59:59.000Z', N'Hoạt động');
