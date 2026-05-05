const express = require('express');
const router = express.Router();
const { getAllCombos, createCombo, updateCombo, deleteCombo } = require('../controllers/comboController');

router.get('/', getAllCombos);
router.post('/', createCombo);
router.put('/:id', updateCombo);
router.delete('/:id', deleteCombo);

module.exports = router;
