/*
 * Evaluates whether page is a bib page, and if so, displays an "Add to Refworks" image button.
 * This file must be web-accessible; it's accessed from Josiah.
 */

console.log( "josiah_to_refworks_v2.js START" );


var rfwrks = new function() {
  /* Namespaces this file's function calls.
   *
   * See <http://stackoverflow.com/a/881611> for module-pattern reference.
   * Only log_time() and get_bibnum() can be called publicly, and only via, eg, `rfwrks.get_bibnum();`.
   */

  var bibnum = null;
  var refworks_url = null;
  var image_holder = null;

  this.log_time = function() {
    /* Logs timestamp to console.
     * Called by document.ready()
     */
    now = new Date();
    now = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
    console.log( "timestamp, " + now );
  }

  this.get_bibnum = function() {
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

  var find_stub_image = function() {
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

  var add_refworks_image = function() {
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

  var build_refworks_url = function() {
    /* Assembles and stores refworks url.
     * Called by add_refworks_image()
     */
    var root_url = "http://www.refworks.com/express/ExpressImport.asp";
    var params = {
      "vendor": "Marc Format",  // yes, there's a space there
      "url": "http://library.brown.edu/josiah_to_refworks/processor_b.php?id=" + bibnum }
    var encoded_params_list = [];
     for ( var key in params ) {
        encoded_params_list.push( encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) ); }
    encoded_params_string = encoded_params_list.join( "&" );
    refworks_url = root_url + "?" + encoded_params_string;;  // module var
    console.log( "refworks_url, " + refworks_url );
    update_click_url();
  }

  var update_click_url = function( image ) {
    /* Replaces pre-existing image-click url with built refworks url.
     * Called by build_refworks_url()
     */
    console.log( "image.parentElement, " + image_holder.parentElement );
    parent_a_tag = image_holder.parentElement;
    parent_a_tag.href = refworks_url;
    return;  // end of processing
  }

}  // end namespace rfwrks, ```var rfwrks = new function() {```


$(document).ready(
  function() {
  	rfwrks.log_time();
    rfwrks.get_bibnum();
  }
);


console.log( "josiah_to_refworks_v2.js END" );
