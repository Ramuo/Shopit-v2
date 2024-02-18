import express from "express";
import dotenv from 'dotenv';
dotenv.config()
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from './routes/orderRoutes.js'


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
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('API is running...')
});


//MIDDLEWARES
app.use(notFound);
app.use(errorHandler)

//SERVER
app.listen(port, () => console.log(`Server running on port ${port}`));