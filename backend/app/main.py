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
DEMO_CARDS = {
    1: [
        {"question_num": 1, "question": "What does CPU stand for?", "answer": "Central Processing Unit", "difficulty": "easy"},
        {"question_num": 2, "question": "What is a variable?", "answer": "A named location used to store a value", "difficulty": "easy"},
        {"question_num": 3, "question": "What does HTML describe?", "answer": "The structure and content of a web page", "difficulty": "easy"},
    ],
    2: [
        {"question_num": 1, "question": "What is the powerhouse of the cell?", "answer": "The mitochondrion", "difficulty": "easy"},
        {"question_num": 2, "question": "What controls what enters and leaves a cell?", "answer": "The cell membrane", "difficulty": "medium"},
        {"question_num": 3, "question": "Where is DNA stored in a eukaryotic cell?", "answer": "The nucleus", "difficulty": "easy"},
    ],
    3: [
        {"question_num": 1, "question": "What is the capital of Japan?", "answer": "Tokyo", "difficulty": "easy"},
        {"question_num": 2, "question": "Which is the largest ocean?", "answer": "The Pacific Ocean", "difficulty": "easy"},
        {"question_num": 3, "question": "What is the longest river in South America?", "answer": "The Amazon River", "difficulty": "medium"},
    ],
    4: [
        {"question_num": 1, "question": "What does the mean describe?", "answer": "The arithmetic average of a set of values", "difficulty": "easy"},
        {"question_num": 2, "question": "What is the median?", "answer": "The middle value in an ordered data set", "difficulty": "easy"},
        {"question_num": 3, "question": "What does standard deviation measure?", "answer": "How spread out values are from the mean", "difficulty": "medium"},
    ],
}
DEMO_FRIENDS = [
    {"username": "mayamakes", "email": "maya@example.com", "points": 420},
    {"username": "jb_reads", "email": "jordan@example.com", "points": 285},
    {"username": "samstudies", "email": "sam@example.com", "points": 190},
]
DEMO_REQUESTS = [
    {"username": "alexlearns", "email": "alex@example.com", "points": 155},
    {"username": "priyaprep", "email": "priya@example.com", "points": 230},
]
DEMO_CHALLENGES = []
DEMO_LEADERBOARD = [
    {"username": "joe_cool", "points": 420},
    {"username": "charlieBrown", "points": 285},
    {"username": "woodstock", "points": 190},
    {"username": "quizlot", "points": 120},
    {"username": "shaq", "points": 95},
    {"username": "aaron", "points": 70},
]
DEMO_ACHIEVEMENTS = [
    {"achievement_id": 1, "name": "Set explorer", "description": "Attempted your first study set.", "requirement": 1, "category": "sets_attempted"},
    {"achievement_id": 2, "name": "Curious mind", "description": "Attempted five study sets.", "requirement": 5, "category": "sets_attempted"},
    {"achievement_id": 3, "name": "Point collector", "description": "Accumulated 100 points.", "requirement": 100, "category": "points_accumulated"},
    {"achievement_id": 4, "name": "Challenge champion", "description": "Won your first challenge.", "requirement": 1, "category": "challenges_won"},
    {"achievement_id": 5, "name": "Friendly face", "description": "Made your first friend.", "requirement": 1, "category": "friends"},
    {"achievement_id": 6, "name": "Set maker", "description": "Created your first study set.", "requirement": 1, "category": "sets_created"},
]
DEMO_USER_ACHIEVEMENTS = [
    {"user_id": 1, "achievement_id": 1},
    {"user_id": 1, "achievement_id": 2},
    {"user_id": 1, "achievement_id": 3},
    {"user_id": 1, "achievement_id": 4},
    {"user_id": 1, "achievement_id": 5},
    {"user_id": 1, "achievement_id": 6},
]
DEMO_USERS = [
    {"user_id": 1, "username": "joe_cool", "email": "joe@example.com", "points": 420},
    {"user_id": 2, "username": "charlieBrown", "email": "charlie@example.com", "points": 285},
    {"user_id": 3, "username": "woodstock", "email": "woodstock@example.com", "points": 190},
    {"user_id": 4, "username": "quizlot", "email": "quizlot@example.com", "points": 120},
    {"user_id": 5, "username": "shaq", "email": "shaq@example.com", "points": 95},
    {"user_id": 6, "username": "aaron", "email": "aaron@example.com", "points": 70},
]


@app.get("/api/health")
def health():
    return {"status": "ok", "database_configured": database_configured()}


