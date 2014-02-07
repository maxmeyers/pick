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
		document.location = "/rate?movie=juno";
	});
}