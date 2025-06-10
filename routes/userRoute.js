import express from 'express';
import { register,login, updateProfile, checkUser } from "../controllers/userController.js";
import verifyToken from '../middleware/tokenVerification.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.put('/updateProfile',verifyToken,upload.single('profilePic'),updateProfile);
router.get('/check',verifyToken,checkUser);

export default router; 