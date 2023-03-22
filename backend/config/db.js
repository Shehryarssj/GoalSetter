const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongo db connected: ${conn.connection.host}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

module.exports = connectDB;
