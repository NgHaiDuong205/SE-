const express = require('express');
const router = express.Router();
const { getAllBan, updateTrangThaiBan } = require('../controllers/banController');

router.get('/', getAllBan);
router.put('/:id', updateTrangThaiBan);

module.exports = router;
