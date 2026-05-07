const { connectDB } = require('./src/config/db');
connectDB().then(async pool => {
  const res = await pool.request().query(`
    SELECT 
        kc.name AS ConstraintName,
        c.name AS ColumnName
    FROM 
        sys.key_constraints kc
    INNER JOIN 
        sys.index_columns ic ON kc.parent_object_id = ic.object_id AND kc.unique_index_id = ic.index_id
    INNER JOIN 
        sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    WHERE 
        kc.parent_object_id = OBJECT_ID('ChiTietHoaDon') 
        AND kc.type = 'PK';
  `);
  console.log(res.recordset);
  process.exit(0);
});
