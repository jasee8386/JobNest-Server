// MongoDB connection
const mongoose = require("mongoose")
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECTION_LINK);
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
