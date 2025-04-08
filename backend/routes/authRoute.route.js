import express from "express";
import {createUser, getUsers} from "../controllers/user.controller.js";
import {loginUser, registerUser, status, logout } from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res) => res.status(200).json({mess: "ok"}));
router.post('/register', registerUser);
router.get('/status', status);
router.post('/logout', logout);

export default router;