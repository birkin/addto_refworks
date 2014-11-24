/*
 * Evaluates whether page is a bib page, and if so, displays an "Add to Refworks" image button.
 * This file must be web-accessible; it's accessed from Josiah.
 */

console.log( "josiah_to_refworks_v2.js START" );


var bibnum = null;
var refworks_url = null;
var image_holder = null;

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
		bibnum = url.substr( start_position, 8 );  // module var
    if ( bibnum == null ) { return };  // possible end of processing
    find_stub_image();
	}
	console.log( "bibnum, " + bibnum );
}

function find_stub_image() {
  /* Searches document's images to find the holder for the RefWorks image.
   * Called by get_bibnum() if a bibnum was found.
   */
	var images = document.images;
	for (var i=0; i < images.length; i++) {
		source_string = images[i].src;
		var find_position = source_string.search( "screens/blank.gif" );
		if ( find_position > 0 ) {
      image_holder = images[i];  // module var
      console.log( "match at, " + image_holder.src );
      add_refworks_image()
		}
	}
}

function add_refworks_image() {
  /* Replaces stub image with 'Add to Refworks' image-button.
   * Called by find_stub_image()
   */
  var new_image = new Image();
  new_image.src = "/screens/btn_refworks.gif";
  image_holder.src=new_image.src;
  image_holder.alt="Add to RefWorks";
  console.log( "image added" );
  build_refworks_url();
}

function build_refworks_url() {
  /* Assembles and stores refworks url.
   * Called by add_refworks_image()
   */
  var root_url = "http://www.refworks.com/express/ExpressImport.asp";
  refworks_url = "http://google.com";  // module var
  console.log( "refworks_url, " + refworks_url );
  update_click_url();
}

function update_click_url( image ) {
  /* Replaces pre-existing image-click url with built refworks url.
   * Called by build_refworks_url()
   */
  console.log( "image.parentElement, " + image_holder.parentElement );
  parent_a_tag = image_holder.parentElement;
  parent_a_tag.href = refworks_url;
  return;  // end of processing
}


console.log( "josiah_to_refworks_v2.js END" );
