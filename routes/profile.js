var models = require('../models')
var genres = require('../genres.json')
var util = require('../util')

exports.profile = function (req, res) {
	if (!req.session['uid']) {
		res.redirect('/login?redirect=\/profile');
		return;
	}

	util.getCurrentUser(req, function(u) {
		var userGenres = u.genres;
		var profileGenres = [];
		for (var key in genres) {
			var genre = {"key":key, "name":genres[key]['name']}
			genre['checked'] = false;
			for (var i = 0; i < userGenres.length; i++) {
				if (key === userGenres[i]) {
					genre['checked'] = true;
				}
			}
			profileGenres.push(genre)
		}
		res.render('profile', {
			genres: profileGenres,
			profile: true,
			title: 'Profile',
			username: u.username
		})
	})

}

exports.doProfile = function (req, res) {
	if (!req.session['uid']) {
		res.redirect('/login?redirect=\/profile');
		return;
	}

	var genres = []

	for (key in req.body) {
		if (req.body[key] == 'on')
			genres.push(key)
	}

	models.User.findById(req.session['uid']).exec(function(error, u) {
		u.genres = genres;
		u.save(function(err){
			res.redirect('/clip');
		});
	});
}