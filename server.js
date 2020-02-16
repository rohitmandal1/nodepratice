const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

// Connect to mongodb
mongoose
	.connect(db, {useUnifiedTopology: true})
	.then(() => console.log('Mongodb Connect'))
	.catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);	

// Use Routes
app.use('/api/users', users);

const port = process.env.PORT || 5002;

app.listen(port, () => console.log(`server is running ${port}`));
