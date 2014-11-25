# -*- coding: utf-8 -*-

"""
Routing module.
"""

import datetime, os, pprint
import flask
from addto_refworks.utils import app_helper, log_helper


## setup

app = flask.Flask(__name__)
log = log_helper.setup_logger()
log.debug( u'log initialized at %s' % unicode(datetime.datetime.now()) )
helper = app_helper.Helper( log )


## routes

# @app.route( u'/v2/hello_world/', methods=['GET'] )  # /addto_refworks/v2/hello_world/
# def hello_world():
#     log.debug( u'- in refworks_app.hello_world(); starting' )
#     return_dict = { u'response': u'hi there!' }
#     return flask.jsonify( return_dict )

@app.route( u'/v2/marc/<bib_id>/', methods=['GET'] )  # /addto_refworks/v2/bib/b1234567
def return_marc( bib_id ):
    log.debug( u'- in refworks_app.return_marc(); starting' )
    page_html = helper.grab_html( bib_id )
    marc = helper.extract_marc( page_html )
    return marc




if __name__ == u'__main__':
    if os.getenv( u'DEVBOX' ) == u'true':
        app.run( host=u'0.0.0.0', debug=True )
    else:
        app.run()
