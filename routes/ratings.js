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
				var movie_id = result.request.uri.href.split('/tt')[1].split('?')[0]
				var movie = JSON.parse(body)['movie_results'][0]

				if (!movie) {
					movie = JSON.parse(body)['tv_results'][0]
				}
				ratings_dict[movie_id]['title'] = movie['title']
				ratings_dict[movie_id]['img_url'] = 'http://image.tmdb.org/t/p/original'+movie['poster_path']
				ratings_dict[movie_id]['imdb_rating'] = movie['vote_average']

				if (received == count) {
					var ratings = [];
					for (var id in ratings_dict) {
						var rating = ratings_dict[id];
						if (rating) {
							ratings.push(rating)						
						}

					}

					ratings = ratings.sort(function(a,b) {
						if (a.title > b.title) {
							return 1;
						} else if (a.title < b.title) {
							return -1;
						}
						return 0;
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
					request({
						// 'uri':'http://omdbapi.com/?i=tt'+film_id,
						'uri':'http://api.themoviedb.org/3/find/tt'+film_id+'?api_key=2a6cef5c6e0babed20a40c35e56881cd&external_source=imdb_id',
					}, movieCallback);			
				}
			};
		});
	});
}