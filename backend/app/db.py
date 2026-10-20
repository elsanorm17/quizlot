import os
from contextlib import contextmanager

import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def database_configured() -> bool:
    return all(os.getenv(key) for key in ("DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"))


@contextmanager
def get_connection():
    """Open a short-lived MySQL connection. Configure DB_* variables first."""
    if not database_configured():
        raise RuntimeError("Database is not configured; set DB_* environment variables.")
    connection = mysql.connector.connect(
        host=os.environ["DB_HOST"],
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        connection_timeout=5,
    )
    try:
        yield connection
    finally:
        connection.close()
