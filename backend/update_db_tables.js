const { connectDB } = require('./src/config/db');
connectDB().then(async pool => {
  try {
    await pool.request().query('ALTER TABLE HoaDon ADD TenKhachHang NVARCHAR(100), SoDienThoai VARCHAR(20)');
    console.log('Added columns to HoaDon');
  } catch(e) {
    console.log('Columns might already exist');
  }
  
  // Check current count
  const countRes = await pool.request().query('SELECT COUNT(*) as count FROM Ban');
  const count = countRes.recordset[0].count;
  
  if (count < 20) {
    for(let i = count + 1; i <= 20; i++) {
      await pool.request().query(`INSERT INTO Ban (TenBan, TrangThai) VALUES (N'Bàn ${i}', N'Trống')`);
    }
    console.log(`Added tables up to Bàn 20`);
  } else {
    console.log('Already have 20 or more tables');
  }
  
  process.exit(0);
});
