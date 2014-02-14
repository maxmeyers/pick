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

	$('button.get-started').click(function(event) {
		document.location = "/start";
	});

	$('button.done-watching').click(function(event) {
		var movie_id = $('#movie_id').attr("value");
		document.location = "/rate?movie_id="+movie_id+"&rating="+event.target.id;
	});

}

