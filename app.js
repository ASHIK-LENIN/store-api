const express = require('express')
require('express-async-errors');
const app = express();
require('dotenv').config();
const productRouter = require('./Routes/item') 

const port = 3000;
const connectDB = require('./DB/connect');
const notFound = require('./Middleware/notFound');
const errorHandlerMiddleware = require("./Middleware/errorHandler");

app.use(express.json());

app.use('/api/products', productRouter);
app.use(errorHandlerMiddleware)
app.use(notFound);

const start = async () =>{
    
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log(`server is listen at port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();