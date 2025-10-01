const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userroutes');
const { errorHandler } = require('./utils/errors');

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

connectDB();

app.get('/', (req, res) => res.send('API is running'));

const Router = express.Router();
Router.use('/auth', authRoutes);
Router.use('/users', userRoutes);
app.use('/api', Router);

app.use(errorHandler);

module.exports = app;


