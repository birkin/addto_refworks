## documentation

---

#### on this page...

* [intro](#intro)
* [flow](#flow)
* [opac/catalog javascript](#opac_cat_js)
* [python code](#python_code)
* [acknowledgements](#acknowledgements)
* [contact information](#contact_info)

---

#### intro...

This page documents the Brown Library's work enabling a user of our [III-vendor](http://www.iii.com) library OPAC ("[Classic Josiah](http://josiah.brown.ed)") to add a citation to [RefWork](http://refworks.com).

(Note: our main catalog is now outside the web-opac display, but these instructions are III specific.)

This implementation uses javascript and python.

---


#### flow...

- User's view...
    - user clicks on 'Add To RefWorks' button on catalog bib-item page
    - a RefWorks window appears, the user logs in if necessary, and the citation is added

- Behind the scenes...
    - before the user-click (when the catalog page is loaded), javascript:
        - grabs the bib number
        - creates a url to refworks, like [this](http://www.refworks.com/express/ExpressImport.asp?vendor=Marc%20Format&url=http%3A%2F%2Flibrary.brown.edu%2Faddto_refworks%2Fv2%2Fmarc%2Fb4069600%2F) which includes the bib-number
            - this url is to a refworks ingestion url; it includes, as a parameter, a data-source url
        - attaches that url to an 'Add To RefWorks' image-button
    - on the 'Add To RefWorks' user-click, the user's browser hits the refworks url
    - before the refworks window opens, refworks tries to get the data to be ingested from the data-source url-parameter. [Here](http://library.brown.edu/addto_refworks/v2/marc/b4069600/) is an example of the url that refworks follows to get the item data. Note that unlike the url _to_ refworks, refworks doesn't care at all about the data-source url -- it just wants to follow it and get data back in a specific format.
    - that data-source url goes, as shown above, to a library.brown.edu web-service, which is now written in python but could be written in anything
    - the web-service sees the bib-number, and accesses the 'coded-display' opac page ([example](http://josiah.brown.edu/search~S7?/.b4069600/.b4069600/1%2C1%2C1%2CB/marc~b4069600)), which contains the marc data, embedded in cruft
    - the web-service extracts the marc-data from the html, and sends the clean marc data back to refworks -- so from refworks' point of view, the data-source url simply returns good marc data, which refworks ingests
    - refworks brings up it's user interface, and shows the data it just ingested, giving the user the opportunity to edit it

---


#### <a id="opac_cat_js"></a>opac/catalog javascript

The refworks javascript in the bib-item page does three different things, as noted above:
- it grabs the bib number
- it creates the full url to refworks
- it makes the 'Add To RefWorks' button appear on the bib-item page (as opposed to pages with multiple items), with the refworks url attached

Regarding the RefWorks button, our implementation currently requires that the button image be displayed even on pages which display multiple items (we have to use the `EBADDRESS` field). Since the code is designed only to work with individual items, we 'hide' the default 'Add To RefWorks' button by making it a 1-pixel transparent button image. When the user accesses a page which only displays a single item, some JavaScript replaces the 1-pixel button image with the correct 'Add To RefWorks' button image. Sites that are able to tie the 'Add To RefWorks' button to the `WEBADDRESS` field may not require this part of the javascript code.

###### opac/catalog details

The III catalog requires that javascript and html code go in specific fields accessible via the Millennium Client in Administrator mode. Where code should go in order to appear in the desired page is not always... easily discernable.

Some pieces that need to be set...
- the main javascript code
- the code that specifies the 'recordnum' id
- the code that references blank.gif
- the code that references refworks.gif

Detailed information on each of these six pieces follows. The information below is presented from the perspective: "Where should code be entered into the OPAC (and what exactly should be entered) in order to get the final html-output that works?"

###### Piece: main javascript code

- the code itself can be found in this repo, specifcally, [here](https://github.com/birkin/addto_refworks/blob/master/utils/josiah_to_refworks_v2.js) -- this will at some point be moved to the main [Brown Library github repo](https://github.com/Brown-University-Library)

- the code referencing the main JavaScript...

        <!-- JavaScript for RefWorks. -->
        <script language="javascript" src="https://library.brown.edu/path/to/josiah_to_refworks_v2.js" type="text/javascript"></script>

- this code is entered via the Millennium client via `Administration \-> Web Master`, and selecting the appropriate file in the list. To know which file it is that requires editing, view the entry in `Administration \-> Web Options \-> General Display and Behavior \-> TOPLOGO`. The file named there is the file that should be edited in the `Web Master` list. _(actually, we now have it in the footer -- Bonnie, what's the footer file called?)_

- this footer appears on all single-list and multiple-list pages.

###### Piece: 'id=recordnum' reference

- this reference appears in the source code as:

        <div class="bibRecordLink"><a id="recordnum" href="http://library.brown.edu/record=b1442736">Permanent link to this record</a></div>

- this is set via the Millennium Client via `Admin \-> Web Options \-> Record Displays`, in the `ICON_RECORDLINK` field.

- the code that goes in this field is:

        <div class="bibRecordLink"><a id="recordnum" href="%s">Permanent Link to this Record</a></div>

- this _only_ appears in the single-list view. The javascript which displays the 'Add To RefWorks' button looks for this id to determine if the button should be displayed.

###### Piece: 'blank.gif' reference

- the blank.gif is referenced in the code as (full html line not shown):

        <code html><img src="/screens/blank.gif" alt="Encyclopedia" border="0" /></code>

- the code is set from the Millennium client via `Administration \-> Web Options \-> Content Linking and Other Resources` and editing the `BUT_ENCYCPD` field. Our code in this field:

        /screens/blank.gif

- the actual image file can be accessed from the Millennium client via `Administration \-> Web Master`, and selecting the `blank.gif` item in the list

- note that Ryerson University specified the creation of a transparent gif the same size as the RefWorks gif, different from our 1-pixel transparent gif

###### Piece: 'refworks.gif' button reference

- the `btn_refworks.gif` image-reference 'Add To RefWorks' button is in our josiah_to_refworks_v2.js file [here](https://github.com/birkin/addto_refworks/blob/f55b00da997f3972bdce3f19ed296376db994383/utils/josiah_to_refworks_v2.js#L66)

- The `btn_refworks.gif` file does not need to be referenced in any Millennium Client `Web Options` field; if desired, it can be accessed via the Millennium Client via `Administration \-> Web Master`, and selecting the gif in the list.

---

#### <a id="python_code"></a>python code

The python webservice that refworks hits is written in Flask, a lightweight framework.

The webservice part of the code is [here](https://github.com/birkin/addto_refworks/blob/f55b00da997f3972bdce3f19ed296376db994383/refworks_app.py#L28) -- it calls [helper](https://github.com/birkin/addto_refworks/blob/f55b00da997f3972bdce3f19ed296376db994383/utils/app_helper.py) code that hits the correct opac coded-display page, and parses the marc data out of the html.

---

#### Acknowledgements

- Jean Rainwater, Head, Integrated Technology Services, Brown University for making this a department goal

- Bonnie Buzzell, Senior Knowledge Systems Librarian, Integrated Technology Services, Brown University, for wonderful knowledge of the III OPAC innards

- [RefWorks](http://refworks.com)
    - for embracing so many standards, and in particular for their MARC import filter, obviating the need for many, many lines of code translating MARC data into RefWorks Tagged Format
    - for RefWorks document: `Linking an Innovative Web OPAC to RefWorks (via Direct Export) (2005)`

- Others
    - [Ryerson University Library](http://innopac.lib.ryerson.ca/), for documenting their javascript and ColdFusion implementation in the above document. Though our architecture is different from Ryerson University's ColdFusion implementation, their logic was useful to start from, and we initially used their javascript nearly untouched.
    - Bob Duncan, Lafayette College, and Hong Zhang, UNLV, for [notes](Refworks on Release 2007) regarding Millennium Release 2007.

---

#### <a id="contact_info"></a>contact information

- [Birkin James Diana](mailto:birkin_diana@brown.edu), Digital Library Programmer, Integrated Technology Services Department, Brown University Library

- [Bonnie Buzzell](mailto:bonnie_buzzell@brown.edu), Senior Knowledge Systems Librarian, Integrated Technology Services Department, Brown University Library

---

---
