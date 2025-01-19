import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
  }
};

export default connectDB;
