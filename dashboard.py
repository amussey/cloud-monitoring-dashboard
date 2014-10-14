import os
from flask import Flask, url_for, render_template

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
