import os
import urlparse
import redis
import json

DEBUG = True


url = urlparse.urlparse(os.environ.get('REDISCLOUD_URL'))
REDIS = redis.Redis(host=url.hostname, port=url.port, password=url.password)

# Configure some redis defaults
if not REDIS.get('accounts'):
    REDIS.set('accounts', json.dumps([]))

if not REDIS.get('tokens'):
    REDIS.set('tokens', json.dumps({}))

if not REDIS.get('monitors'):
    REDIS.set('monitors', json.dumps({}))

if not REDIS.get('filters'):
    REDIS.set('filters', json.dumps([]))

monitoring_api_url = 'https://monitoring.api.rackspacecloud.com/v1.0/{tenant}/views/overview'

if os.environ.get('HTPASSWD'):
    AUTH_ENABLED = True
    HTAUTH_REALM = 'Authentication required'
    HTAUTH_HTPASSWD_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)), os.environ.get('HTPASSWD'))
else:
    AUTH_ENABLED = False
