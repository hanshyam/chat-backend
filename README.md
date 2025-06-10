# Chat Application Backend

This is the **backend server** for a real-time Chat Application built using **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. It handles user authentication, chat room management, and real-time messaging with WebSocket support.

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Socket.IO**
- **JWT for Authentication**
- **CORS**
- **dotenv**

---

## 🚀 Features

- User registration and login with JWT
- Real-time one-to-one and group messaging using Socket.IO
- Create and join chat rooms
- Fetch previous messages from MongoDB
- Online/offline user tracking (via sockets)
- Secure REST API for users and messages

---

## 📁 Project Structure
backend/
├── config/
│ ├── db.js # MongoDB connection
│ └── GenerateJwtToken.js # JWT generation helper
├── controllers/
│ ├── userController.js # User-related logic
│ └── messageController.js # Message-related logic
├── middleware/
│ ├── errorHandler.js # Global error handling
│ ├── multer.js # Image upload middleware
│ └── tokenVerification.js # JWT auth verification
├── models/
│ ├── userModel.js # Mongoose User schema
│ └── messageModel.js # Mongoose Message schema
├── public/assets/images/ # Uploaded assets
├── routes/
│ ├── userRoute.js # User routes
│ └── messageRoute.js # Message routes
├── utils/
│ └── cloudinary.js # Cloudinary upload integration
├── .env # Environment config
├── constants.js # Application constants
├── .gitignore
└── server.js # Entry point of the backend

