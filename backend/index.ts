import express,  { Request } from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import userRouter from "./routers/users";
import { IncomingMessage } from "./types";
import User from "./models/User";
import expressWs from "express-ws";
import { WebSocket } from 'ws';
import Message from "./models/Message";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
expressWs(app);

const chatRoom:WebSocket[] = [];
const connectedClients: WebSocket[] = [];

const chatRouter = express.Router();

chatRouter.ws('/chat',  async(ws, req) => {
    console.log('Client connected');
    chatRoom.push(ws);
    
    let token = '';
    const message = await Message.find();
    const lastMessages = message.slice(-31);
    lastMessages.forEach(async(message)=>{
        const user = await User.findById(message.user);
        ws.send(JSON.stringify({
            type: 'LAST_MESSAGES',
            payload: {
                username: user?.username,
                id: user?._id,
                message: message.text,
            }
        }))
    })

    ws.on('message', async(message)=>{
        try{
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;
            if (decodedMessage.type === 'LOGIN') {
                if (decodedMessage.payload) {
                    connectedClients.push(ws);
                    token = decodedMessage.payload;
                    const user = await User.findOne({token});
                    if (!user) {
                        return ws.send(JSON.stringify({error: 'User not found'}));
                    }
                    connectedClients.forEach((clientWs)=>{
                        clientWs.send(JSON.stringify({
                            type: 'LOGIN',
                            payload: {
                                username: user.username,
                                id: user._id,
                            }
                        }));
                    })
                }
            }
            if(decodedMessage.type === 'SET_MESSAGE'){
                if (!token) {
                    
                    return ws.send(JSON.stringify({error: 'user is not registered'}))
                }
                const user = await User.findOne({token});
                if (!user) {
                    return ws.send(JSON.stringify({error: 'User not found'}));
                }
                const messageMutation = {
                    user: user._id,
                    text: decodedMessage.payload,
                }
                const message = new Message(messageMutation);
                message.save();
                chatRoom.forEach((clientWs)=>{
                    clientWs.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
                        payload: {
                            username: user.username,
                            id: user._id,
                            message: decodedMessage.payload,
                        }
                    }));
                })
            }
        }catch(e){
            ws.send(JSON.stringify({error: 'Invalid message'}))
        }
    })

    ws.on('close', ()=>{
        console.log('client disconnected');
        const index = connectedClients.indexOf(ws);
        chatRoom.splice(index, 1)
    })
});

app.use(chatRouter);
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