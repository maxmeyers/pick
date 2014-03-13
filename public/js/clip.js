'use strict';

var itunesURL = "";

var movielookup = function(results) {
	console.log(results)
	$("#actors").html(results['Actors'])
	$("#year").html(results['Year'])
	$("#director").html(results['Director'])
	$("#genres").html(results['Genre'])

	var title = results['Title'];

	$.get('/itunes?title=' + encodeURIComponent(title)	, function (results) {
		var results = JSON.parse(results)['results'];
		if (results.length) {
			var index = -1;

			for (var i = 0; i < results.length; i++) {
				var result = results[i];
				if (results['trackName'] == title) {
					index = i;
				}
			}

			if (index == -1) {
				index = 0;
			}

			itunesURL = results[index]['trackViewUrl'];
		}
	})
}

$('button.redirect-movie').click(function(event){
	window.location = itunesURL ? itunesURL : "http://www.netflix.com";
});