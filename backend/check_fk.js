const { connectDB } = require('./src/config/db');
connectDB().then(async pool => {
  const res = await pool.request().query(`
    SELECT 
      fk.name AS ForeignKey,
      tp.name AS ParentTable,
      cp.name, cp.column_id,
      tr.name AS RefTable,
      cr.name, cr.column_id
    FROM 
      sys.foreign_keys fk
    INNER JOIN 
      sys.tables tp ON fk.parent_object_id = tp.object_id
    INNER JOIN 
      sys.tables tr ON fk.referenced_object_id = tr.object_id
    INNER JOIN 
      sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
    INNER JOIN 
      sys.columns cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id
    INNER JOIN 
      sys.columns cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id
    WHERE tp.name = 'ChiTietHoaDon';
  `);
  console.log(res.recordset);
  process.exit(0);
});
