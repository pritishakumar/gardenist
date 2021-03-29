const Joi = require('joi'); 

const registerSchema = Joi.object().keys({ 
  email: Joi.string().email().min(5).max(50).required(),
  name: Joi.string().pattern(/^[a-z]+$/i).min(2).max(50).required(),
  password: Joi.string().min(2).max(100).required()
}); 

const loginSchema = Joi.object().keys({ 
  name: Joi.string().alphanum().min(2).max(50).required(),
  password: Joi.string().min(2).max(100).required()
}); 

const querySchema = Joi.object().keys({ 
  q: Joi.string().pattern(/^[a-z]+$/i).min(2).max(50).required(),
}); 

const plantIDSchema = Joi.object().keys({ 
  id: Joi.number().integer().positive().required(),
}); 

const listSchema = Joi.object().keys({ 
  id: Joi.number().integer().positive().required(),
}); 

module.exports = { 
    registerSchema,
    loginSchema,
    querySchema, 
    plantIDSchema,
    listSchema
};