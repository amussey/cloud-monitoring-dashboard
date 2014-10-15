import os
import json
from flask import Flask, url_for, render_template, request

import config
from utils import crossdomain


app = Flask(__name__)
app.config.from_pyfile('config.py')


@app.route('/')
def dashboard():
    return 'Dashboard'


@app.route('/api/v1/')
@crossdomain(origin='*')
def api():
    return 'API'


@app.route('/api/v1/accounts', methods=['GET', 'POST', 'DELETE'])
@crossdomain(origin='*')
def api_accounts():
    accounts = json.loads(config.REDIS.get('accounts'))
    if request.method == 'DELETE':

        params = request.form.to_dict()
        if not params.get('username') and not params.get('apikey'):
            return json.dumps({'response': 'error', 'message': "No 'username' or 'apikey' fields found."}), 403

        new_accounts = []
        for account in accounts:
            if params.get('username') and params.get('apikey'):
                if account['username'] != params.get('username') or account['apikey'] != params.get('apikey'):
                    new_accounts.append(account)
            else:
                if account['username'] != params.get('username') and account['apikey'] != params.get('apikey'):
                    new_accounts.append(account)
        config.REDIS.set('accounts', json.dumps(new_accounts))
        return json.dumps(new_accounts)
    elif request.method == 'POST':
        # verify that the sent requset has a username and API key
        params = request.form.to_dict()
        if not params.get('username'):
            return json.dumps({'response': 'error', 'message': "Missing 'username' field."}), 403
        if not params.get('apikey'):
            return json.dumps({'response': 'error', 'message': "Missing 'apikey' field."}), 403
        accounts.append({'username': params.get('username'), 'apikey': params.get('apikey')})
        config.REDIS.set('accounts', json.dumps(accounts))

        return json.dumps(accounts)
    return json.dumps(accounts)


@app.errorhandler(405)
def method_not_allowed(e):
    return json.dumps(
        {
            'response': 'error',
            'message': "Method not allowed.",
        }), 405
