import { createSlice } from "@reduxjs/toolkit";
import { GlobalError, IUser, ValidationError } from "../../types";
import { login, register } from "./userThunk";

interface UserState{
    user: IUser | null;
    registerLoading: boolean;
    registerError: ValidationError | null;    
    loginLoading: boolean;
    loginError: GlobalError | null;
}

const initialState: UserState = {
    user: null,
    registerLoading: false,
    registerError: null,   
    loginLoading: false,
    loginError: null,
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        unsetUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder)=>{
        builder
            .addCase(register.pending, (state)=>{
                state.registerLoading = true;
                state.registerError = null;
            })
            .addCase(register.fulfilled, (state, {payload: user})=>{
                state.registerLoading = false;
                state.user = user;
            })
            .addCase(register.rejected, (state, {payload: error})=>{
                state.registerLoading = false;
                state.registerError = error || null;
            })  
            .addCase(login.pending, (state)=>{
                state.loginLoading = true;
                state.registerError = null;
            })
            .addCase(login.fulfilled, (state, {payload: user})=>{
                state.loginLoading = false;
                state.user = user;
            })
            .addCase(login.rejected, (state, {payload: error})=>{
                state.loginLoading = false;
                state.loginError = error || null;
            });
    },
    selectors: {
        selectUser: (state)=>state.user,
        selectRegisterLoading: (state)=>state.registerLoading,
        selectRegisterError: (state)=>state.registerError,
        selectLoginLoding: (state)=>state.loginLoading,
        selectLoginError: (state)=>state.loginError,
    }
})

export const userReducer = userSlice.reducer;

export const { unsetUser } = userSlice.actions;

export const {
    selectRegisterError, 
    selectRegisterLoading, 
    selectUser,
    selectLoginLoding,
    selectLoginError,
} = userSlice.selectors;