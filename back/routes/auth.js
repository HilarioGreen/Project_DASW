const express = require('express');
const router = express.Router();
const { registrar, login, recuperarPassword } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', registrar);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/forgot-password
router.post('/forgot-password', recuperarPassword);

module.exports = router;
