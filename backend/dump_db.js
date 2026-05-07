const { connectDB } = require('./src/config/db');

async function dump() {
  const pool = await connectDB();
  const tablesResult = await pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
  const tables = tablesResult.recordset.map(r => r.TABLE_NAME);
  
  let sqlDump = `-- DATABASE DUMP\n-- Generated on ${new Date().toLocaleString()}\n\n`;
  
  for (const table of tables) {
    // Create Table (simplified)
    const columns = await pool.request().query(`SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`);
    sqlDump += `\n-- Table: ${table}\n`;
    // We don't have the exact CREATE TABLE script easily, but we can generate INSERTs.
    
    const data = await pool.request().query(`SELECT * FROM [${table}]`);
    if (data.recordset.length > 0) {
      for (const row of data.recordset) {
        const keys = Object.keys(row);
        const values = keys.map(k => {
          const val = row[k];
          if (val === null) return 'NULL';
          if (typeof val === 'string') return `N'${val.replace(/'/g, "''")}'`;
          if (val instanceof Date) return `'${val.toISOString()}'`;
          return val;
        });
        sqlDump += `INSERT INTO [${table}] (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
      }
    }
  }
  
  const fs = require('fs');
  fs.writeFileSync('database_dump.sql', sqlDump);
  console.log('Dump completed: database_dump.sql');
  process.exit(0);
}

dump();
