var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



//Create models
var User = require('../modules/user');
var Marker = require('../modules/marker');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

//Main app
router.get('/checkout',ensureAuthenticated, function (req, res) {
	res.render('checkout');
});





function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

// Create Events
router.post('/checkout', function(req,res){
	var eventName = req.body.eventName;
	var eventDesc = req.body.eventDesc;
	var eventTime = req.body.eventTime;

	req.checkBody('eventName', 'Name is required').notEmpty();
	req.checkBody('eventDesc', 'Email is required').notEmpty();
	req.checkBody('eventTime', 'Email is not valid').notEmpty();

	var errors = req.validationErrors();

	if(errors)
	{
		res.render('checkout', {
			errors: errors
		});
	}else{
		var newMarker = new Marker({
						eventName: eventName,
						eventDesc: eventDesc,
						eventTime: eventTime,

		});

		Marker.createMarker(newMarker, function (err, marker) {
			if (err) throw err;
			console.log(marker);
		});
			req.flash('success_msg', 'You are registered and can now login');
			res.redirect('/users/checkout');
	}
});


// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var rpassword = req.body.rpassword;


	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('rpassword', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors)
	{
		res.render('register', {
			errors: errors
		});
	}else{
		var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password

		});

		User.createUser(newUser, function (err, user) {
			if (err) throw err;
			console.log(user);
		});
			req.flash('success_msg', 'You are registered and can now login');
			res.redirect('/users/login');
	}

});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/users/checkout', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;