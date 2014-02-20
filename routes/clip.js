var https = require('https')
var comedy = require('../genres/comedy.json')
var rest = require('../lib/rest.js')

exports.test = function(req, res) {
	index = Math.floor(Math.random()*comedy.length)
	movie = comedy[index];

	rest.getJSON({
		host: 'api-test.filmaster.tv',
		path: '/rest/1.0/user/picktest/recommendations/',
		auth: 'test_imdb:test', 
	}, function(status, result) {
		var objects = result.objects;
		index = Math.floor(Math.random()*objects.length)
		var movie = objects[index]

		console.log(movie);
		rest.getJSON( {
			host: 'api-test.filmaster.tv',
			path:	movie['film_uri'],
			auth: 'test_imdb:test', 
		}, function(status, result) {
			var title = result['title']
			var movie_id = result['id']

			encoded_title = encodeURIComponent(title);
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
							'director': movie['director'],
							'year': movie['year'],
							'youtube_id': id,
							'movie_id': movie_id,
							'image': 'http://icons.iconarchive.com/icons/visualpharm/ios7v2/48/Movie-Genres-Comedy-icon.png'
						})
					});
				});

		});
	})





}