import { Model } from "mongoose";

export interface ActiveConnections {
    [id: string]: WebSocket
}

export interface IncomingMessage {
    type: string;
    payload: string;
}
export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: string;
    googleId?: string;
    displayName: string;
    avatar: string | null; 
}

export interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;