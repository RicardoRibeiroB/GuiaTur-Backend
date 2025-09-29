// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Conectar ao MongoDB Atlas
connectDB();

// Middlewares
app.use(helmet()); // Ajuda a proteger a aplicação de vulnerabilidades web
app.use(cors());   // Permite requisições de outros domínios
app.use(morgan('dev')); // Loga as requisições no console
app.use(express.json()); // Permite que o express entenda JSON
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/v1/auth', authRoutes);

// Rota de health check (verificar se a API está no ar)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler (forma correta)
app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Rota não encontrada'
    });
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
});