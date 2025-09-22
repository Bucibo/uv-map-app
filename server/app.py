from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os
from flask_cors import CORS

load_dotenv()

API_KEY = os.getenv("OPENUV_API_KEY")
PORT = int(os.getenv("PORT", 5000))

app = Flask(__name__)
CORS(app)

@app.route("/uv")
def get_uv():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    if not lat or not lng:
        return jsonify({"error": "Missing lat/lng"}), 400

    try:
        response = requests.get(
            f"https://api.openuv.io/api/v1/uv?lat={lat}&lng={lng}",
            headers={"x-access-token": API_KEY}
        )
        data = response.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Failed to fetch UV data", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(port=PORT)
