const express = require('express');
const router = express.Router();
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const jwt	 = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


const config = require('../../config/config.json');

// Aws cognito userpool

const UserPoolId= config.cognito.userPoolId;
const ClientId= config.cognito.clientId;
const userPool = new AmazonCognitoIdentity.CognitoUserPool({UserPoolId,ClientId});
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
	//console.log(emailData);
	const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailData);
	//onsole.log(emailAttribute);
	userPool.signUp(email, password, [ emailAttribute ], null, (err, data) =>{
		if(err){
			//req.session['sign-up-errors'].push(err.message.replace('Password did not conform with policy :', ''))
			 return console.log(err);
		}
		res.send(data.user);
	})
});

// user Login and Returning token
router.post('/login', (req, res) =>{
	const loginDetails = {
		Username: req.body.email,
		Password: req.body.password
	}

	const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);
	//console.log(req.body.email);
	const userDetails = {
		Username: req.body.email,
		Pool : userPool 
	}
	//console.log(userPool);
	//console.log(userDetails)
	const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);
	
	//req.session['log-in-errors'] = []

	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: data  => {
		   return res.send(data);;
		},
		onFailure: err => {
			 //req.session['login-in-errors'].push(err.message)
			 return console.log(err);
		}		
	})
});

//get current user
// router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
// 	res.json({
// 		id: req.user.id,
// 		name: req.user.name,
// 		email:req.user.email
// 	});
// });
module.exports = router;
