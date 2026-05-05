const express = require('express');
const router = express.Router();
const { getHoaDonByBan, datBan, goiMon, thanhToan, getAllInvoices } = require('../controllers/hoaDonController');

router.get('/all', getAllInvoices);
router.get('/ban/:maBan', getHoaDonByBan);
router.post('/datban', datBan);
router.post('/goimon', goiMon);
router.post('/thanhtoan', thanhToan);

module.exports = router;
