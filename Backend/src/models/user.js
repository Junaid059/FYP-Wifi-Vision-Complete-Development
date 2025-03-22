import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String},
    address:{type:String},
    password:{type:String, required:true},
    role:{type:String, required:true},
    isActive:{type:Boolean},
});

const User = mongoose.model('User', userSchema);
export default User;