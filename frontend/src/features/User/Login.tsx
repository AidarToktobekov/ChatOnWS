import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { LoginMutation } from "../../types";
import { login } from "./userThunk";
import {selectLoginError} from './userSlice'

const Login = ()=>{

    const [userState, setUserState] = useState<LoginMutation>({
        username: '',
        password: '',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const error = useAppSelector(selectLoginError)

    const inputChangeHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setUserState(prevState =>({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }

    const submitFormHandler = async(event: React.FormEvent)=>{
        event.preventDefault();
        await dispatch(login(userState)).unwrap();
        navigate('/');
    }
   

    return(
        <>
            <form onSubmit={submitFormHandler}>
                <h3 className="text-center my-4">
                    Sign in
                </h3>
                <span className="text-danger">
                    {error?.error}
                </span>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="name" value={userState.username} required name="username" onChange={inputChangeHandler} className="form-control"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" value={userState.password} required name="password" onChange={inputChangeHandler} className="form-control"/>
                </div>
                <button type="submit" className="btn btn-dark d-block mb-3">Sign in</button>
                <Link to="/register">Or sign up</Link>
            </form>
        </>
    )
}

export default Login;