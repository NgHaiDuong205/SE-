const { connectDB } = require('./src/config/db');
connectDB().then(async pool => {
  const res = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ChiTietHoaDon'");
  console.log(res.recordset);
  process.exit(0);
});
