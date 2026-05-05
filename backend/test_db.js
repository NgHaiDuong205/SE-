const sql = require('mssql/msnodesqlv8');

const connectionStrings = [
  'Driver={SQL Server Native Client 11.0};Server=.\\MSSQLSERVER02;Database=QuanLyNhaHang;Trusted_Connection=yes;',
  'Driver={ODBC Driver 17 for SQL Server};Server=.\\MSSQLSERVER02;Database=QuanLyNhaHang;Trusted_Connection=yes;',
  'Driver={SQL Server};Server=.\\MSSQLSERVER02;Database=QuanLyNhaHang;Trusted_Connection=yes;'
];

const test = async () => {
  for (let cs of connectionStrings) {
    try {
      console.log('Trying:', cs);
      await sql.connect(cs);
      console.log('SUCCESS with:', cs);
      process.exit(0);
    } catch (e) {
      console.log('Failed:', e.message);
    }
  }
  process.exit(1);
};
test();
