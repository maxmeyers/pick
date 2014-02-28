var models = require('../models')
var request = require('request')

exports.register = function (req, res) {
	res.render('register', {
		'title': 'Register for Pick'
	})
}

exports.doRegister = function (req, res) {

	console.log(req.body)
	var username = req.body['username']	
	var password = req.body['password']
	var password2 = req.body['password-confirm']

	if (password != password2) {
		res.render('register', {
			'error':'Passwords do not match.'
		})
	} else {
		models.User.find({'username':username}).exec(function(err, results) {
			if (results.length) {
				console.log(results)
				res.render('register', {
					'error': "Username taken."
				})
			} else {
				var user = new models.User({
					'username':username,
					'password':password,
					'genres':[]
				})
				user.save(function(error) {
					if (error) {
						res.render('register', {
							'error':"Internal Error. Try again"
						})
					} else {
						console.log("new user id: " + user.id)
						req.session['uid'] = user.id;

						request ( {
							'uri': 'http://api-test.filmaster.tv/rest/1.0/user/',
							'auth': {
								'user': 'test_imdb',
								'pass': 'test'
							},
							'form' : {
								'id':user.id
							},
							'method': 'POST',
						}, function (error, result, body) {
							console.log("filmaster result")
							console.log(result)
							console.log(body)
							res.redirect('/clip')
						})
					}
				})
			}
		});
	}
}