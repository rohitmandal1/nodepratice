const express = require('express');
const router = express.Router();
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const bcrypt = require('bcryptjs');
const jwt	 = require('jsonwebtoken');
//const keys = require('../../config/keys');
//const passport = require('passport');


const config = require('./config.json');

// Aws cognito userpool
const Pooldata = {
	UserPoolId: config.cognito.userPoolId,
	ClientId: config.cognito.clientId
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(Pooldata);
// User Model
const User = require('../../models/User');
// Register validation 
//const { validateRegisterInput } = require('../../validation/user.validation');

// Login validation 
const { validateLoginInput } = require('../../validation/user.validation');

//Register user detail
router.post('/register', (req, res) => {
	
		name= req.body.name;
		email= req.body.email;
		password= req.body.password;
	

	const emailData = {
		Name: 'email',
		Value: email

	};
	
	const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailData);

	userPool.signUp(email, password, [ emailAttribute ], null, (err, data) =>{
		if(err){
			return console.log(err);
		}
		res.send(data.user);
	})
});

// user Login and Returning token
router.post('/login',(req, res) =>{
	const email = req.body.email;
	const password = req.body.password;

	//Find user by email
	User.findOne({email})
		.then(user =>{
			// check for user
			if (!user) {
				return res.status(404).json({email: "user not found"});
			}

			// check password
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						//res.json({msg : "sucesss"})
						//User matched
						const payload = {id: user.id, name: user.name} // Create Jwt payload
						// Sign Token
						jwt.sign(payload, keys.secretOrKey, { expiresIn : 3600}, (err ,token) =>{
							res.json({sucesss: true, token: 'Bearer ' + token});
						}); // payload data and secret key and token(expiresIn) expire time
					} else{
						res.status(400).json({msg : " password incorect"})
					}
				}) 
		})
});

//get current user
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email:req.user.email
	});
});
module.exports = router;
