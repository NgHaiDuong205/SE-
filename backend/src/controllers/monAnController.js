const { sql } = require('../config/db');

const getAllMonAn = async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM MonAn');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

  const addMonAn = async (req, res) => {
  try {
    const { TenMon, MoTa, Gia } = req.body;
    if (Number(Gia) < 0) {
      return res.status(400).json({ message: 'Giá món ăn không được âm' });
    }
    const request = new sql.Request();
    request.input('tenMon', sql.NVarChar, TenMon);
    request.input('moTa', sql.NVarChar, MoTa);
    request.input('gia', sql.Decimal(18,2), Gia);
    await request.query(`INSERT INTO MonAn (TenMon, MoTa, Gia, TrangThai) VALUES (@tenMon, @moTa, @gia, N'Còn')`);
    res.json({ message: 'Thêm món ăn thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

  const updateMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const { TenMon, MoTa, Gia, TrangThai } = req.body;
    if (Number(Gia) < 0) {
      return res.status(400).json({ message: 'Giá món ăn không được âm' });
    }
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('tenMon', sql.NVarChar, TenMon);
    request.input('moTa', sql.NVarChar, MoTa);
    request.input('gia', sql.Decimal(18,2), Gia);
    request.input('trangThai', sql.NVarChar, TrangThai);
    await request.query(`UPDATE MonAn SET TenMon=@tenMon, MoTa=@moTa, Gia=@gia, TrangThai=@trangThai WHERE MaMon=@id`);
    res.json({ message: 'Cập nhật món ăn thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const deleteMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    console.log(`Setting status to Ngừng bán for MaMon: ${id}`);
    await request.query(`UPDATE MonAn SET TrangThai=N'Ngừng bán' WHERE MaMon=@id`);
    res.json({ message: 'Xóa (ngừng bán) món ăn thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getAllMonAn,
  addMonAn,
  updateMonAn,
  deleteMonAn
};
