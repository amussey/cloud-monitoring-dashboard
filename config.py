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
