
const express = require('express')
const app = express();
require('dotenv').config();

const connectDB = require('./DB/connect')

const Product = require('./Models/product');

const jsonProduct = require('./products.json');

const port = 3000;


const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany();
        await Product.create(jsonProduct);
        console.log('success');
        app.listen(port,()=>{
            console.log(`server is listen at port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();