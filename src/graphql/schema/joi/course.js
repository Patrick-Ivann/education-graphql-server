import Joi from 'joi';


export default Joi.object().keys({
  
  

    title:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(240).required().label("titre"),
    subtitle:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(240).required().label("sous-titre"),
    introduction:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(340).required().label("introduction"),
    objectives:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(400).required().label("objectif"),
    requirements:Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).max(400).required().label("pré-requis"),
})

