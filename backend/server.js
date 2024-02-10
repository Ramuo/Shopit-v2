import express from "express";
import dotenv from 'dotenv';
dotenv.config()
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";



const port = process.env.PORT || 5000;


//TO CONNECT DB
connectDB();

//INITIALIZE EXPRESS
const app = express();

//BODY PARSER MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//COOKIE-PARSER
app.use(cookieParser());


//ROUTES
app.get('/', (req, res) => {
    res.send('API is running...')
});


//MIDDLEWARES


//SERVER
app.listen(port, () => console.log(`Server running on port ${port}`));