// required('dotenv').config({path: './env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path: './env'
})

const port = process.env.PORT || 8000;
connectDB()
.then(() => {
    app.on("error",(error) => {
        console.log("Error: ", error);
        throw error 
    })
    app.listen(port, "0.0.0.0", () => {
        console.log(`server is running at t port :${port}`);
    })
})
.catch((error) =>{
    console.log("MONGO DB connection failed !!!! ", error);
    
})






















/*
import express from "express";
const app = express()

( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`) 
       app.on("error", () => {
        console.log("ERROR: ", error);
        throw error
       })
       app.listen(process.env.PORT, () => {
        console.log(`App is listening on the port ${process.env.PORT }`);
        
       })
    } catch (error) {
        console.error("ERROR: ", error);
        throw error
    }
})()

*/
