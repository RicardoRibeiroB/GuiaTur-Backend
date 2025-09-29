// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Função para gerar o token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 1. REGISTRO DE USUÁRIO
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se o usuário já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'Usuário já cadastrado' });
    }

    // Cria o novo usuário (a senha será "hasheada" pelo hook no model)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Dados de usuário inválidos' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
  }
};

// 2. LOGIN DE USUÁRIO
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Procura o usuário pelo email
    const user = await User.findOne({ email });

    // Verifica se o usuário existe E se a senha corresponde
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};