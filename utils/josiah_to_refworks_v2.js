// this file must be web-accessible.

console.log( "josiah_to_refworks_v2.js START" );


var bibnum = null;

$(document).ready(
  function() {
    get_bibnum();
  }
);

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
	display_button()
}

function display_button() {
	console.log( "display_button() start" );
	console.log( "display_button() bibnum, " + bibnum );
	if ( bibnum == null ) {
		return
	}
	console.log( "display_button() not returning" );
	var newImg = new Image();
	newImg.src = '/screens/btn_refworks.gif';
	for (var m=0; m < document.images.length; m++) {

		if (	(document.images[m].src == "http://128.148.19.6/screens/blank.gif") ||
					(document.images[m].src == "http://carberry.brown.edu/screens/blank.gif") ||
					(document.images[m].src == "http://josiah.brown.edu/screens/blank.gif") ||
					(document.images[m].src == "https://128.148.19.6/screens/blank.gif") ||
					(document.images[m].src == "https://carberry.brown.edu/screens/blank.gif") ||
					(document.images[m].src == "https://josiah.brown.edu/screens/blank.gif") ||
					(document.images[m].src == "http://josiah.brown.edu:2082/screens/blank.gif")
					) {
						console.log( "display_button() condition is true" );
						document.images[m].src=newImg.src;
						document.images[m].alt="Add to RefWorks";
						}
	}
	console.log( "display_button() end" );
}


console.log( "josiah_to_refworks_v2.js END" );


// var bibno

// function open_refworks_win(url){
// 	url=url.replace('recordnum','recordnum='+bibno);
// 	new_refworks_win=window.open(url,"RefWorksMain",'toolbar=1,location=1,directories=0,status=1,menubar=1,scrollbars=1,resizable=1,width=800,height=500');
// 	new_refworks_win.focus();
// 	}

// function get_recordnum() {
// 	var aTags = document.getElementsByTagName("a");
// 	var aTagsLen = aTags.length;
// 	for (var i=0; i < aTags.length; i++) {
// 		if (aTags[i].id == "recordnum") {
// 			bibno = aTags[i];
// 			bibno = bibno.toString();
// 			var start = bibno.lastIndexOf('b');
// 			bibno = bibno.substr(start,8);
// 			var newImg = new Image();
//   			newImg.src = '/screens/btn_refworks.gif';
// 			for (var m=0; m < document.images.length; m++) {
// 				if (
// 				    (document.images[m].src == "http://128.148.19.6/screens/blank.gif") ||
// 				    (document.images[m].src == "http://carberry.brown.edu/screens/blank.gif") ||
// 				    (document.images[m].src == "http://josiah.brown.edu/screens/blank.gif") ||
// 				    (document.images[m].src == "https://128.148.19.6/screens/blank.gif") ||
// 				    (document.images[m].src == "https://carberry.brown.edu/screens/blank.gif") ||
// 				    (document.images[m].src == "https://josiah.brown.edu/screens/blank.gif") ||
// 				    (document.images[m].src == "http://josiah.brown.edu:2082/screens/blank.gif")
// 				    ) {
// 					document.images[m].src=newImg.src;
// 					document.images[m].alt="Add to RefWorks";
// 				} // end if
// 			} // end for
// 		} // end if
// 	} // end for
// } // end function

// end javascript code
