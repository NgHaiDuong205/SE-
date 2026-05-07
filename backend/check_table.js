const { connectDB } = require('./src/config/db');
const table = process.argv[2] || 'HoaDon';
connectDB().then(async pool => {
  const res = await pool.request().query(`SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`);
  console.log(res.recordset);
  process.exit(0);
});
