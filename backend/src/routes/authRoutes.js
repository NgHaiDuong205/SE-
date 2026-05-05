const express = require('express');
const router = express.Router();
const { login, getAllUsers, createUser, updateUser, lockUser } = require('../controllers/authController');

router.post('/login', login);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/lock', lockUser);

module.exports = router;
