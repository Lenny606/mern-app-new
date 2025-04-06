import express from "express";
import {createUser, getUsers} from "../controllers/user.controller.js";

const router = express.Router();

//TODO fix and edit
router.post('/xx', createUser);
router.get('/x', getUsers);
// router.delete('/:id', deleteProduct)
// router.put('/:id', updateProduct)
// router.post('/', createProduct)
export default router;