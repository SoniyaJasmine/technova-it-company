import importlib.util
import os
from pathlib import Path
import subprocess
import sys


def missing_backend_modules():
    modules = ("flask", "flask_cors", "google.genai", "dotenv")
    missing = []

    for module in modules:
        try:
            if importlib.util.find_spec(module) is None:
                missing.append(module)
        except ModuleNotFoundError:
            missing.append(module)

    return missing


missing_modules = missing_backend_modules()
if missing_modules:
    backend_dir = Path(__file__).resolve().parent
    venv_python = backend_dir / "venv" / "Scripts" / "python.exe"
    dependency_check = (
        "import flask, flask_cors; from google import genai; from dotenv import load_dotenv"
    )

    if (
        venv_python.is_file()
        and venv_python.resolve() != Path(sys.executable).resolve()
        and subprocess.run(
            [str(venv_python), "-c", dependency_check],
            capture_output=True,
            check=False,
        ).returncode == 0
    ):
        raise SystemExit(
            subprocess.call(
                [str(venv_python), __file__, *sys.argv[1:]],
                cwd=backend_dir,
            )
        )

    print(
        f"Missing backend dependencies for {sys.executable}: "
        f"{', '.join(missing_modules)}",
        file=sys.stderr,
    )
    print(
        f'Install them with: "{sys.executable}" -m pip install '
        f'-r "{backend_dir / "requirements.txt"}"',
        file=sys.stderr,
    )
    raise SystemExit(1)

from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)

CORS(app)

api_key = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
client = (
    genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(timeout=15000),
    )
    if api_key
    else None
)

DEFAULT_FAQS = [
    {
        "question": "What services does TechNova provide?",
        "answer": "TechNova provides web and mobile app development, custom software, AI solutions, cloud services and cybersecurity.",
    },
    {
        "question": "Can you build a custom website for my business?",
        "answer": "Yes. We build responsive websites tailored to your goals, audience and business requirements.",
    },
    {
        "question": "Do you develop mobile applications?",
        "answer": "Yes. We can help plan and develop mobile applications based on your users, features and target platforms.",
    },
    {
        "question": "How much does a project cost?",
        "answer": "Pricing depends on the scope, features and timeline. Contact us with your requirements for a project-specific estimate.",
    },
    {
        "question": "How long does a project take?",
        "answer": "Timelines depend on the project's complexity and requirements. We provide an estimate after discussing the scope.",
    },
    {
        "question": "Can you help with an existing project?",
        "answer": "Yes. Contact us with details about your current product and the support or improvements you need.",
    },
    {
        "question": "How do you protect project data?",
        "answer": "We consider security throughout the development process and can discuss safeguards appropriate to your project.",
    },
    {
        "question": "How do I get started?",
        "answer": "Contact TechNova with your goals and requirements. We can discuss the right solution and next steps.",
    },
]


def fallback_chat_reply(message):
    question = message.lower()

    if any(word in question for word in ("price", "cost", "pricing", "budget", "quote")):
        return "Project pricing depends on its scope and features. Share your requirements with TechNova and we can discuss a tailored estimate."
    if any(word in question for word in ("time", "timeline", "long", "deadline")):
        return "Project timelines depend on the scope and requirements. Tell us a little about your project and we can discuss an estimated timeline."
    if any(word in question for word in ("web", "website")):
        return "TechNova builds responsive websites tailored to your business goals. We can help with planning, design and development."
    if any(word in question for word in ("mobile", "app", "application")):
        return "TechNova develops mobile applications around your users and requirements. Tell us about the features and platforms you have in mind."
    if any(word in question for word in ("ai", "artificial intelligence")):
        return "TechNova can help identify and build AI solutions that automate processes or improve productivity."
    if any(word in question for word in ("cloud",)):
        return "TechNova provides cloud solutions designed to be secure and scalable for your business."
    if any(word in question for word in ("security", "cyber", "protect")):
        return "TechNova offers cybersecurity and data-protection services. Contact us to discuss the safeguards your project needs."

    return "TechNova helps businesses with web and mobile development, custom software, AI, cloud and cybersecurity. What would you like to know?"


# Chatbot API
@app.route("/api/chat", methods=["POST"])
def chat():
    message = ""

    try:
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify({"error": "A JSON request body is required"}), 400

        raw_message = data.get("message", "")
        if not isinstance(raw_message, str):
            return jsonify({"error": "Message must be text"}), 400

        message = raw_message.strip()
        history = data.get("history", [])

        if not message:
            return jsonify({"error": "Message cannot be empty"}), 400

        if not client:
            return jsonify({"reply": fallback_chat_reply(message)})

        contents = []

        for item in history if isinstance(history, list) else []:
            if not isinstance(item, dict):
                continue

            role = item.get("role")

            if role not in ["user", "assistant"]:
                continue

            raw_text = item.get("text", "")
            text = raw_text.strip() if isinstance(raw_text, str) else ""

            if text:
                contents.append({
                    "role": "model" if role == "assistant" else "user",
                    "parts": [{"text": text}]
                })

        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are TechNova's friendly AI assistant. "
                    "Help visitors understand our IT services, "
                    "web development, mobile applications, AI, "
                    "cloud solutions and software development. "
                    "Be professional, friendly and concise."
                )
            )
        )

        reply = (response.text or "").strip()
        if not reply:
            return jsonify({"reply": fallback_chat_reply(message)})

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        print("Chatbot Error:", str(e))
        return jsonify({"reply": fallback_chat_reply(message)})


# FAQ Generation API
@app.route("/api/generate-faq", methods=["POST"])
def generate_faq():
    if not client:
        return jsonify({"faqs": DEFAULT_FAQS, "source": "default"})

    try:
        prompt = """
        Generate 8 common questions and answers
        about a professional IT company named TechNova.

        Cover services, web development, mobile applications,
        pricing, project timelines, support, security and technology.

        Return only a valid JSON array with this structure:
        [
            {
                "question": "Question here",
                "answer": "Answer here"
            }
        ]
        """

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.7
            )
        )

        faqs = json.loads(response.text)

        if (
            not isinstance(faqs, list)
            or not faqs
            or any(
                not isinstance(faq, dict)
                or not isinstance(faq.get("question"), str)
                or not isinstance(faq.get("answer"), str)
                for faq in faqs
            )
        ):
            raise ValueError("Invalid FAQ response format")

        return jsonify({"faqs": faqs, "source": "ai"})

    except Exception as e:
        print("FAQ Error:", str(e))
        return jsonify({"faqs": DEFAULT_FAQS, "source": "default"})


@app.route("/")
def home():
    return "TechNova Backend is Running!"


if __name__ == "__main__":
    app.run(debug=True, port=5000)