const mongoose = require("mongoose");

//function for conecting to DataBase

const connectDB = async () => {
  // compass string for connecting to database
  try {
    await mongoose.connect(
      "mongodb+srv://alihamzaarshad12_db_user:NHsHIfehaHSLVjaI@cluster0.8unshu1.mongodb.net/NAEpractice",
    );
    console.log("DataBase is Connected");
  } catch (err) {
    console.error("Error connecting to DataBase", err);
  }
};
//Export that module
module.exports = {
  connectDB,
};
