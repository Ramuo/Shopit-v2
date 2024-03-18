import path from 'path';
import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import paymentRoute from './routes/paymentRoute.js';


const port = process.env.PORT || 5000;


//TO CONNECT DB
connectDB();

//INITIALIZE EXPRESS
const app = express();

//BODY PARSER MIDDLEWARE
app.use( express.json({
      limit: "10mb",
      verify: (req, res, buf) => {
        req.rawBody = buf.toString();
      },
    })
);
app.use(express.urlencoded({extended: true}));


//COOKIE-PARSER
app.use(cookieParser());



//ROUTES
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoute);

app.get('/', (req, res) => {
    res.send('API is running...')
});

//STATIC ROUTE
const __dirname = path.resolve(); //Set __dir to current directory
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    //any route that is not api will redirect to index.html
    app.get('*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
}else{
    app.get('/', (req, res) => res.send('API Running'));
};

//MIDDLEWARES
app.use(notFound);
app.use(errorHandler);

//SERVER
app.listen(port, () => console.log(`Server running on port ${port}`));