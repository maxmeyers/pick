var https = require('https')
var comedy = require('../genres/comedy.json')
var rest = require('../lib/rest.js')
var request = require('request')

exports.test = function(req, res) {
	index = Math.floor(Math.random()*comedy.length)
	movie = comedy[index];

	function getClip(film_id) {
		rest.getJSON( {
			host: 'api-test.filmaster.tv',
			path:	'/rest/1.0/film/'+film_id+'/',
			auth: 'test_imdb:test', 
		}, function(status, result) {
			var title = result['title']
			var movie_id = result['id']

			request ( {
				'uri': 'http://api-test.filmaster.tv/rest/1.0/user/picktest/explain/'+movie_id+'/',
				'auth': {
					'user': 'test_imdb',
					'pass': 'test'
				},
				'method': 'GET',
			}, function (error, result, body) {
				console.log(body)

				encoded_title = encodeURIComponent(title + ' trailer');
				console.log('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+encoded_title+'+trailer&key=AIzaSyAbHW3PwwDloBV8nQfX2pWrX-MXaX3sg78')
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
                'image': 'http://icons.iconarchive.com/icons/visualpharm/ios7v2/48/Movie-Genres-Comedy-icon.png'
							})
						});
					});
			});
		});
	}

	console.log('ID: ' +req.query['film_id'])
	if (req.query['film_id']) {
		getClip(req.query['film_id'])
	} else {
		rest.getJSON({
			host: 'api-test.filmaster.tv',
			path: '/rest/1.0/user/picktest/recommendations/',
			auth: 'test_imdb:test', 
		}, function(status, result) {
			var objects = result.objects;
			index = Math.floor(Math.random()*objects.length)
			var movie = objects[index]

			console.log(movie);
			getClip(movie['film_id'])
		})		
	}
}