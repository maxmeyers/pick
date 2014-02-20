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
					rating['rating'] = Math.ceil(rating['rating'] / 2.0)
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
							'rating': rating['rating'],
							'film_id': rating['film_id']
						})						
					}

				}

				ratings.sort(function(a,b) {
					return a.title > (b.title);
				});

				res.render('ratings', {
					'ratings':ratings,
					'helpers': {
						'star': function(numstars, id) {
							var str = '';
							console.log(numstars)
							for (var i = 0; i < numstars; i++) {
								if (numstars == ratings_dict[id]['rating']) {
									str += '★'
								} else {
									str += '☆'
								}
							}
							return str
						}
					}
				});
			}
		}

		for (var film_id in ratings_dict) {
			var rating = ratings_dict[film_id];
			if (rating) {
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