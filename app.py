from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import Chatbot
from google import genai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the GenAI client
client = genai.Client(api_key=" ")  # Replace with your valid API key
chatbot = Chatbot(client)

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    try:
        if request.method == 'POST':
            data = request.get_json(silent=True) or {}
            message = data.get('message', '')
        else:
            message = request.args.get('message', '')

        if not message:
            return jsonify({'error': 'Missing "message"'}), 400

        reply = chatbot.handle_message(message)
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
