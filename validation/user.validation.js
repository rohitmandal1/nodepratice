const { user } = require("./user.schema");
const { login } = require("./user.schema");

module.exports= {
	 validateRegisterInput: async (req, res, next) => {
	 	const value = await user.validate(req.body);
	 	if (value.error) {
	 		res.status(400)
	 			.json({
	 				success: 0,
	 				message: value.error.details[0].message})
	 		/*res.json({
	 			success: 0,
	 			message: value.error.details[0].message
	 		})*/
	 	} else {
	 		next();
	 	}
	 },

/*	 validateLoginInput: async (req, res, next) => {
	 	const value = await login.validate(req.body);
	 	if (value.error) {
	 		res.json({
	 			success:0,
	 			message: value.error.details[0].message
	 		})
	 	} else {
	 		next();
	 	}
	 }*/
};