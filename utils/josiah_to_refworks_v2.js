/*
 * Evaluates whether page is a bib page, and if so, displays an "Add to Refworks" image button.
 * This file must be web-accessible; it's accessed from Josiah.
 */

console.log( "josiah_to_refworks_v2.js START" );


var bibnum = null;

$(document).ready(
  function() {
  	log_time();
    get_bibnum();
  }
);

function log_time() {
  /* Logs timestamp to console.
   * Called by document.ready()
   */
	now = new Date();
  now = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
  console.log( "timestamp, " + now );
}

function get_bibnum() {
	/* Grabs and updates bib number if available; then triggers 'Add to RefWorks' button display.
	 * Called by document.ready()
	 */
	var target_element = document.getElementById( "recordnum" );
	console.log( "target_element, " + target_element );
	if ( target_element != null ) {
		var url = target_element.toString();
		var start_position = url.lastIndexOf( "b" );
		bibnum = url.substr( start_position, 8 );
	}
	console.log( "bibnum, " + bibnum );
	find_stub_image();
}

function find_stub_image() {
  /* Searches document's images to find the holder for the RefWorks image.
   * Called by get_bibnum() when josiah page contains a bibnum.
   */
	if ( bibnum == null ) { return };
	var images = document.images;
	for (var i=0; i < images.length; i++) {
		source_string = images[i].src;
		var find_position = source_string.search( "screens/blank.gif" );
		if ( find_position > 0 ) {
      console.log( "match at, " + images[i].src );
      add_refworks_image( images[i] )
		}
	}
}

function add_refworks_image( image ) {
  /* Replaces stub image with 'Add to Refworks' image-button.
   * Called by find_stub_image()
   */
  var new_image = new Image();
  new_image.src = "/screens/btn_refworks.gif";
  image.src=new_image.src;
  image.alt="Add to RefWorks";
  console.log( "image added" );
  return;
}


console.log( "josiah_to_refworks_v2.js END" );
