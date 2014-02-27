var genres = require('./genres.json')
var models = require('./models')

exports.genreString = function(array) {
	var string = "";
	for (var i = 0; i < array.length; i++) {
		genre = array[i];
		string += genres[genre]['name']
		if (i < array.length - 1) {
			string += ", "
		}
	}
	return string;
}

exports.namesForKeys = function(keyArray) {
	var names = []
	for (var i = 0; i < keyArray.length; i++) {
		names.push(nameForKey(keyArray[i]))
	}
	return names;
}

var nameForKey = function(key) {
	if (genres[key]) {
		return genres[key]['name'];
	}
	return '';
}

var keyForName = function(genreName) {
	for (var key in genres) {
		if (genres[key]['name'] == genreName) {
			return key;
		}
	}
}

exports.getCurrentUser = function(req, callback) {
	models.User.findById(req.session['uid']).exec(function(error, u) {
		callback(u);
	});
}

exports.arrayify = function(mongooseArray) {
	var arr = [];
	for (var i = 0; i < mongooseArray.length; i++) {
		arr.push(mongooseArray[i])
	}
	return arr;
}