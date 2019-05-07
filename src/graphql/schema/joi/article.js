import Joi from 'joi';


export default Joi.object().keys({
  
  

    title:Joi.string().alphanum().max(240).required().label("titre"),
    version:Joi.number().max(10).required().label("version"),
    subtitle:Joi.string().max(240).required().label("sous-titre"),
    objectives:Joi.string().max(240).required().label("objectif"),
    encoding:Joi.string().alphanum().max(240).required().label("encodage"),
    time:Joi.number().max(24).required().label("temps"),
    requirements:Joi.string().max(240).required().label("pré-requis"),
    difficulty:Joi.string().alphanum().max(50).required().label("difficulté"),
    introduction:Joi.string().max(340).required().label("introduction"),
})