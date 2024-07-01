const mongoose = require('mongoose');
const url = process.env.MONGO_URL;
mongoose.set('strictQuery', false);
mongoose.connect(url);
