import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDTB = async () => {
    try {
        await mongoose.connect(process.env.DTB_URL)
        console.log('connection dtb success')
    } catch (err) {
        console.log('connection dtb error: ' + err)
        process.exit(1)
    }
}