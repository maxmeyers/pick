var http = require('http')
var request = require('request')
var util = require('../util')

exports.rate = function(req, res) {
	if (!req.session['uid']) {
		res.redirect('/login');
		return;
	}
	var redirect = req.query['redirect'] ? req.query['redirect'] :'/clip'

	var movie_id = req.query['movie_id'];
	var rating = req.query['rating'];

	var film_uri = '/rest/1.0/film/'+movie_id+'/'
	var ratingNum = parseInt(rating)
	if (!ratingNum) {
			util.getCurrentUser(req, function(user) {
				if (!user.skips) {
					user.skips = [];
				}
				user.skips.push(movie_id);
				console.log(user.skips);
				user.save(function() {
					res.redirect(redirect)
				})
			});
	} else {
		if (ratingNum > 5) {
			ratingNum = '';
		} else {
			ratingNum = ratingNum * 2; // translate to filmaster scale of 1 to 10
		}
		request ( {
			'uri': 'http://api-test.filmaster.tv/rest/1.0/user/'+req.session['uid']+'/ratings/',
			'auth': {
				'user': 'test_imdb',
				'pass': 'test'
			},
			'method': 'POST',
			'form': {
				rating: ratingNum,
				film_uri: film_uri
			},
		}, function (error, result, body) {
			if (error) {
				console.log(error)
			}

			request( {
				'uri': 'http://www.omdbapi.com/?i=tt'+movie_id
			}, function (error, result, body) {
				var info = JSON.parse(body);
				res.render('rate', {
					'title': info['Title'],
					'rating': rating,
					'img_url': info['Poster']
				})
			});

		});

	}


}