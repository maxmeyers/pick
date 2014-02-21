var http = require('http')
var request = require('request')

exports.rate = function(req, res) {
	if (!req.session['uid']) {
		res.redirect('/login');
		return;
	}

	console.log(req.query)
	var movie_id = req.query['movie_id'];
	var rating = req.query['rating'];

	var film_uri = '/rest/1.0/film/'+movie_id+'/'
	var ratingNum = parseInt(rating)
	if (ratingNum) {
		ratingNum = ratingNum * 2;
	} else {
		ratingNum = ''
	}

	var redirect = req.query['redirect'] ? req.query['redirect'] :'/clip'

	console.log("Rating: " + rating)
	console.log("movie_id: " + movie_id)
	console.log("film_uri: " + film_uri)

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
		res.redirect(redirect)
	});

}