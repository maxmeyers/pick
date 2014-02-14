var https = require('https')
var comedy = require('../genres/comedy.json')

exports.test = function(req, res) {
	index = Math.floor(Math.random()*comedy.length)
	movie = comedy[index];

	encoded_title = encodeURIComponent(movie['title']);
	https.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+encoded_title+'+trailer&key=AIzaSyAbHW3PwwDloBV8nQfX2pWrX-MXaX3sg78',
		function(response) {
			var output = '';
			response.on('data', function(chunk) {
				// console.log(body)
				output += chunk;
			})

			response.on('end', function() {
				var obj = JSON.parse(output);

				var id = obj.items[0]['id']['videoId'];
				console.log(id)

				res.render('clip', {
					'title': movie['title'],
					'director': movie['director'],
					'year': movie['year'],
					'youtube_id': id,
				})
			});
		});


}