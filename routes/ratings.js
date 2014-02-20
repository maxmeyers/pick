var request = require('request')


exports.ratings = function (req, res) {
	request({
		'uri':'http://api-test.filmaster.tv/rest/1.0/user/picktest/ratings/',
		'auth': {
			'user': 'test_imdb',
			'pass': 'test'
		},
	}, function (err, result, body) {
		var ratings = JSON.parse(body)['objects'];
		var ratings_dict = {};

		var count = 0;
		var received = 0;

		// assumes that ratings will arrive most recent first
		for (var i = 0; i < ratings.length; i++) {
			var rating = ratings[i]
			var id = rating['film_id']
			if (!ratings_dict.hasOwnProperty(id)) {
				if (rating['rating']) {
					count = count+1;
					ratings_dict[id] = rating;
				} else {
					ratings_dict[id] = false;
				}
			}
		};

		// res.send(ratings_dict)

		function movieCallback (err, result, body) {
			received = received + 1;
			var movie = JSON.parse(body)
			ratings_dict[movie['id']]['title'] = movie['title']

			if (received == count) {
				var ratings = [];
				for (var id in ratings_dict) {
					var rating = ratings_dict[id];
					if (rating) {
						ratings.push({
							'title': rating['title'],
							'rating': Math.ceil(rating['rating'] / 2.0),
						})						
					}

				}

				res.render('ratings', {
					'ratings':ratings
				});
			}
		}

		for (var film_id in ratings_dict) {
			var rating = ratings_dict[film_id];
			if (rating) {
				console.log(rating)
				request({
					'uri':'http://api-test.filmaster.tv'+rating['film_uri'],
					'auth': {
						'user': 'test_imdb',
						'pass': 'test'
					},
				}, movieCallback);			
			}
		};



	});
}