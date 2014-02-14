var http = require('http')
var rest = require('../lib/rest.js')

exports.rate = function(req, res) {
	console.log(req.query)
	var movie_id = req.query['movie_id'];
	var rating = req.query['rating'];

	var ratingNum = parseInt(rating)*2

	console.log("Rating: " + rating)
	console.log("movie_id: " + movie_id)
	rest.getJSON({
		host:'api-test.filmaster.tv',
		path:'/rest/1.0/user/picktest/ratings/',
		auth:'test_imdb:test',
		rating: ratingNum,
		film_uri: '/rest/1.0/film/'+movie_id
	}, function(status, result) {
		console.log("Rating Result:");
		console.log(result)
		res.redirect('/clip')
	})
}