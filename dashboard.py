import os
from flask import Flask, url_for, render_template

app = Flask(__name__)
app.config.from_pyfile('config.py')

@app.route('/')
def dashboard():
    return 'Dashboard'

@app.route('/api/v1/')
def api():
    return 'API'
