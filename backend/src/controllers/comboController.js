const { sql } = require('../config/db');

const getAllCombos = async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(`
      SELECT c.*, 
        (SELECT ct.MaMon, m.TenMon 
         FROM ChiTietCombo ct 
         JOIN MonAn m ON ct.MaMon = m.MaMon 
         WHERE ct.MaCombo = c.MaCombo 
         FOR JSON PATH) as ChiTiet
      FROM Combo c
      WHERE c.TrangThai != N'Ngừng hoạt động'
    `);
    
    const combos = result.recordset.map(row => ({
      ...row,
      ChiTiet: row.ChiTiet ? JSON.parse(row.ChiTiet) : []
    }));
    
    res.json(combos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const createCombo = async (req, res) => {
  try {
    const { TenCombo, Gia, ChiTiet } = req.body; // ChiTiet is array of MaMon
    
    const request = new sql.Request();
    request.input('ten', sql.NVarChar, TenCombo);
    request.input('gia', sql.Decimal(18,2), Gia);
    
    const result = await request.query(`
      INSERT INTO Combo (TenCombo, Gia, TrangThai)
      OUTPUT INSERTED.MaCombo
      VALUES (@ten, @gia, N'Hoạt động')
    `);
    
    const maCombo = result.recordset[0].MaCombo;
    
    if (ChiTiet && ChiTiet.length > 0) {
      for (let maMon of ChiTiet) {
        const reqCT = new sql.Request();
        reqCT.input('maCombo', sql.Int, maCombo);
        reqCT.input('maMon', sql.Int, maMon);
        await reqCT.query(`INSERT INTO ChiTietCombo (MaCombo, MaMon) VALUES (@maCombo, @maMon)`);
      }
    }
    
    res.json({ message: 'Thêm combo thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const { TenCombo, Gia, TrangThai, ChiTiet } = req.body;
    
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('ten', sql.NVarChar, TenCombo);
    request.input('gia', sql.Decimal(18,2), Gia);
    request.input('tt', sql.NVarChar, TrangThai);
    
    await request.query(`UPDATE Combo SET TenCombo=@ten, Gia=@gia, TrangThai=@tt WHERE MaCombo=@id`);
    
    if (ChiTiet) {
      const delReq = new sql.Request();
      delReq.input('id', sql.Int, id);
      await delReq.query(`DELETE FROM ChiTietCombo WHERE MaCombo=@id`);
      
      for (let maMon of ChiTiet) {
        const reqCT = new sql.Request();
        reqCT.input('maCombo', sql.Int, id);
        reqCT.input('maMon', sql.Int, maMon);
        await reqCT.query(`INSERT INTO ChiTietCombo (MaCombo, MaMon) VALUES (@maCombo, @maMon)`);
      }
    }
    
    res.json({ message: 'Sửa combo thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const deleteCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    await request.query(`UPDATE Combo SET TrangThai=N'Ngừng hoạt động' WHERE MaCombo=@id`);
    res.json({ message: 'Xóa combo thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getAllCombos,
  createCombo,
  updateCombo,
  deleteCombo
};
