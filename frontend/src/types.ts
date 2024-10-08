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
