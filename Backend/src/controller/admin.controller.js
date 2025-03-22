import mongoose from "mongoose";
import User from '../models/user.js';
import Connection from '../models/connection.js';
import ConnectionRequest from '../models/connection-request.js';

const getUsersCount=async(req,res)=>{
    try{
        const users=await User.find();
        return res.status(200).json({userscount:users.length});
    } 
    catch(err){
        return res.status(400).json({message:err.message});
    } 
};

const getConnectionsCount=async(req,res)=>{ 
    try{
        const connections=await Connection.find();
        return res.status(200).json({connectionscount:connections.length});
    } 
    catch(err){
        return res.status(400).json({message:err.message});
    } 
};

const getConnectionsRequest=async(req,res)=>{
    try{
        const connectionrequest=await ConnectionRequest.find();
        return res.status(200).json({connectionrequestscount:connectionrequest.length});
    } 
    catch(err){
        return res.status(400).json({message:err.message});
    } 
};

const addUser=async(req,res)=>{
    const {username,email,password,phone,address,role}=req.body;
    try{
        const user=new User({username:username,email:email,phone:phone,password:password,address:address,role:role});
        await user.save();
        return res.status(200).json({"message":"User added successfully"});
    } 
    catch(err){
        return res.status(400).json({message:err.message});
    } 
};

const addConnection=async(req,res)=>{
    const {username,email,phone,address}=req.body;
    try{
        const connection=new Connection({
            username:username,
            email:email,
            phone:phone,
            address:address
        });
        await connection.save();
        return res.status(200).json({"message":"Connection added successfully"});
    } 
    catch(err){
        return res.status(400).json({message:err.message});
    } 
};

const addConnectionRequest=async(req,res)=>{
    const {username,email,message,phone,company}=req.body;
    try{
        const connectionrequest=new ConnectionRequest({
            username:username,
            email:email,
            message:message,
            phone:phone,
            company:company
        });
        await connectionrequest.save();
        return res.status(200).json({"message":"Connection Request added successfully"});
    } 
    catch(err){
        return res.status(400).json({message:err.message});
    } 
};


export {getUsersCount,getConnectionsCount,getConnectionsRequest,addUser,addConnection,addConnectionRequest};