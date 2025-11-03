
const mongoose = require('mongoose');
const ERROR_MESSAGES = require('../constants/errorMessages');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth';
        
        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', mongoURI);
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(ERROR_MESSAGES.DB_CONNECTION_SUCCESSFUL);
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
        
        mongoose.connection.on('error', (err) => {
            console.error(`${ERROR_MESSAGES.DB_CONNECTION_ERROR}:`, err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log(ERROR_MESSAGES.DB_DISCONNECTED);
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log(ERROR_MESSAGES.DB_TERMINATED);
            process.exit(0);
        });
        
    } catch (err) {
        console.error(`${ERROR_MESSAGES.DB_CONNECTION_FAILED}:`, err.message);
        console.error('Make sure MongoDB is running and the connection string is correct');
        process.exit(1);
    }
};

module.exports = connectDB;
