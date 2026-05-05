const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const banRoutes = require('./routes/banRoutes');
const monAnRoutes = require('./routes/monAnRoutes');
const hoaDonRoutes = require('./routes/hoaDonRoutes');
const comboRoutes = require('./routes/comboRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ban', banRoutes);
app.use('/api/monan', monAnRoutes);
app.use('/api/hoadon', hoaDonRoutes);
app.use('/api/combo', comboRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
