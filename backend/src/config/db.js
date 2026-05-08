const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=yes;TrustServerCertificate=yes;`
};

const connectDB = async () => {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    return pool;
  } catch (err) {
    console.error('Database connection failed!', err);
    process.exit(1);
  }
};

module.exports = {
  sql,
  connectDB
};
