import Joi from 'joi';

const username =  Joi.string().alphanum().min(5).max(55).required().label("username")
const mail = Joi.string().email().required().label("mail")
const firstname = Joi.string().alphanum().max(240).required().label("firstname")
const lastname = Joi.string().alphanum().max(240).required().label("lastname")
const password = Joi.string().alphanum().min(5).max(55).required().label("password")

export const signUp =  Joi.object().keys({

    username, mail,firstname,lastname,password

})


export const signIn = Joi.object().keys({
    mail, password
})
