from flask import Flask, jsonify
from Sara import search

app = Flask(__name__)

@app.route("/search/<query_str>")
def handle_search(query_str):
    companies = search(query_str)
    response = jsonify(companies)
    return response
