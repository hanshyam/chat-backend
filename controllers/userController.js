import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import generateJwtToken from '../config/GenerateJwtToken.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// Register
export const register = asyncHandler(async (req,res)=>{
    const {fullName,email,password,bio} = req.body;

    if(!fullName || !email || !bio || !password){
        return res.json({success: false, message:"Missing Details"});
    }
    const user =await User.findOne({email});
    if(user){
        res.status(404);
        throw new Error("User Already Exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = await User.create({
        fullName,email,password:hashedPassword,bio
    });
    res.status(201).json({success:true,userData:newUser});
})

// Login
export const login = asyncHandler( async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        res.status(401);
        throw new Error("Missing details");
    }
    const user = await User.findOne({email});
    if(!user){
        res.status(404);
        throw new Error("User does not exist");
    }
    
    if(await bcrypt.compare(password,user.password)){
        const token = generateJwtToken(user);
        
        return res.json({
            success:true,
            userData:{
            fullName:user.fullName,
            email:user.email,
            bio:user.bio,
            },
            token:token
        });

    }else{
        res.status(400);
        throw new Error("Incorrect password or email");
    }
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, bio, profilePic } = req.body;
  const userId = req.user.id;

  const updateFields = {};
  if (fullName) updateFields.fullName = fullName;
  if (bio) updateFields.bio = bio;
  if (profilePic) updateFields.profilePic = profilePic;

  const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    userData: updatedUser,
  });
});


// Get user
export const checkUser = asyncHandler( async (req,res)=>{
     const userId = req.user.id;
     const user = await User.findById(userId);
     res.json({success:true,userData:user});
})





