const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=.\\MSSQLSERVER02;Database=QuanLyNhaHang;Trusted_Connection=yes;'
};

const test = async () => {
  try {
    await sql.connect(config);
    console.log('SUCCESS');
    process.exit(0);
  } catch (e) {
    console.log('Failed:', e.message);
    process.exit(1);
  }
};
test();
