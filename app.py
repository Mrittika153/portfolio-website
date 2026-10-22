import random
from datetime import datetime

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


SITE_OWNER = {
    "name": "Mrittika Dakshi",
    "role": "Software Developer",
    "tagline": "Where data meets decision, I build backend systems that don't just run—they think.I design optimized digital infrastructure, balancing complex logic with absolute precision for every edge case.",
    "location": "Berhampore, Murshidabad, India",
    "phone": "8100627012",
    "email": "mrittikadakshi15@gmail.com",
    "linkedin": "https://linkedin.com/in/mrittika-dakshi-3b394a368",
    "github": "https://github.com/Mrittika153",
    "Instagram": "https://instagram.com/dakshimrittika?srtk=MWV3bDFlbmpxY3RwbQ%3D%3D",
    "Facebook": "https://www.facebook.com/share/1DmHdLj1m9/",

}


SKILLS = [
    {"id": "cpp", "label": "C++", "x": 8, "y": 10, "level": 88, "group": "Language"},
    {"id": "dsa", "label": "DSA & OOP", "x": 30, "y": 24, "level": 85, "group": "Core CS"},
    {"id": "flask", "label": "Flask & Web Dev", "x": 6, "y": 46, "level": 90, "group": "Backend"},
    {"id": "mysql", "label": "MySQL", "x": 26, "y": 68, "level": 78, "group": "Database"},
    {"id": "llm", "label": "LLMs", "x": 55, "y": 8, "level": 85, "group": "AI"},
    {"id": "rag", "label": "RAG", "x": 78, "y": 20, "level": 87, "group": "AI"},
    {"id": "langchain", "label": "LangChain", "x": 58, "y": 78, "level": 75, "group": "AI Tooling"},
    {"id": "chroma", "label": "ChromaDB", "x": 86, "y": 56, "level": 80, "group": "AI Tooling"},
    {"id": "git", "label": "Git", "x": 40, "y": 50, "level": 82, "group": "Tools"},
]

FEATURED_PROJECT = {
    "name": "AI-Powered Question Generator & Online Assessment System",
    "tag": "LLM + RAG · 2025",
    "summary": (
        "A Flask web app that turns a PDF, DOCX, or TXT document into a full "
        "online exam — MCQs, short answers, and long answers — grounded in the "
        "document's own content instead of generic LLM guesses."
    ),
    "stack": ["Flask", "LangChain", "ChromaDB", "Sentence Transformers", "SQLite"],
    "stats": [
        {"value": "3", "label": "File formats parsed (PDF / DOCX / TXT)"},
        {"value": "RAG", "label": "Grounded generation, not guesswork"},
        {"value": "Multi-user", "label": "Timed assessments, tracked live"},
    ],
    "features": [
        {
            "title": "Document-grounded question generation",
            "detail": "Parses PDF, DOCX, and TXT source material and generates MCQ, short-answer, and long-answer questions with an LLM.",
        },
        {
            "title": "Retrieval-Augmented Generation",
            "detail": "Uses ChromaDB and Sentence Transformers to retrieve the most relevant passages first, so questions stay accurate to the source instead of drifting into hallucination.",
        },
        {
            "title": "Live timed assessments",
            "detail": "A multi-user MCQ exam flow with real-time test tracking and automatic evaluation as each attempt is submitted.",
        },
        {
            "title": "Auth & session management",
            "detail": "User authentication and session handling built on SQLite, so each learner's attempts stay separate and recoverable.",
        },
        {
            "title": "Export-ready output",
            "detail": "Generated question sets and assessment results can be exported straight to TXT or PDF for offline use.",
        },
    ],
}

EDUCATION = [
    {
        "title": "B.Tech in Computer Science Engineering",
        "org": "Techno Engineering College Banipur",
        "place": "Habra",
        "year": "2026",
    },
    {
        "title": "Higher Secondary",
        "org": "Berhampore Lipika Girls High School",
        "place": "Berhampore",
        "year": "2022",
    },
    {
        "title": "Matriculation",
        "org": "Berhampore Girls Mahakali Pathsala",
        "place": "Berhampore",
        "year": "2020",
    },
]

