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
    const transaction = new sql.Transaction();
    await transaction.begin();
    try {
      const { TenCombo, Gia, ChiTiet } = req.body;
      
      if (!ChiTiet || ChiTiet.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Combo phải có ít nhất một món ăn' });
      }

      if (Number(Gia) < 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Giá combo không được âm' });
      }

      const request = new sql.Request(transaction);
      request.input('ten', sql.NVarChar, TenCombo);
      request.input('gia', sql.Decimal(18,2), Gia);
      
      const result = await request.query(`
        INSERT INTO Combo (TenCombo, Gia, TrangThai)
        OUTPUT INSERTED.MaCombo
        VALUES (@ten, @gia, N'Hoạt động')
      `);
      
      const maCombo = result.recordset[0].MaCombo;
      
      if (ChiTiet && ChiTiet.length > 0) {
        // Loại bỏ trùng lặp nếu có
        const uniqueMonAn = [...new Set(ChiTiet)];
        for (let maMon of uniqueMonAn) {
          // Kiểm tra xem món có đang ngừng bán không
          const checkMon = new sql.Request(transaction);
          checkMon.input('maMon', sql.Int, maMon);
          const monRes = await checkMon.query('SELECT TrangThai FROM MonAn WHERE MaMon = @maMon');
          if (monRes.recordset.length > 0 && monRes.recordset[0].TrangThai === 'Ngừng bán') {
            await transaction.rollback();
            return res.status(400).json({ message: `Món ăn với mã ${maMon} đã ngừng bán, không thể thêm vào combo` });
          }

          const reqCT = new sql.Request(transaction);
          reqCT.input('maCombo', sql.Int, maCombo);
          reqCT.input('maMon', sql.Int, maMon);
          await reqCT.query(`INSERT INTO ChiTietCombo (MaCombo, MaMon) VALUES (@maCombo, @maMon)`);
        }
      }
      
      await transaction.commit();
      res.json({ message: 'Thêm combo thành công' });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateCombo = async (req, res) => {
  try {
    const transaction = new sql.Transaction();
    await transaction.begin();
    try {
      const { id } = req.params;
      const { TenCombo, Gia, TrangThai, ChiTiet } = req.body;
      
      if (Number(Gia) < 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Giá combo không được âm' });
      }

      if (!ChiTiet || ChiTiet.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Combo phải có ít nhất một món ăn' });
      }

      const request = new sql.Request(transaction);
      request.input('id', sql.Int, id);
      request.input('ten', sql.NVarChar, TenCombo);
      request.input('gia', sql.Decimal(18,2), Gia);
      request.input('tt', sql.NVarChar, TrangThai);
      
      await request.query(`UPDATE Combo SET TenCombo=@ten, Gia=@gia, TrangThai=@tt WHERE MaCombo=@id`);
      
      if (ChiTiet) {
        const delReq = new sql.Request(transaction);
        delReq.input('id', sql.Int, id);
        await delReq.query(`DELETE FROM ChiTietCombo WHERE MaCombo=@id`);
        
        const uniqueMonAn = [...new Set(ChiTiet)];
        for (let maMon of uniqueMonAn) {
          // Kiểm tra xem món có đang ngừng bán không
          const checkMon = new sql.Request(transaction);
          checkMon.input('maMon', sql.Int, maMon);
          const monRes = await checkMon.query('SELECT TrangThai FROM MonAn WHERE MaMon = @maMon');
          if (monRes.recordset.length > 0 && monRes.recordset[0].TrangThai === 'Ngừng bán') {
            await transaction.rollback();
            return res.status(400).json({ message: `Món ăn với mã ${maMon} đã ngừng bán, không thể thêm vào combo` });
          }

          const reqCT = new sql.Request(transaction);
          reqCT.input('maCombo', sql.Int, id);
          reqCT.input('maMon', sql.Int, maMon);
          await reqCT.query(`INSERT INTO ChiTietCombo (MaCombo, MaMon) VALUES (@maCombo, @maMon)`);
        }
      }
      
      await transaction.commit();
      res.json({ message: 'Sửa combo thành công' });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
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
    console.log(`Setting status to Ngừng hoạt động for MaCombo: ${id}`);
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
