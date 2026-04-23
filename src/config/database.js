const mongoose = require("mongoose");

//function for conecting to DataBase

const connectDB = async () => {
  // compass string for connecting to database
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("DataBase is Connected");
  } catch (err) {
    console.error("Error connecting to DataBase", err);
  }
};
//Export that module
module.exports = {
  connectDB,
};
