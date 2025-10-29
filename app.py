import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import Chatbot
from google import genai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# No global client: we create a client per request using the provided API key

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    try:
        if request.method == 'POST':
            data = request.get_json(silent=True) or {}
            message = data.get('message', '') or data.get('prompt') or data.get('query') or data.get('text') or data.get('input') or ''
            provided_key = data.get('apiKey')
        else:
            message = request.args.get('message', '')
            provided_key = request.args.get('apiKey')

        if not message:
            return jsonify({'error': 'Missing "message"'}), 400

        # Resolve API key: header > bearer > body/query > env var
        auth_header = request.headers.get('Authorization', '')
        bearer = None
        if auth_header.lower().startswith('bearer '):
            bearer = auth_header.split(' ', 1)[1].strip()
        api_key = (
            request.headers.get('X-API-Key')
            or bearer
            or provided_key
            or os.getenv('GOOGLE_API_KEY')
            or os.getenv('GENAI_API_KEY')
        )
        if not api_key:
            return jsonify({'error': 'Missing API key. Provide via X-API-Key header, Authorization: Bearer, apiKey field, or GOOGLE_API_KEY env var.'}), 401

        client = genai.Client(api_key=api_key)
        bot = Chatbot(client)
        reply = bot.handle_message(message)
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
