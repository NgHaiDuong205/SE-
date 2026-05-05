const sql = require('msnodesqlv8');
const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=.\\MSSQLSERVER02;Database=QuanLyNhaHang;Trusted_Connection=yes;";
sql.query(connectionString, "SELECT 1 as x", (err, rows) => {
    if (err) console.log('Error:', err.message);
    else console.log('SUCCESS:', rows);
});
