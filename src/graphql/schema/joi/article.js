import Joi from 'joi';


export default Joi.object().keys({
  
  

    title:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(240).required().label("titre"), //accept string containing character, commas,space, digit up to 240 characters
    subtitle:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(240).required().label("sous-titre"),
    moduleId: Joi.string(),
    version:Joi.number().max(10).required().label("version"),
    objectives:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(400).required().label("objectif"),
    encoding:Joi.string().alphanum().max(240).required().label("encodage"),
    time:Joi.number().max(24).required().label("temps"),
    requirements:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(400).required().label("pré-requis"),
    difficulty:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(50).required().label("difficulté"),
    introduction:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(340).required().label("introduction"),
})