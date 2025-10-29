from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import Chatbot
from google import genai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the GenAI client
client = genai.Client(api_key="AIzaSyDpMSF03_r5XoY5grVkS_W4fRfKgLt9kOc")  # Replace with your valid API key
chatbot = Chatbot(client)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '')
    reply = chatbot.handle_message(message)
    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(port=3000, debug=True)
