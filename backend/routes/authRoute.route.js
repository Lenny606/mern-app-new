import express from "express";
import {createUser, getUsers} from "../controllers/user.controller.js";
import {loginUser, registerUser, status, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/', loginUser);
router.post('/register', registerUser);
router.get('/status', status);
router.post('/logout', logout);

export default router;