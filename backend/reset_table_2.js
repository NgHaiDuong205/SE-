const { connectDB } = require('./src/config/db');
connectDB().then(async pool => {
  await pool.request().query("UPDATE Ban SET TrangThai = N'Trống' WHERE TenBan = N'Bàn 2'");
  // Also clear any un-paid invoices for table 2 if they exist, or just set them to something else
  // To keep it simple, we just free the table as requested.
  console.log('Table 2 reset to Trống');
  process.exit(0);
});
