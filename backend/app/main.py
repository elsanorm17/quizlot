from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db import database_configured, get_connection

app = FastAPI(title="Quizlot API", version="0.1.0")

# For local development. Restrict this to your deployed frontend origin in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEMO_SETS = [
    {"set_id": 1, "title": "Computer Science Basics", "description": "Quick fundamentals review", "question_count": 12, "owner": "quizlot"},
    {"set_id": 2, "title": "Biology: The Cell", "description": "Organelles and cell processes", "question_count": 18, "owner": "studybuddy"},
    {"set_id": 3, "title": "World Geography", "description": "Countries, capitals, and landmarks", "question_count": 15, "owner": "mapmaven"},
]
DEMO_FRIENDS = [
    {"username": "mayamakes", "email": "maya@example.com", "points": 420},
    {"username": "jb_reads", "email": "jordan@example.com", "points": 285},
    {"username": "samstudies", "email": "sam@example.com", "points": 190},
]
DEMO_REQUESTS = [
    {"username": "alexlearns", "email": "alex@example.com", "points": 155},
    {"username": "priyaprep", "email": "priya@example.com", "points": 230},
]


@app.get("/api/health")
def health():
    return {"status": "ok", "database_configured": database_configured()}


@app.get("/api/sets")
def list_sets():
    if not database_configured():
        return {"items": DEMO_SETS, "source": "demo"}
    try:
        with get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT fs.set_id, fs.title, fs.description, u.username AS owner,
                       COUNT(f.question_num) AS question_count
                FROM flashcardSets fs
                JOIN users u ON u.user_id = fs.user_id
                LEFT JOIN flashcards f ON f.set_id = fs.set_id
                GROUP BY fs.set_id, fs.title, fs.description, u.username
                ORDER BY fs.set_id DESC
                LIMIT 50
                """
            )
            items = cursor.fetchall()
            cursor.close()
        return {"items": items, "source": "database"}
    except Exception as exc:
        # Avoid exposing connection details or credentials in API responses.
        raise HTTPException(status_code=503, detail="Could not load study sets.") from exc


@app.get("/api/friends")
def list_friends(username: str = "quizlot"):
    if not database_configured():
        return {"friends": DEMO_FRIENDS, "requests": DEMO_REQUESTS, "source": "demo"}
    try:
        with get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="User not found.")

            user_id = user["user_id"]
            cursor.execute(
                """
                SELECT u.username, u.email, u.points
                FROM users u
                JOIN friends f ON (f.user_id = %s AND f.friend_id = u.user_id)
                              OR (f.friend_id = %s AND f.user_id = u.user_id)
                ORDER BY u.username
                """,
                (user_id, user_id),
            )
            friends = cursor.fetchall()
            cursor.execute(
                """
                SELECT u.username, u.email, u.points
                FROM friendRequests fr
                JOIN users u ON u.user_id = fr.sender_id
                WHERE fr.receiver_id = %s AND fr.status = 'pending'
                ORDER BY u.username
                """,
                (user_id,),
            )
            requests = cursor.fetchall()
            cursor.close()
        return {"friends": friends, "requests": requests, "source": "database"}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Could not load friends.") from exc