ACHIEVEMENTS = [
    {"title": "TCS CodeVita — Qualified Round 1", "org": "TCS", "year": "2026", "certificate": "TCS_CodeVita_Season13_m_dakshi-1.png"},
    {"title": "SQL and Relational Databases 101", "org": "IBM Developer Skills Network", "year": "2024", "certificate": "SQL and Relational Database_IBM Certificate-1.png"},
    {"title": "Introduction to Artificial Intelligence", "org": "IBM SkillBuild", "year": "2024", "certificate": "Completion Certificate _ SkillsBuild-1.png"},
    {"title": "Introduction to Large Language Models", "org": "IBM SkillBuild", "year": "2024", "certificate": "Completion Certificate _ SkillsBuild_large lang model-1.png"},
]

LANGUAGES = [
    {"name": "Bengali", "level": "Native"},
    {"name": "English", "level": "Professional"},
    {"name": "Hindi", "level": "Professional"},
]


DIALOGUE = {
    "hero": [
        "Hi, I'm Rai — Mrittika built me to say hello properly.",
        "Fair warning: mention RAG and she'll talk for twenty minutes.",
        "This whole site is basically one well-organized Flask app. Fitting.",
    ],
    "about": [
        "She sketches in her free time — you're looking at proof that carries over into code.",
        "Ask her about ChromaDB sometime. She has opinions.",
    ],
    "skills": [
        "This graph isn't decoration — tap a node.",
        "The AI cluster is where most of her recent hours went.",
        "C++ was the first language. Flask is the current favorite.",
    ],
    "project": [
        "This is the one she'll actually want to talk to you about.",
        "Every feature below is real and shipped, not a roadmap promise.",
        "RAG is doing a lot of quiet work behind that MCQ generator.",
    ],
    "education": [
        "B.Tech, Computer Science, class of 2026.",
        "She is soo consistent.",
    ],
    "achievements": [
        "Three IBM certificates and a global coding round — not bad for a semester's worth of evenings.",
        "CodeVita Round 1, cleared. Round 2 is next.",
    ],
    "contact": [
        "The form below actually reaches her inbox — no bottles required this time.",
        "LinkedIn, GitHub, or email — pick whichever you check most often.",
    ],
    "click": [
        "You found me. I mostly just point at things, but happy to help.",
        "Yes? Oh — right, you clicked. Hi.",
        "Between you and me, she debugged an embedding pipeline until 2am for that RAG project.",
        "Every visitor gets one free wave. Consider it spent.",
    ],
    "idle": [
        "...",
        "*quietly indexing the page*",
        "Still here.",
    ],
}


@app.route("/")
def index():
    return render_template(
        "index.html",
        owner=SITE_OWNER,
        skills=SKILLS,
        project=FEATURED_PROJECT,
        education=EDUCATION,
        achievements=ACHIEVEMENTS,
        languages=LANGUAGES,
    )


@app.route("/api/skills")
def api_skills():
    return jsonify(SKILLS)


@app.route("/api/project")
def api_project():
    return jsonify(FEATURED_PROJECT)


@app.route("/api/dialogue")
def api_dialogue():
    """Return a contextual line for Ada to say.

    Query param: context — one of the DIALOGUE keys, defaults to 'idle'.
    """
    context = request.args.get("context", "idle")
    lines = DIALOGUE.get(context, DIALOGUE["idle"])
    return jsonify({"context": context, "line": random.choice(lines)})



INBOX = []


@app.route("/api/contact", methods=["POST"])
def api_contact():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    errors = {}
    if not name:
        errors["name"] = "Ada needs a name to address the reply to."
    if not email or "@" not in email:
        errors["email"] = "That doesn't look like a full address."
    if not message:
        errors["message"] = "The message is empty — write something first."

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    INBOX.append(
        {
            "name": name,
            "email": email,
            "message": message,
            "received_at": datetime.utcnow().isoformat(),
        }
    )

    reply = random.choice(
        [
            f"Got it, {name}. That landed straight in the inbox — expect a reply soon.",
            f"Message received, {name}. Mrittika usually replies within a day or two.",
            f"Thanks, {name} — noted, and on its way to a real inbox.",
        ]
    )
    return jsonify({"ok": True, "reply": reply})


if __name__ == "__main__":
    app.run(debug=True)
