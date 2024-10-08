import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Client, IncomingMessage, Message } from "../../types";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../User/userSlice";

const Chat = ()=>{
    const ws = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUser] = useState<Client[]>([])
    const [newMessages, setNewMessages] = useState('');
    const user = useAppSelector(selectUser);
    
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');
        ws.current.onopen = ()=>{
            if (!ws.current) return;
            ws.current.send(JSON.stringify({
                type: 'LOGIN',
                payload: user?.token,
            }));
        }
        ws.current.onclose = () => console.log("ws closed");
    
        ws.current.onmessage = event => {
          const decodedMessage = JSON.parse(event.data) as IncomingMessage;
    
          if (decodedMessage.type === 'NEW_MESSAGE') {
            setMessages((message) => [...message, decodedMessage.payload]);
          }
          if (decodedMessage.type === 'LAST_MESSAGES') {
            setMessages((message) => [...message, decodedMessage.payload]);
          }
          if (decodedMessage.type === 'LOGIN') {
            setOnlineUser((prev) => [...prev, decodedMessage.payload]);
          }
        };
    
      }, []);

    const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>)=>{
        setNewMessages(event.target.value);
    }

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!ws.current) return;
        ws.current.send(JSON.stringify({
            type: 'SET_MESSAGE',
            payload: newMessages,
        }));
    };
    

    return(
        <>
            <div className="d-flex gap-5 justify-content-between mt-4">
                <div className="px-3">
                    <h2>
                        Online Users
                    </h2>
                    <hr />
                    {onlineUsers.length < 1 && (
                        <>
                            No online users
                        </>
                    )}
                    {onlineUsers.map((user)=>{
                        return(
                                <div key={user.id}>
                                    {user.username}
                                </div>
                        )
                    })}
                </div>
                <div className="d-flex flex-column flex-grow-1 border border-1 p-2 rounded-3 bg-secondary-subtle">
                    <h2 className="mt-2 text-center">
                        Chat room
                    </h2>
                    <hr />
                    <div className="overflow-auto" style={{height: '400px'}}>
                        {messages.map((message)=>{
                            return(
                                <div className="p-1 bg-light mt-1 rounded-2" key={message.id}>
                                    {message.username}: {message.message}
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-3">
                        <form onSubmit={sendMessage}>
                            <div className="d-flex gap-4">
                                <div className="flex-grow-1">
                                    <input type="text" required onChange={inputChangeHandler} className="form-control" placeholder="Enter message"/>
                                </div>
                                <div className="">
                                    <button className="btn btn-primary" type="submit">Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat;