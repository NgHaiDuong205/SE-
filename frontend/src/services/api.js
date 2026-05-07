import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/_/backend/api' : 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) => api.post('/auth/login', { username, password });
export const getTables = () => api.get('/ban');
export const updateTableStatus = (id, TrangThai) => api.put(`/ban/${id}`, { TrangThai });
export const getMenu = () => api.get('/monan');
export const addMenuItem = (data) => api.post('/monan', data);
export const updateMenuItem = (id, data) => api.put(`/monan/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/monan/${id}`);
export const getInvoice = (maBan) => api.get(`/hoadon/ban/${maBan}`);
export const getAllInvoices = () => api.get('/hoadon/all');
export const bookTable = (maBan, maNV) => api.post('/hoadon/datban', { maBan, maNV });
export const orderItem = (data) => api.post('/hoadon/goimon', data);
export const checkout = (maHD, maBan, phuongThuc, maVoucher = null, tienGiam = 0) => api.post('/hoadon/thanhtoan', { maHD, maBan, phuongThuc, maVoucher, tienGiam });
export const checkVoucher = (maVoucher, tongTien) => api.post('/hoadon/check-voucher', { maVoucher, tongTien });
export const getUsers = () => api.get('/auth/users');
export const createUser = (data) => api.post('/auth/users', data);
export const updateUser = (id, data) => api.put(`/auth/users/${id}`, data);
export const lockUser = (id, status) => api.put(`/auth/users/${id}/lock`, { TrangThai: status });

export const getCombos = () => api.get('/combo');
export const createCombo = (data) => api.post('/combo', data);
export const updateCombo = (id, data) => api.put(`/combo/${id}`, data);
export const deleteCombo = (id) => api.delete(`/combo/${id}`);

export const getAllDatBan = () => api.get('/datban');
export const createDatBan = (data) => api.post('/datban', data);
export const updateTrangThaiDatBan = (id, TrangThai) => api.put(`/datban/${id}`, { TrangThai });
export default api;
