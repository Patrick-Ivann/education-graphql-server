import Joi from 'joi';


export default Joi.object().keys({
    username : Joi.string().alphanum().min(5).max(55).required().label("username"),
    mail:Joi.string().email().required().label("mail"),
    firstname:Joi.string().alphanum().max(240).required().label("username"),
    lastname:Joi.string().alphanum().max(240).required().label("username"),
    password:Joi.string().alphanum().min(5).max(55).required().label("username"),
})
