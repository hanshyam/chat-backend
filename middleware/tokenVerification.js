import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const verifyToken = asyncHandler(async (req,res,next)=>{
     let token;
     
     const headerData = req.headers.authorization || req.headers.Authorization;
     
     if(headerData && headerData.startsWith("Bearer")){
        token = headerData.split(" ")[1];
        try {
             const decoded =  jwt.verify(token,process.env.MY_TOKEN_STRING);
        req.user = decoded.user;
        next();
        } catch (err) {
            console.error("Token verification failed:", err.message);
            res.status(401);
            throw new Error("User is not Authorized!");
        }
     }
     else{
         res.status(401);
        throw new Error("User is not authorized or token is missing!");
     }
})

export default verifyToken;