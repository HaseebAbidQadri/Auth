import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true

    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true    
    },
    password:{ 
        type: String,   
        required: [true, "Password is required"] ,
        unique: true
    },
});
 
const usermodel= mongoose.model("User", userSchema);
export default usermodel;