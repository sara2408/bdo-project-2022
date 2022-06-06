from flask import Flask, jsonify
from Sara import search

app = Flask(__name__)


@app.route("/search/<query_str>")
def handle_search(query_str):
    MIN_KEYWORDS = 2
    if len(query_str.split()) < MIN_KEYWORDS:
        return {'message': f'Please enter at least {MIN_KEYWORDS} keywords.'}, 400

    results = search(query_str)
    response = jsonify(results)
    return response
