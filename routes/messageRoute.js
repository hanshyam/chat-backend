import express from 'express';
import { getMessages, getUsersForSidebar, markmessageSeen, sendMessage } from '../controllers/messageController.js';
import verifyToken from '../middleware/tokenVerification.js';

const router = express.Router();

router.get('/users',verifyToken,getUsersForSidebar);
router.get('/:id',verifyToken,getMessages);
router.put('/mark/:id',verifyToken,markmessageSeen);
router.post('/send/:id',verifyToken,sendMessage);


export default router;