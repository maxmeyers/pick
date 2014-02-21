var https = require('https')
var rest = require('../lib/rest.js')
var request = require('request')
var models = require('../models')
var mongoose = require("mongoose")

exports.test = function(req, res) {

	console.log("current user id: " + req.session['uid']);
	if (!req.session['uid']) {
		res.redirect('/login')
		return;
	}
	var random = false;
	var user;
	models.User.findById(req.session['uid']).exec(function(error, u) {
		user = u;

		if (req.query['film_id']) {
			getClip(req.query['film_id'])
		} else {
			rest.getJSON({
				host: 'api-test.filmaster.tv',
				path: '/rest/1.0/user/'+user.id+'/recommendations/',
				auth: 'test_imdb:test', 
			}, function(status, result) {
				console.log(result)
				var objects = result.objects;
				if (objects.length) {
					random = true;
					index = Math.floor(Math.random()*objects.length)
					var movie = objects[index]
					getClip(movie['film_id'])					
				} else {
					res.redirect('/start')
				}

			})		
		}
	});

	function getClip(film_id) {
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
				https.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+encoded_title+'+trailer&key=AIzaSyAbHW3PwwDloBV8nQfX2pWrX-MXaX3sg78',
					function(response) {
						var output = '';
						response.on('data', function(chunk) {
							output += chunk;
						})

						response.on('end', function() {
							var obj = JSON.parse(output);

							var id = obj.items[0]['id']['videoId'];

							res.render('clip', {
								'title': title,
								'youtube_id': id,
								'movie_id': movie_id,
                'image': 'http://icons.iconarchive.com/icons/visualpharm/ios7v2/48/Movie-Genres-Comedy-icon.png',
                'random': random
							})
						});
					});
			});
		});
	}
}