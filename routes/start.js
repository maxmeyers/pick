var starters = require('../starters.json')
var models = require('../models')
var genres = require('../genres.json')

exports.start = function (req, res) {
	if (!req.session['uid']) {
		res.redirect('/login?redirect=\/start');
		return;
	}

	models.User.findById(req.session['uid']).exec(function(error, u) {
		var userGenres = u.genres;
		var startGenres = [];
		for (var key in genres) {
			var genre = {"key":key, "name":genres[key]['name']}
			genre['checked'] = false;
			for (var i = 0; i < userGenres.length; i++) {
				if (key === userGenres[i]) {
					genre['checked'] = true;
				}
			}
			startGenres.push(genre)
		}
		console.log(startGenres)
		res.render('start', {
			genres: startGenres
		})
	})

}

exports.doStart = function (req, res) {
	if (!req.session['uid']) {
		res.redirect('/login?redirect=\/start');
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