export interface ValidationError{
    errors: {
        [key:string]:{
            name: string;
            message:string;
        };
    };
    message: string;
    name: string;
    _message: string;
}

export interface RegisterMutation{
    username: string;
    password: string;
}

export interface LoginMutation {
    username: string;  
    password: string;
}

export interface GlobalError{
    error: string;
}
export interface IUser{
    _id: string;
    username: string;
    token: string;
}

export interface Client{
    id: string;
    username: string;
}

export interface Message{
    username: string,
    id: string,
    message: string,
}

export interface IncomingMessage{
    type: string;
    payload: Message;  
}