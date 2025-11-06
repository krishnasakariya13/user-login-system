const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userroutes');
const { swaggerUi, specs } = require('./config/swagger');

const { errorHandler } = require('./utils/errors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

connectDB();

app.get('/', (req, res) => res.send('API is running'));

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

const Router = express.Router();
Router.use('/auth', authRoutes);
Router.use('/users', userRoutes);
app.use('/api', Router);

app.use(errorHandler);

module.exports = app;
