var https = require('https')
var rest = require('../lib/rest.js')
var request = require('request')
var models = require('../models')
var mongoose = require("mongoose")
var request = require('request')
var util = require('../util')

exports.test = function(req, res) {
	if (!req.session['uid']) {
		res.redirect('/login')
		return;
	}
	var user;
	var genreString;
	models.User.findById(req.session['uid']).exec(function(error, u) {
		user = u;
		if (!user.genres) {
			user.genres = [];
			user.save();
		}
		genreString = util.genreString(user.genres)

		if (req.query['film_id']) {
			getClipAndRenderPage(req.query['film_id'])
		} else {
			rest.getJSON({
				host: 'api-test.filmaster.tv',
				path: '/rest/1.0/user/'+user.id+'/recommendations/',
				auth: 'test_imdb:test', 
			}, function(status, result) {
				var objects = result.objects;
				if (objects.length) {
					var firstTry = objects[0]['film_id'];

					var possibleMovieIds = [];
					var userSkips = util.arrayify(user.skips);
					for (var i = 0; i < objects.length; i++) {
						var movie_id = objects[i]['film_id'];
						if (userSkips.indexOf(movie_id) == -1) {
							possibleMovieIds.push(movie_id)
						}
					}

					testFilms(possibleMovieIds, 0, util.namesForKeys(user.genres), function(movie_id) {
						getClipAndRenderPage(movie_id)					
					}, function() {
						getClipAndRenderPage(firstTry)
					})
				} else {
					res.redirect('/start')
				}

			})		
		}
	})

	function testFilms(movies, startingIndex, acceptableGenreNames, success, failure) {
		var gotOne = false;
		var callbacks = 0;
		var requests = 10;

		for (var i = startingIndex; i < startingIndex + requests; i++) {
			if (i > movies.count || !movies[i]) {
				failure();
				break;
			} else {
				testFilm(movies[i], acceptableGenreNames, function(movie_id) {
					callbacks++;
					if (!gotOne) {
						gotOne = true;
						success(movie_id);
					}
				}, function () {
					callbacks++;
					if (callbacks == requests && !gotOne) {
						testFilms(movies, startingIndex+requests, acceptableGenreNames, success, failure);
					}
				});
			}
		}
	}

	function testFilm(movie_id, acceptableGenreNames, success, failure) {
		request({
			'uri': 'http://www.omdbapi.com/?i=tt'+movie_id
		}, function (err, result, body) {
			var genre_string = JSON.parse(body)['Genre'];
			var genres = genre_string.split(', ');

			var good = false;
			for (var i in genres) {
				for (var j in acceptableGenreNames) {
					if (genres[i] === acceptableGenreNames[j]) {
						good = true;
					}
				}
			}

			if (good) {
				success(movie_id);
			} else {
				failure();
			}
		});
	}

	function getClipAndRenderPage(film_id) {
		rest.getJSON( {
			host: 'api-test.filmaster.tv',
			path:	'/rest/1.0/film/'+film_id+'/',
			auth: 'test_imdb:test', 
		}, function(status, result) {
			var title = result['title']
			var movie_id = result['id']

			request ( {
				'uri': 'http://api-test.filmaster.tv/rest/1.0/user/'+user.id+'/explain/'+movie_id+'/',
				'auth': {
					'user': 'test_imdb',
					'pass': 'test'
				},
				'method': 'GET',
			}, function (error, result, body) {

				encoded_title = encodeURIComponent(title + ' trailer');
				request(
					{
						uri: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+encoded_title+'+trailer&key=AIzaSyAbHW3PwwDloBV8nQfX2pWrX-MXaX3sg78',
					}, function(error, result, body) {
							var obj = JSON.parse(body);

							var id = obj.items[0]['id']['videoId'];

							request({
								'uri':'http://api-test.filmaster.tv/rest/1.0/user/'+req.session['uid']+'/explain/'+movie_id,
								'auth': {
									'user': 'test_imdb',
									'pass': 'test'
								},
							}, function (err, result, body) {
								var explain = JSON.parse(body)['html']
								explain = explain.split("<p>")[1]
								res.render('clip', {
									'title': title,
									'youtube_id': id,
									'movie_id': movie_id,
	                'image': 'http://icons.iconarchive.com/icons/visualpharm/ios7v2/48/Movie-Genres-Comedy-icon.png',
	                'genres': genreString,
	                'explain': explain,
								})
							})
						});
			});
		});
	}
}