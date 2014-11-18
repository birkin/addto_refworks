# -*- coding: utf-8 -*-

"""
Helper for refworks_app.py
"""

import datetime, os
import requests
from bs4 import BeautifulSoup
from werkzeug.contrib.cache import FileSystemCache


class Helper( object ):
    """ Helper functions. """

    def __init__( self, log ):
        self.log = log
        self.cache_dir = os.getenv( 'addto_refworks__CACHE_DIR' )
        self.cache_hours = int( os.getenv('addto_refworks__CACHE_HOURS') ) * 60 * 60  # timeout param requires seconds

    def grab_html( self, bib_id ):
        """ Grabs html of marc page. """
        url = 'http://josiah.brown.edu:80/search/.%s/.%s/1,1,1,B/marc~%s' % ( bib_id, bib_id, bib_id )
        r = requests.get( url )
        html = r.content.decode( 'utf-8' )
        self.log.debug( u'in app_helper.Helper.grab_html(); html, ```%s```' % html )
        return html

    def extract_marc( self, html ):
        """ Extracts marc. """
        assert type(html) == unicode
        start_tag = u'<pre>'
        end_tag = u'</pre>'
        start_position = html.find( start_tag ) + len(start_tag)
        end_position = html.find( end_tag )
        marc_data = html[ start_position:end_position ]
        self.log.debug( u'in app_helper.Helper.extract_marc(); marc_data, `%s`' % marc_data )
        return marc_data
        # # utf8_html = html.encode( 'utf-8' )
        # soup = BeautifulSoup( html, 'html5lib' )
        # pre_tag = soup.find_all( 'div' )
        # self.log.debug( u'in app_helper.Helper.extract_marc(); type(pre_tag), `%s`' % type(pre_tag) )
        # self.log.debug( u'in app_helper.Helper.extract_marc(); pre_tag, `%s`' % unicode(repr(pre_tag)) )

    # end class Helper()
