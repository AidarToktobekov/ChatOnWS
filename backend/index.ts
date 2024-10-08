import express,  { Request } from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import userRouter from "./routers/users";
import { IncomingMessage } from "./types";
import User from "./models/User";
import expressWs from "express-ws";
import chatRouter from "./routers/chat";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
// expressWs(app);

// app.use('/', chatRouter);
app.use('/users', userRouter);

const run = async()=>{
    await mongoose.connect(config.database);
    app.listen(port, ()=>{
        console.log(`Server started on ${port} port!`);
    })
    
    process.on('exit', ()=>{
        mongoose.disconnect();
    });
}

run().catch(console.error);