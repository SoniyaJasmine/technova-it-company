import socket

# Force Python network connections to use IPv4
original_getaddrinfo = socket.getaddrinfo

def ipv4_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    return original_getaddrinfo(
        host, port, socket.AF_INET, type, proto, flags
    )

socket.getaddrinfo = ipv4_getaddrinfo

from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("API key not found!")
    exit()

print("Connecting to Gemini using IPv4...", flush=True)

client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(timeout=30000)
)

try:
    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
        contents="Reply with only the word Hello."
    )

    print("Gemini response:", response.text)

except Exception as e:
    print("ERROR:", repr(e))