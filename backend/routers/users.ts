import express from "express";
import User from "../models/User";
import mongoose from 'mongoose';
import config from "../config";


const userRouter = express.Router();

userRouter.post('/', async (req, res, next) => {
    try{
        const userMutation = {
            username: req.body.username,
            password: req.body.password,
        };
        const user = new User(userMutation);
        user.generateToken();
        await user.save();
        res.send(user);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).send(error);
        }

        next(error);
    }
});

userRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        
        if (!user) {
            res.status(400).send({error: 'Username not found!'});
        }else{
            const isMatch = await user.checkPassword(req.body.password);
            
            if (!isMatch) {
                res.status(400).send({error: 'Password is wrong!'});
            }
            
            user.generateToken();
            await user.save();
            
            res.send(user);
        }
    } catch (error) {
        return next(error);
    }
});

userRouter.delete('/sessions', async (req, res, next) => {
    try {
      const headerValue = req.get('Authorization');
  
        if (!headerValue){
            res.status(204).send();
        } else{
            const [_bearer, token] = headerValue.split(' ');
        
            if (!token){
                res.status(204).send();
            }else{
                const user = await User.findOne({token});
            
                if (!user){
                    res.status(204).send();
                }else{
                    user.generateToken();        
                    await user.save();
                    res.status(204).send();
                }
            }     
        }
        } catch (error) {
            return next(error);
        }
      }
  );

export default userRouter;