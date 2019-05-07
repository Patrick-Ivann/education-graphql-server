import {
    AuthenticationError
} from "apollo-server-core";
import jwt from 'jsonwebtoken';

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
}}

export const createToken = async (user, secret, expiresIn) => {
    const { id, mail, username,courses } = user;
    console.log(user)
    return await jwt.sign({ id, mail, username,courses }, secret, {
        expiresIn,
      });
  };


