const { sql } = require('../config/db');

const getAllBan = async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM Ban ORDER BY MaBan');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateTrangThaiBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { TrangThai } = req.body;
    
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('trangThai', sql.NVarChar, TrangThai);
    
    await request.query('UPDATE Ban SET TrangThai = @trangThai WHERE MaBan = @id');
    res.json({ message: 'Cập nhật trạng thái bàn thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getAllBan,
  updateTrangThaiBan
};
