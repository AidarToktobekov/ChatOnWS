import { createAsyncThunk } from "@reduxjs/toolkit";
import { GlobalError, IUser, LoginMutation, RegisterMutation, ValidationError } from "../../types";
import axiosApi from "../../axiosApi";
import { isAxiosError } from "axios";
import { unsetUser } from './userSlice';
import { RootState } from "../../app/store";

export const register = createAsyncThunk<IUser, RegisterMutation, {rejectValue: ValidationError}>(
    'user/register',
    async(registerMutation, {rejectWithValue})=>{
        try{
            const {data: user} = await axiosApi.post<IUser>('/users', registerMutation);
            return user;
        }catch(e){
            if(isAxiosError(e) && e.response && e.response.status === 400){
                return rejectWithValue(e.response.data);
            }

            throw e;
        }
    },
);

export const login = createAsyncThunk<IUser, LoginMutation, {rejectValue: GlobalError}>(
    'users/login',
    async(loginMutation, {rejectWithValue})=>{
        try{
            const {data: user} = await axiosApi.post<IUser>('/users/sessions', loginMutation);
            return user;
        }catch(e){
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data as GlobalError);
            }

            throw e;
        }
    },
);


export const logout = createAsyncThunk<void, void, { state: RootState }>(
    'users/logout',
    async (_arg, { getState, dispatch }) => {
      const token = getState().users.user?.token;
      await axiosApi.delete('/users/sessions', { headers: { Authorization: `Bearer ${token}` } });
      dispatch(unsetUser());
    },
);