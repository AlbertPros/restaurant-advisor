require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/infrastructure/app');
const PORT = process.env.PORT || 7777;
async function startServer() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('MongoDB connected');
        app.listen(PORT, () => {
        console.log(`Express running on port ${PORT}`);
    });
    } catch (error) {
        console.error('Database connection failed');
        console.error(error);
        process.exit(1);
    }
}
startServer();