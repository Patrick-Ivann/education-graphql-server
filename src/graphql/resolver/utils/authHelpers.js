import {
    AuthenticationError
} from "apollo-server-core";

import User from "../../../mongoDB/UserSchema";

import jwt from 'jsonwebtoken';


export const checkAuthenticated = req => {
    const message = "Il faut se connecter. "
    if (!req.session.userId) {
        throw new AuthenticationError(message) 
    }
}

export const checkUnAuthenticated = req => {
    const message = "Il faut se deconnecter. "
    if (req.session.userId) {
        throw new AuthenticationError(message) 
    }
}

export const trySignUp = async (mail, password) => {

    const message = "les informations sont fausses, veuillez réessayer."

    const user = await User.findOne({
        mail
    })


    if (!user) {
        throw new AuthenticationError(message)
    }

    if(!await user.checkPasswordEquals(password)){
        throw new AuthenticationError(message)

    }

        return user
}

export const createToken = async (user, secret, expiresIn) => {
    const { id, mail, username,courses } = user;
    console.log(user)
    return await jwt.sign({ id, mail, username,courses }, secret, {
        expiresIn,
      });
  };

export const  tradeTokenForUser = async () =>{

    return User.findById(context.req.session.userId);

}




export const authenticated = next => (root, args, context, info) => {
    if (!context.currentUser) {
        throw new Error(`Unauthenticated!`);
    }
  
    return next(root, args, context, info);
  };