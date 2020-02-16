const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt	 = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
// User Model
const User = require('../../models/User');
// Register validation 
const { validateRegisterInput } = require('../../validation/user.validation');

// Login validation 
const { validateLoginInput } = require('../../validation/user.validation');

//Register user detail
router.post('/register', validateRegisterInput,(req,res) => {
	User.findOne({email: req.body.email})
		.then(user => {
			if(user){
			  return res.status(400).json({ email: 'Email allready Exists'});
			}{
				newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash)=>{
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(user => res.json(user))
							.catch(err => console.log(err));
					})
				})
			}
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
