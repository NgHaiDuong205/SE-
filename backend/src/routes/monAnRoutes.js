const express = require('express');
const router = express.Router();
const { getAllMonAn, addMonAn, updateMonAn, deleteMonAn } = require('../controllers/monAnController');

router.get('/', getAllMonAn);
router.post('/', addMonAn);
router.put('/:id', updateMonAn);
router.delete('/:id', deleteMonAn);

module.exports = router;
