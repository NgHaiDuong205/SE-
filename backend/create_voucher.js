const { connectDB } = require('../backend/src/config/db');

async function createTable() {
  try {
    const pool = await connectDB();
    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Voucher' and xtype='U')
      BEGIN
        CREATE TABLE Voucher (
            MaVoucher VARCHAR(50) PRIMARY KEY,
            PhanTramGiam INT NOT NULL,
            GiamToiDa DECIMAL(18,2),
            SoLuong INT NOT NULL DEFAULT 100,
            NgayHetHan DATETIME NOT NULL,
            TrangThai NVARCHAR(50) DEFAULT N'Hoạt động'
        );
        
        INSERT INTO Voucher (MaVoucher, PhanTramGiam, GiamToiDa, SoLuong, NgayHetHan)
        VALUES 
        ('GIAM10', 10, 50000, 100, '2026-12-31 23:59:59'),
        ('GIAM20', 20, 100000, 50, '2026-12-31 23:59:59');
        
        PRINT 'Table Voucher created and seed data inserted successfully.';
      END
      ELSE
      BEGIN
        PRINT 'Table Voucher already exists.';
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
