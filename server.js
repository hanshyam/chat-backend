import express from 'express'
import 'dotenv/config';
import cors from 'cors'
import http from 'http';
import { connectDB } from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import userRouter from './routes/userRoute.js'
import messageRouter from './routes/messageRoute.js'
import {Server} from 'socket.io';

// create Express app and Http server
const app = express();
connectDB();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server,{
  cors: {origin:"*"}
})

// Store Online Users
export const userSocketMap = {}; // userId: socketId

// Socket.io connection handler
io.on("connection",(socket)=>{
   const userId = socket.handshake.query.userId;
   console.log("User Connected",userId);

   if(userId) userSocketMap[userId] = socket.id;

  //  Emit online users to all connected clients
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    console.log("User Disconnected",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  })
})

// Middleware setup
app.use(express.json({limit:"4mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://chat-frontend-git-main-ghanshyam-patidars-projects.vercel.app', 
  credentials: true
}));

app.use('/api/status', (req,res)=> {
    res.send("Server is live");
})

app.use('/api/auth',userRouter);
app.use('/api/message',messageRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server is running on Port: http://localhost:${PORT}/api/status`)
})

