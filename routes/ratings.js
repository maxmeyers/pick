var request = require('request')
var util = require('../util')

exports.ratings = function (req, res) {
	if (!req.session['uid']) {
		res.redirect('/login?redirect=\/ratings');
		return;
	}

	util.getCurrentUser(req, function(user) {
		request({
			'uri':'http://api-test.filmaster.tv/rest/1.0/user/'+req.session['uid']+'/ratings/',
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
				if (id != 'undefined') {
					if (!ratings_dict.hasOwnProperty(id)) {
						if (rating['rating']) {
							count = count+1;
							ratings_dict[id] = rating;
							rating['rating'] = Math.ceil(rating['rating'] / 2.0)
						} else {
							ratings_dict[id] = false;
						}
					}
				}
			}

			if (!count) {
				res.render('ratings', {
					'ratings':true,
					'title': 'Ratings',
					'username': user.username
				});
				return;
			}

			function movieCallback (err, result, body) {
				received = received + 1;
				var movie_id = result.request.uri.href.split('=tt')[1]
				var movie = JSON.parse(body)
				console.log(movie_id)
				ratings_dict[movie_id]['title'] = movie['Title']

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
						'film_ratings':ratings,
						'helpers': {
							'star': function(numstars, id) {
								var str = '';
								for (var i = 0; i < numstars; i++) {
									if (numstars == ratings_dict[id]['rating']) {
										str += '★'
									} else {
										str += '☆'
									}
								}
								return str
							}
						},
						'ratings':true,
						'title': 'Ratings',
						'username': user.username
					});
				}
			}

			for (var film_id in ratings_dict) {
				var rating = ratings_dict[film_id];
				if (rating) {
					console.log("film_id " + film_id)
					request({
						'uri':'http://omdbapi.com/?i=tt'+film_id,
					}, movieCallback);			
				}
			};
		});
	});
}