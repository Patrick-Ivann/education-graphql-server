import Joi from 'joi';


export default Joi.object().keys({
  
  

    title:Joi.string().alphanum().max(240).required().label("titre"),
    subtitle:Joi.string().max(240).required().label("sous-titre"),
    introduction:Joi.string().max(340).required().label("introduction"),
    objectives:Joi.string().max(240).required().label("objectif"),
    requirements:Joi.string().max(240).required().label("pré-requis"),
})

