-- Quizlot initial MySQL schema
-- Run against a dedicated database, e.g. `quizlot`.
-- Passwords must be salted hashes (password_hash), never plaintext.

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(40) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL,
    points INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS friends (
    user_id BIGINT UNSIGNED NOT NULL,
    friend_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    CONSTRAINT chk_friends_order CHECK (user_id < friend_id),
    CONSTRAINT fk_friends_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_friends_friend FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS friendRequests (
    sender_id BIGINT UNSIGNED NOT NULL,
    receiver_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'accepted', 'declined', 'cancelled') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (sender_id, receiver_id),
    CONSTRAINT chk_friend_request_distinct CHECK (sender_id <> receiver_id),
    CONSTRAINT fk_friend_requests_sender FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_friend_requests_receiver FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flashcardSets (
    set_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    PRIMARY KEY (set_id),
    KEY idx_flashcard_sets_user (user_id),
    CONSTRAINT fk_flashcard_sets_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flashcards (
    set_id BIGINT UNSIGNED NOT NULL,
    question_num INT UNSIGNED NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    PRIMARY KEY (set_id, question_num),
    CONSTRAINT fk_flashcards_set FOREIGN KEY (set_id) REFERENCES flashcardSets(set_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quizAttempts (
    attempt_num BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    set_id BIGINT UNSIGNED NOT NULL,
    score INT UNSIGNED NOT NULL DEFAULT 0,
    num_correct INT UNSIGNED NOT NULL DEFAULT 0,
    num_questions INT UNSIGNED NOT NULL,
    PRIMARY KEY (attempt_num),
    UNIQUE KEY uq_attempt_set (attempt_num, set_id),
    KEY idx_attempts_user (user_id),
    KEY idx_attempts_set (set_id),
    CONSTRAINT chk_attempt_counts CHECK (num_correct <= num_questions),
    CONSTRAINT fk_attempts_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_attempts_set FOREIGN KEY (set_id) REFERENCES flashcardSets(set_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS questionResponses (
    attempt_num BIGINT UNSIGNED NOT NULL,
    set_id BIGINT UNSIGNED NOT NULL,
    question_number INT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    is_correct BOOLEAN NOT NULL,
    PRIMARY KEY (attempt_num, question_number),
    KEY idx_responses_set_question (set_id, question_number),
    CONSTRAINT fk_responses_attempt_set FOREIGN KEY (attempt_num, set_id)
        REFERENCES quizAttempts(attempt_num, set_id),
    CONSTRAINT fk_responses_flashcard FOREIGN KEY (set_id, question_number)
        REFERENCES flashcards(set_id, question_num),
    CONSTRAINT fk_responses_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS challenges (
    challenge_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    creator_id BIGINT UNSIGNED NOT NULL,
    opponent_id BIGINT UNSIGNED NOT NULL,
    set_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'accepted', 'completed', 'declined', 'cancelled') NOT NULL DEFAULT 'pending',
    creator_score INT UNSIGNED NULL,
    opponent_score INT UNSIGNED NULL,
    PRIMARY KEY (challenge_id),
    KEY idx_challenges_creator (creator_id),
    KEY idx_challenges_opponent (opponent_id),
    CONSTRAINT chk_challenge_opponents CHECK (creator_id <> opponent_id),
    CONSTRAINT fk_challenges_creator FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_challenges_opponent FOREIGN KEY (opponent_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_challenges_set FOREIGN KEY (set_id) REFERENCES flashcardSets(set_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS achievements (
    achievement_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    requirement VARCHAR(255) NOT NULL,
    PRIMARY KEY (achievement_id),
    UNIQUE KEY uq_achievements_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS userAchievements (
    user_id BIGINT UNSIGNED NOT NULL,
    achievement_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, achievement_id),
    CONSTRAINT fk_user_achievements_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_achievements_achievement FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE
) ENGINE=InnoDB;
