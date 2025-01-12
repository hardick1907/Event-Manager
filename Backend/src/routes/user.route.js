import express from 'express';
import { checkAuth, Login, logout, Register } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/register",Register);
router.post("/login",Login);
router.get("/checkauth",protectRoute,checkAuth);
router.get("/logout",logout);

export default router;