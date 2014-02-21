'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	console.log("Javascript connected!");

	$('button.login').click(function(event) {
		document.location = "/login";
	});

	$('button.register').click(function(event) {
		document.location = "/register";
	})

	$('button.done-watching').click(function(event) {
		var movie_id = $('#movie_id').attr("value");
		document.location = "/rate?movie_id="+movie_id+"&rating="+event.target.id;
	});

	$('button.see-ratings').click(function(event) {
		document.location = "/ratings"
	});

	$('button.redirect-movie').click(function(event){
		window.location = "http://www.netflix.com/";
	});

	$('button.re-rate').click(function(event) {
		var button_id = event.target.id;
		var rating = button_id.split('.')[0];
		var movie_id = button_id.split('.')[1];

		document.location = "/rate?movie_id="+movie_id+"&rating="+rating+"&redirect=\/ratings"
	});

	$('button.logout').click(function(event) {
		window.location = "/logout"
	})
}

