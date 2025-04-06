import express from 'express';
import dotenv from 'dotenv';
import {connectDTB} from "./config/db.js";
// import productRoute from "./routes/product.route.js";
import path from "path";
import userRoute from "./routes/user.route.js";
// import categoryRoute from "./routes/category.route.js";
// import envRoute from "./routes/env.route.js";
import authRoute from "./routes/authRoute.route.js";
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
//import passport strategy from file
import "./config/strategies.js";
import {createUser} from "./controllers/user.controller.js";

const port = process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve();

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({limit: '10mb', strict: true, type: 'application/json'})) 
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))
app.disable('x-powered-by'); //disable stack detection


// // Enable CORS for all origins

//////// PASSPORT + set store to DTB
app.use(session({
    secret: "test-secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60 * 60 * 24
    },
    //saves cookies into database>
    // store: MongoStore.create({
    //     mongoUrl: process.env.DTB_URL
    // })
}))

app.use(passport.initialize())
app.use(passport.session())

// app.use("/api/products", productRoute)
app.use("/api/v1/users", userRoute)
// app.use("/api/categories", categoryRoute)
app.use("/api/v1/auth", authRoute)
// app.use("/api/env", envRoute)


if (process.env.NODE_ENV === 'production') {
    //make dist folder (builded front)  as static assets
    app.use(express.static(path.join(__dirname, "frontend/dist")))

    //serve index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}


app.listen(port, (err, res) => {
    connectDTB();
    console.log(`server listening on port ${port}`);
})