@app.get("/api/users/{username}")
def get_user(username: str):
    if not database_configured():
        user = next((item for item in DEMO_USERS if item["username"].lower() == username.lower()), None)
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        return {**user, "source": "demo"}
    try:
        with get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT u.user_id, u.username, u.email, u.points,
                       (SELECT COUNT(*) FROM flashcardSets fs WHERE fs.user_id = u.user_id) AS created_set_count,
                       (SELECT COUNT(*) FROM quizAttempts qa WHERE qa.user_id = u.user_id) AS attempted_set_count,
                       (SELECT COUNT(*) FROM friends f WHERE f.user_id = u.user_id OR f.friend_id = u.user_id) AS friend_count,
                       (SELECT COUNT(*) FROM challenges c WHERE c.status = 'completed'
                           AND ((c.creator_id = u.user_id AND c.creator_score > c.opponent_score)
                             OR (c.opponent_id = u.user_id AND c.opponent_score > c.creator_score))) AS challenges_won
                FROM users u
                WHERE LOWER(u.username) = LOWER(%s)
                """,
                (username,),
            )
            user = cursor.fetchone()
            cursor.close()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        return {**user, "source": "database"}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Could not load user.") from exc


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


@app.get("/api/sets/{set_id}")
def get_set(set_id: int):
    if not database_configured():
        study_set = next((item for item in DEMO_SETS if item["set_id"] == set_id), None)
        if not study_set:
            raise HTTPException(status_code=404, detail="Study set not found.")
        return {**study_set, "cards": DEMO_CARDS.get(set_id, [])}
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
                WHERE fs.set_id = %s
                GROUP BY fs.set_id, fs.title, fs.description, u.username
                """,
                (set_id,),
            )
            study_set = cursor.fetchone()
            if not study_set:
                raise HTTPException(status_code=404, detail="Study set not found.")
            cursor.execute(
                "SELECT question_num, question, answer, difficulty FROM flashcards WHERE set_id = %s ORDER BY question_num",
                (set_id,),
            )
            study_set["cards"] = cursor.fetchall()
            cursor.close()
        return study_set
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Could not load study set.") from exc


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


@app.get("/api/leaderboard")
def list_leaderboard(username: str = "quizlot"):
    if not database_configured():
        return {"entries": DEMO_LEADERBOARD, "source": "demo"}
    try:
        with get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                "SELECT username, points FROM users ORDER BY points DESC, username ASC LIMIT 50"
            )
            entries = cursor.fetchall()
            cursor.close()
        return {"entries": entries, "source": "database"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Could not load leaderboard.") from exc


@app.get("/api/achievements")
def list_achievements(username: str = "quizlot"):
    if not database_configured():
        return {"achievements": DEMO_ACHIEVEMENTS, "source": "demo"}
    try:
        with get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT a.achievement_id, a.name, a.description, a.requirement, a.category
                FROM userAchievements ua
                JOIN users u ON u.user_id = ua.user_id
                JOIN achievements a ON a.achievement_id = ua.achievement_id
                WHERE u.username = %s
                ORDER BY a.requirement DESC, a.achievement_id DESC
                """,
                (username,),
            )
            achievements = cursor.fetchall()
            cursor.close()
        return {"achievements": achievements, "source": "database"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Could not load achievements.") from exc


@app.get("/api/challenges")
def list_challenges(username: str = "quizlot"):
    if not database_configured():
        return {"challenges": DEMO_CHALLENGES, "source": "demo"}
    try:
        with get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT c.challenge_id AS id,
                       CASE
                           WHEN c.status = 'pending' AND c.opponent_id = u.user_id THEN 'incoming'
                           WHEN c.status = 'accepted' THEN 'active'
                           ELSE c.status
                       END AS status,
                       UPPER(COALESCE(fs.title, 'STUDY SET')) AS category,
                       fs.title,
                       CONCAT('Challenge on ', fs.title) AS description,
                       COUNT(f.question_num) AS questions,
                       CASE WHEN c.creator_id = u.user_id THEN opponent.username ELSE creator.username END AS opponent_username,
                       CASE WHEN c.creator_id = u.user_id THEN opponent.email ELSE creator.email END AS opponent_email,
                       c.creator_score, c.opponent_score
                FROM challenges c
                JOIN users u ON u.username = %s
                JOIN users creator ON creator.user_id = c.creator_id
                JOIN users opponent ON opponent.user_id = c.opponent_id
                JOIN flashcardSets fs ON fs.set_id = c.set_id
                LEFT JOIN flashcards f ON f.set_id = fs.set_id
                WHERE c.creator_id = u.user_id OR c.opponent_id = u.user_id
                GROUP BY c.challenge_id, c.status, fs.title, u.user_id,
                         creator.username, creator.email, opponent.username, opponent.email,
                         c.creator_score, c.opponent_score
                ORDER BY c.challenge_id DESC
                """,
                (username,),
            )
            challenges = cursor.fetchall()
            cursor.close()
        for challenge in challenges:
            challenge["statusLabel"] = {
                "incoming": "Waiting for you",
                "active": "In progress",
                "completed": "Completed",
                "declined": "Declined",
                "cancelled": "Cancelled",
            }.get(challenge["status"], challenge["status"].title())
            challenge["opponent"] = {"username": challenge.pop("opponent_username"), "email": challenge.pop("opponent_email")}
        return {"challenges": challenges, "source": "database"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Could not load challenges.") from exc
