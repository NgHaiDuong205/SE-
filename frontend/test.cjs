const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('http://localhost:5000/api/auth/login', { TenDangNhap: 'admin', MatKhau: '123' });
    const token = login.data.token;
    const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${token}` } });
    const book = await axiosInstance.post('http://localhost:5000/api/hoadon/datban', { maBan: 2, maNV: 1 });
    console.log('Booked:', book.data);
    const order = await axiosInstance.post('http://localhost:5000/api/hoadon/goimon', { maHD: book.data.maHD, maMon: 1, soLuong: 1, donGia: 50000 });
    console.log('Ordered:', order.data);
    const inv = await axiosInstance.get('http://localhost:5000/api/hoadon/ban/2');
    console.log('Invoice:', JSON.stringify(inv.data.data, null, 2));
  } catch(err) {
    console.log('Error:', err.response ? err.response.data : err.message);
  }
}
test();
