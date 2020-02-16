const Joi = require('@hapi/joi');


const schema  = {
	user: Joi.object({
		name: Joi.string().min(3).max(100).required(),
		email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
		password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()

	})/*,
	login: Joi.object({
		email:Joi.string().email().required(),
		password: Joi.string().email().required()
	})*/
};

module.exports = schema;