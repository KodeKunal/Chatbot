from google import genai

client = genai.Client(api_key="AIzaSyDpMSF03_r5XoY5grVkS_W4fRfKgLt9kOc")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain how AI works",
)

print(response.text)
