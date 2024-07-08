import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { v2 as cloudinary } from 'cloudinary';
import bodyParser from 'body-parser'
import { app, server } from './socket/socket.js'
import job from './cron/cron.js';

          
dotenv.config();

connectDB();
job.start();


const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({ 
    cloud_name: 'dl7m3kryk', 
    api_key: '658941242796238', 
    api_secret: 'xqnWjmFzZ5cSpbaol3YB5FbSBzc' 
  });  

//Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());//To parse json data in the req.body
app.use(express.urlencoded({extended: true}))//To parse form data in the req.body(even nested objects)
app.use(cookieParser());

//Routes
app.use("/api/users",userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)

//http://localhost:5000 => backend,frontend

//Serve static assets(from frontend/dist) only in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

server.listen(PORT,()=>{console.log(`Server started at port ${PORT}`);})