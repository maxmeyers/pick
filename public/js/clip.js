'use strict';

var movielookup = function(results) {
	console.log(results)
	$("#actors").html(results['Actors'])
	$("#year").html(results['Year'])
	$("#director").html(results['Director'])
	$("#genres").html(results['Genre'])
}
