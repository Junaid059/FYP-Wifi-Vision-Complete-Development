import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String},
    company:{type:String},
    message:{type:String},
});

export default mongoose.model('ConnectionRequest', connectionRequestSchema);
