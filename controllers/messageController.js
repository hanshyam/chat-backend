import Message from '../models/messageModel.js';
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler';
import cloudinary from '../utils/cloudinary.js';
import {io,userSocketMap} from '../server.js';

export const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const {text, image } = req.body;

    if (!senderId || !receiverId || (!text && !image)) {
        return res.status(400).json({
            success: false,
            error: 'senderId, receiverId and at least message or image are required.',
        });
    }

    let imgUrl = null;

    if (image) {
        const uploadImg = await cloudinary.uploader.upload(image);
        imgUrl = uploadImg.secure_url;
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imgUrl,
    });
    
    // Emit the new message to the receivers socket
    const receiverSocketId = userSocketMap[receiverId];
    if(receiverSocketId){
       io.to(receiverSocketId).emit("newMessage",newMessage); 
    } 
    res.json({ success: true, newMessage });
});

// get Users for Sidebar
export const getUsersForSidebar = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // Count number of  messages not seen
    const unSeenMessages = {};
    const promises = filteredUsers.map(async (user) => {
        const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
        if (messages.length > 0) {
            unSeenMessages[user._id] = messages.length;
        }
    })
    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unSeenMessages });
})

// get all messages for selected user
export const getMessages = asyncHandler(async (req, res) => {
    const myId = req.user.id;
    const selectedUserId = req.params.id;

    const messages = await Message.find({ $or: [{ senderId: myId, receiverId: selectedUserId }, { senderId: selectedUserId, receiverId: myId }] });
    
    await Message.updateMany({senderId: selectedUserId,receiverId:myId},{seen:true});

    res.json({ success: true, messages: messages });
});

// api to mark message as seen using message id
export const markmessageSeen = asyncHandler( async (req,res)=>{
    const id = req.params.id; 
    await Message.findByIdAndUpdate(id,{seen:true});
    res.json({success:true});
})
