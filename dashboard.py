import json
import time
import requests
from threading import Thread
from flask import Flask, render_template, request, redirect, url_for
from flask.ext import htauth

import config
from utils import crossdomain, api as api_helpers


app = Flask(__name__)
app.config.from_pyfile('config.py')
app.thread_count = 0

if config.AUTH_ENABLED:
    app.config['HTAUTH_HTPASSWD_PATH'] = config.HTPASSWD
    app.config['HTAUTH_REALM'] = 'Authentication required.'

    auth = htauth.HTAuth(app)


@app.route('/')
@app.route('/<username>')
@htauth.authenticated
def dashboard(username=None):
    return render_template('dashboard.html', username=username)


@app.route('/settings')
@htauth.authenticated
def settings(username=None):
    return render_template('settings.html', username=username)


@app.route('/<username>/<server_id>')
@htauth.authenticated
def server(username=None, server_id=None):
    if not server_id:
        return dashboard(username=username)
    return render_template('server.html', username=username, server_id=server_id)


@app.route('/api/v1/')
@htauth.authenticated
def api():
    return redirect(url_for('dashboard'))


@app.route('/api/v1/accounts', methods=['GET', 'POST', 'DELETE'])
@crossdomain(origin='*')
@htauth.authenticated
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
        params = request.form.to_dict()
        if not params.get('username'):
            return json.dumps({'response': 'error', 'message': "Missing 'username' field."}), 403
        if not params.get('apikey'):
            return json.dumps({'response': 'error', 'message': "Missing 'apikey' field."}), 403
        info = {
            'username': params.get('username'),
            'apikey': params.get('apikey'),
            'status': {
                'enabled': True,
                'message': 'Enabled'
            }
        }
        if params.get('alias'):
            info['alias'] = params.get('alias')
        accounts.append(info)
        config.REDIS.set('accounts', json.dumps(accounts))

        for account in accounts:
            del account['apikey']

        return json.dumps(accounts)

    for account in accounts:
            del account['apikey']

    return json.dumps(accounts)


@app.route('/api/v1/auth')
@app.route('/api/v1/auth/<username>')
@crossdomain(origin='*')
@htauth.authenticated
def api_auth(username=None):
    accounts = json.loads(config.REDIS.get('accounts'))
    tokens = json.loads(config.REDIS.get('tokens'))

    tokens = api_helpers.expire_tokens(tokens)

    for account in accounts:
        if (not username or account['username'] == username) and not tokens.get(account['username']):
            url = 'https://identity.api.rackspacecloud.com/v2.0/tokens'
            data = json.dumps({
                "auth": {
                    "RAX-KSKEY:apiKeyCredentials": {
                        "username": account['username'],
                        "apiKey": account['apikey']
                    }
                }
            })
            headers = {'content-type': 'application/json'}
            response = requests.post(url, headers=headers, data=data)
            if response.status_code == 200:
                response_json = response.json()

                tokens[account['username']] = {
                    'token': response_json['access']['token']['id'],
                    'tenant': response_json['access']['token']['tenant']['id'],
                    'expire': int(time.time() + (23 * 60 * 60))
                }
            else:
                account["status"] = {
                    'enabled': False,
                    'message': 'Error authenticating: {}'.format(response.text)
                }
                del tokens[account['username']]

    config.REDIS.set('tokens', json.dumps(tokens))
    config.REDIS.set('accounts', json.dumps(accounts))

    return json.dumps({'response': 'success', 'message': 'Auth information updated from identity.'})


@app.route('/api/v1/monitors')
@app.route('/api/v1/monitors/<username>')
@crossdomain(origin='*')
@htauth.authenticated
def api_monitors(username=None):
    params = request.args.to_dict()

    accounts = json.loads(config.REDIS.get('accounts'))
    tokens = json.loads(config.REDIS.get('tokens'))
    monitors = json.loads(config.REDIS.get('monitors'))

    api_auth(username)

    if 'fast' in params:
        # Fire the updater in a background thread.
        for account in accounts:
            current_user = account['username']
            if tokens.get(current_user) and (not username or current_user == username):
                if monitors[current_user].get('last_update', 0) + 59 < int(time.time()):
                    t = Thread(target=api_helpers.update_monitoring_data, args=(current_user,))
                    t.start()
    else:
        api_helpers.update_monitoring_data(username)

    if 'small' in params:
        return json.dumps(api_helpers.small_monitoring_response(monitors, username))

    if username:
        for key in monitors.keys():
            if key != username:
                del monitors[key]

    return json.dumps(monitors)


@app.route('/api/v1/monitors/<username>/<server_id>')
@crossdomain(origin='*')
@htauth.authenticated
def api_server(username=None, server_id=None):
    if not server_id:
        return api_monitors(username=username)

    monitors = json.loads(config.REDIS.get('monitors'))

    if username not in monitors:
        return json.dumps({'response': 'error', 'message': "User with this username not found."}), 403

    for monitor in monitors[username]['values']:
        if monitor['entity']['id'] == server_id:
            return json.dumps({
                'response': 'success',
                'message': 'Server information retrieved successfully.',
                'data': monitor
            })

    return json.dumps({'response': 'error', 'message': "Server with 'server_id' not found."}), 403


@app.route('/api/v1/filters', methods=['GET', 'POST', 'DELETE'])
@crossdomain(origin='*')
@htauth.authenticated
def api_filters():
    filters = json.loads(config.REDIS.get('filters'))
    if request.method == 'GET':
        return json.dumps({
            'response': 'success',
            'message': 'Filters retrieved successfully.',
            'data': filters
        })
    elif request.method == 'POST':
        params = request.form.to_dict()
        if not params.get('filter'):
            return json.dumps({'response': 'error', 'message': "Unable to add new filter.  Missing 'filter' field in request POST."}), 403

        if params.get('filter') not in filters:
            filters.append(params.get('filter'))
            config.REDIS.set('filters', json.dumps(filters))

        return json.dumps({
            'response': 'success',
            'message': 'Filters stored successfully.',
            'data': filters
        })
    else:
        params = request.form.to_dict()
        if not params.get('filter'):
            return json.dumps({'response': 'error', 'message': "Unable to add new filter.  Missing 'filter' field in request POST."}), 403

        if params.get('filter') in filters:
            filters.remove(params.get('filter'))
            config.REDIS.set('filters', json.dumps(filters))

        return json.dumps({
            'response': 'success',
            'message': 'Filters removed successfully.',
            'data': filters
        })


@app.errorhandler(405)
@htauth.authenticated
def method_not_allowed(e):
    return json.dumps(
        {
            'response': 'error',
            'message': "Method not allowed.",
        }), 405
