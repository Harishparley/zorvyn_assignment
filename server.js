const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
// Enable CORS
app.use(cors());

// API Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes')); // <-- Added dashboard route

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Zorvyn Finance API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});