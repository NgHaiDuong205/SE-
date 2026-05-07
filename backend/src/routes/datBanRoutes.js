const express = require('express');
const router = express.Router();
const { getAllDatBan, createDatBan, updateTrangThaiDatBan } = require('../controllers/datBanController');

router.get('/', getAllDatBan);
router.post('/', createDatBan);
router.put('/:id', updateTrangThaiDatBan);

module.exports = router;
