import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String},
    address:{type:String},
});

export default mongoose.model('Connection', connectionSchema);