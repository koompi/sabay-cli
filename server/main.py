# main.py
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import pymongo
from datetime import datetime, timedelta
from utils.getAuth import get_auth_token
from utils.updateStack import update_stack
from utils.listServices import get_services
from utils.listStack import list_stacks
import requests

# Load environment variables from .env file
load_dotenv()

# Retrieve credentials from environment variables
DB_URI = os.getenv('DB_URI')
USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client
client = pymongo.MongoClient(DB_URI)
db = client['sabay']  # Use the 'sabay' database
collection = db['authtoken']  # Use the 'authtoken' collection

def get_existing_token():
    """Retrieve the existing token and its timestamp from MongoDB."""
    doc = collection.find_one({"_id": "latest"})
    if doc:
        return doc.get("token"), doc.get("timestamp")
    return None, None

def save_token(token):
    """Save the new token and current timestamp to MongoDB."""
    collection.update_one(
        {"_id": "latest"},  # Use a constant ID to update the latest token
        {"$set": {"token": token, "timestamp": datetime.utcnow()}},
        upsert=True  # Create the document if it doesn't exist
    )

def fetch_auth_token():
    """Fetch a new token from the external service."""
    try:
        token, timestamp = get_existing_token()
        if token and timestamp:
            if datetime.utcnow() - timestamp < timedelta(hours=1):
                return token
        # Token is either not present or expired, get a new one
        token = get_auth_token(USERNAME, PASSWORD)
        if token:
            save_token(token)
            return token
        else:
            return None
    except Exception as e:
        raise Exception(f"Failed to fetch token: {str(e)}")

@app.route('/api/getAuth', methods=['GET'])
def get_token():
    try:
        token = fetch_auth_token()
        if token:
            return jsonify({'token': token})
        else:
            return jsonify({'error': 'Failed to obtain new token'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/updateStack', methods=['POST'])
def update_stack_route():
    try:
        token = fetch_auth_token()
        if token:
            return update_stack(token)
        else:
            return jsonify({'error': 'Failed to obtain new token'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/listStack', methods=['GET'])
def list_stack_route():
    try:
        token = fetch_auth_token()
        if token:
            return jsonify(list_stacks(token))
        else:
            return jsonify({'error': 'Failed to obtain new token'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/listservices', methods=['POST'])
def list_services():
    data = request.json
    stack_id = data.get('stackId')
    subscription_id = data.get('subscriptionId')
    
    if not stack_id or not subscription_id:
        return jsonify({"error": "Missing stackId or subscriptionId"}), 400

    try:
        token = fetch_auth_token()
        services = get_services(stack_id, subscription_id, token)
        return jsonify(services)
    except requests.HTTPError as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/testMongo', methods=['GET'])
def test_mongo():
    try:
        collections = db.list_collection_names()
        return jsonify({'collections': collections})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8084)
