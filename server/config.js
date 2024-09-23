require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://mongodb:27017/talentin',
    JWT_SECRET: process.env.JWT_SECRET || 'my_secret_key'
};
