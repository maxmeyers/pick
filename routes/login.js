var models = require('../models')

exports.login = function (req, res) {
	res.render('login', {
		'redirect': req.query.redirect,
		'login':true,
		'title': 'Login to Pick'
	})
}

exports.doLogin = function (req, res) {
	function sendError (argument) {
		res.render('login', {
			'error':"Username and/or password is wrong."
		})
	}

	var username = req.body['username'];
	var password = req.body['password'];
	var redirect = req.body['redirect']

	models.User
		.find({'username':username})
		.exec(function(error, results) {
			if (results.length) {
				var user = results[0];
				var realpassword = user['password'];
				if (password === realpassword) {
					req.session['uid'] = user.id
					console.log(req.query)
					if (redirect) {
						console.log('redirect: '+ redirect	);
						res.redirect(redirect)
					} else {
						res.redirect('/clip')
					}
				} else {
					sendError();
				}
			} else {
				sendError();
			}
		})
}

exports.logout = function(req, res) {
	req.session['uid'] = null;
	res.redirect('/login')
}