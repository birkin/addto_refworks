# -*- coding: utf-8 -*-

""" Prepares application environment.
    Variables assume project setup like:
    some_enclosing_directory/
        addto_refworks/
            config/
            refworks_app.py
        env_rfwrks/
     """

import os, pprint, sys


## become self-aware, padawan
current_directory = os.path.dirname( os.path.abspath(__file__) )

## vars
ACTIVATE_FILE = os.path.abspath( u'%s/../../env_rfwrks/bin/activate_this.py' % current_directory )
PROJECT_DIR = os.path.abspath( u'%s/../../addto_refworks' % current_directory )
PROJECT_ENCLOSING_DIR = os.path.abspath( u'%s/../..' % current_directory )
SITE_PACKAGES_DIR = os.path.abspath( u'%s/../../env_rfwrks/lib/python2.6/site-packages' % current_directory )

## virtualenv
execfile( ACTIVATE_FILE, dict(__file__=ACTIVATE_FILE) )  # file loads environmental variables

## sys.path additions
for entry in [PROJECT_DIR, PROJECT_ENCLOSING_DIR, SITE_PACKAGES_DIR]:
 if entry not in sys.path:
   sys.path.append( entry )

from addto_refworks.refworks_app import app as application
