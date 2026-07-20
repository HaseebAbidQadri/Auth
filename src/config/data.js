import mongoose from "mongoose";
import config from "./config.js";



async function connectdb(){
   await mongoose.connect(config.Mongo_URI)
    console.log("MongoDB connected successfully");
}

export default connectdb;