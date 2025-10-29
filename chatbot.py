import requests

class Chatbot:
    def __init__(self, genai_client):
        self.genai_client = genai_client

    def handle_message(self, message):
        if message.lower() == 'what is angle':
            return 'An angle is a measure of the turn or rotation between two straight lines that have a common end point (the vertex).'
        else:
            try:
                response = self.genai_client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=f"Provide a concise response under 200 words: {message}"
                )
                return ' '.join(response.text.split()[:200])  # Limit to 200 words
            except Exception as e:
                return f"Error: {str(e)}"
