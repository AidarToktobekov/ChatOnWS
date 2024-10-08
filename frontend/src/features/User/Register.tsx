import { useState } from "react";
import { RegisterMutation } from "../../types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { selectRegisterError } from "./userSlice";
import { register } from "./userThunk";

const Register = ()=>{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const error = useAppSelector(selectRegisterError);

    const getFieldError = (fieldName: string)=>{
        return error?.errors[fieldName].message;
    }

    const [state, setState] = useState<RegisterMutation>({
        username: '',
        password: '',
    });

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = event.target;
        setState((prev)=>({
            ...prev,
            [name]: value,  
        }));
    };

    const submitFormHandler = async(event: React.FormEvent) =>{
        event.preventDefault();
        try{
            await dispatch(register(state)).unwrap();
            navigate('/');
        }catch(e){
            console.log('Error');
        }
    }

    return(
        <>  
        <form onSubmit={submitFormHandler}>
            <h3 className="text-center my-4">
                Sign up
            </h3>
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input value={state.username} type="name" required name="username" onChange={inputChangeHandler} className="form-control"/>
                <span className="text-6 text-danger">{getFieldError('username')}</span>
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input value={state.password} type="password" required name="password" onChange={inputChangeHandler} className="form-control"/>
                <span className="text-6 text-danger">{getFieldError('username')}</span>
            </div>
            <button type="submit" className="btn btn-dark d-block mb-3">Sign up</button>
            <Link to="/login">Already have an account? Sign in</Link>
        </form>
        </>
    )
}

export default Register;