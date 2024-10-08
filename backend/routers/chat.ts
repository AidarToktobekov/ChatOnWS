import { WebSocket } from 'ws';
import express from 'express';
import { IncomingMessage } from '../types';
import User from '../models/User';

const connectedClients:WebSocket[] = [];

const chatRouter = express.Router();
chatRouter.ws('/chat',  (ws, req) => {
    console.log('Client connected');
    connectedClients.push(ws);

    let username = 'Anonimous';
    let id = '';
    ws.on('message', async(message)=>{
        try{
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;
            if(decodedMessage.type === 'SET_MESSAGE'){
                const user = await User.findById(id);
                if (user) {
                    const messageMutation = {
                        user: user._id,
                        text: decodedMessage.payload,
                    }
                    // await new Message(messageMutation);
                    connectedClients.forEach((clientWs)=>{
                        clientWs.send(JSON.stringify({
                            type: 'NEW_MESSAGE',

                            payload: {
                                username,
                                message: decodedMessage.payload,
                            }
                        }));
                    })
                }
            }
        }catch(e){
            ws.send(JSON.stringify({error: 'Invalid message'}))
        }
    })

    ws.on('close', ()=>{
    console.log('client disconnected');
    const index = connectedClients.indexOf(ws);
    connectedClients.splice(index, 1)
    })
});

export default chatRouter; 