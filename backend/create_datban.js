const { connectDB } = require('../backend/src/config/db');

async function createTable() {
  try {
    const pool = await connectDB();
    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DatBan' and xtype='U')
      BEGIN
        CREATE TABLE DatBan (
            MaDatBan INT IDENTITY(1,1) PRIMARY KEY,
            MaBan INT NOT NULL,
            MaNhanVien INT NOT NULL,
            TenKhachHang NVARCHAR(100) NOT NULL,
            SoDienThoai VARCHAR(20) NOT NULL,
            ThoiGianDat DATETIME NOT NULL,
            TrangThai NVARCHAR(50) DEFAULT N'Chờ xác nhận',
            NgayTao DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (MaBan) REFERENCES Ban(MaBan),
            FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNV)
        );
        PRINT 'Table DatBan created successfully.';
      END
      ELSE
      BEGIN
        PRINT 'Table DatBan already exists.';
      END
    `;
    await pool.request().query(query);
    console.log("Database update complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error updating database:", err);
    process.exit(1);
  }
}

createTable();
