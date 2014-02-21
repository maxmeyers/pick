var starters = require('../starters.json')

exports.start = function (req, res) {
	if (!req.session['uid']) {
		res.redirect('/login?redirect=\/start');
		return;
	}

	res.render('start', {})
}

exports.doStart = function (req, res) {
	var genre = req.body['genre']
	var starterID = starters[genre];
	res.redirect('/clip?film_id='+starterID);
}