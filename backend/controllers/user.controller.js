import mongoose from "mongoose";
import UserTest from "../models/user.model.js";
import Logger from "../utility/logger.js";

export const getUsers = async (req, res) => {

    Logger.info("getUsers called")
    try {
        //TODO remove test model in the end
        const products = await UserTest.find({}) //finds all products
        res.status(200).json({success: true, data: products})
    } catch (err) {
        res.status(500).json({success: false, message: err.message})
    }
}
// export const deleteProduct = async (req, res) => {
//     const {id} = req.params
//
//     try {
//         await Product.findByIdAndDelete(id);
//         res.status(200).json({success: true, message: "Product deleted successfully"})
//     } catch (err) {
//         res.status(404).json({success: false, message: "Product not found"})
//     }
// }

// export const updateProduct = async (req, res) => {
//     const {id} = req.params
//
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).json({success: false, message: "Id invalid"})
//     }
//
//     const product = req.body
//
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true});
//         res.status(200).json({success: true, message: "Product updated successfully", data: updatedProduct})
//     } catch (err) {
//         res.status(500).json({success: false, message: err.message})
//     }
// }

export const createUser = async (req, res) => {
    const user = req.body // deconstruct => {body} = req
    if (!user.name) {
        return res.status(400).json({success: false, message: "Some fields ware not provided"})
    }

    const newUser = new UserTest(user)
    newUser.isRegistered = true;

    try {
        await newUser.save()
        res.status(200).json({success: true, message: "Product saved successfully", data: newUser})
    } catch (err) {
        console.log("Error saving product" + err.message)
        res.status(500).json({success: false, message: "Product not saved", error: err.message})
    }
}