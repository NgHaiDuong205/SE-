const express = require('express');
const router = express.Router();
const { getHoaDonByBan, datBan, goiMon, xoaMon, giamSoLuong, thanhToan, getAllInvoices, checkVoucher, cancelInvoice } = require('../controllers/hoaDonController');

router.get('/all', getAllInvoices);
router.get('/ban/:maBan', getHoaDonByBan);
router.post('/datban', datBan);
router.post('/goimon', goiMon);
router.post('/xoa-mon', xoaMon);
router.post('/giam-so-luong', giamSoLuong);
router.post('/thanhtoan', thanhToan);
router.post('/huy-hoa-don', cancelInvoice);
router.post('/check-voucher', checkVoucher);

module.exports = router;
