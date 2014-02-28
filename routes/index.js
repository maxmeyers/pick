var models = require("../models")

exports.index = function(req, res) {
	console.log(req.session)
	if (!req.session['uid']) {
		res.render('index');
		return;
	}



	models.User.findById(req.session['uid']).exec(function(error, user) {
		console.log(user);
		res.render('index', {
			'username':user.username,
			'home': true,
			'title': 'Welcome to Pick'
		})
	})
}