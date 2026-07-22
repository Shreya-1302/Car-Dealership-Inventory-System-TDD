
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authrouter');
const vehicleRouter = require('./routes/vehiclerouter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/vehicles', vehicleRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

module.exports = app;
