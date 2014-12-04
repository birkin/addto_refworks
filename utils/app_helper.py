# -*- coding: utf-8 -*-

"""
Helper for refworks_app.py
"""

import datetime, os
import requests
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

    def check_cache( self, bib_id ):
        """ Checks cache for marc. """
        cache = FileSystemCache( self.cache_dir, threshold=500, default_timeout=self.cache_hours, mode=0664 )  # http://werkzeug.pocoo.org/docs/0.9/contrib/cache/
        cache_key = bib_id
        marc = cache.get( cache_key )
        if marc == None:
            self.log.debug( u'in app_helper.Helper.check_cache(); marc not found in cache' )
        else:
            self.log.debug( u'in app_helper.Helper.check_cache(); marc found in cache' )
        return ( marc, cache )

    # end class Helper()
