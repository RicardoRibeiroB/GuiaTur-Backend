// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Rota para registrar um novo usuário
// POST /api/v1/auth/register
router.post('/register', registerUser);

// Rota para fazer login
// POST /api/v1/auth/login
router.post('/login', loginUser);

module.exports = router;