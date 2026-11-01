import { useState } from "react";
import { Swords, UserPlus, Users } from "lucide-react";
import { FriendAvatar, Notice } from "../components/PagePrimitives.jsx";

const filters = ["All challenges", "Incoming", "Active", "Completed"];

function ChallengeCard({ challenge, onOpenProfile, onAction }) {
  const isIncoming = challenge.status === "incoming";
  const isCompleted = challenge.status === "completed";
  const opponent = isIncoming ? challenge.from : challenge.opponent;

  function declineChallenge() {
    onAction(`@${opponent.username}'s challenge was declined.`);
  }

  function acceptChallenge() {
    onAction(`Challenge accepted. ${challenge.title} is ready when you are.`);
  }

  function viewResults() {
    onAction(`Results for ${challenge.title} are already recorded.`);
  }

  function continueChallenge() {
    onAction(`Quiz mode for ${challenge.title} is coming next.`);
  }

  return (
    <article
      className={`challenge-card ${isCompleted ? "challenge-completed" : ""}`}
    >
      <div className="challenge-card-top">
        <div className="challenge-icon">
          <Swords size={19} />
        </div>
        <span className={`challenge-status status-${challenge.status}`}>
          {challenge.statusLabel}
        </span>
      </div>

      <div className="challenge-title-row">
        <div>
          <div className="eyebrow">{challenge.category}</div>
          <h3>{challenge.title}</h3>
        </div>
        <span className="challenge-round">{challenge.questions} Qs</span>
      </div>
      <p className="challenge-description">{challenge.description}</p>
      <div className="challenge-opponent">
        <FriendAvatar username={opponent.username} color={opponent.color} />
        <div>
          <span>{isIncoming ? "Challenged by" : "Playing against"}</span>
          <button
            className="profile-link"
            onClick={() => onOpenProfile(opponent.username)}
          >
            @{opponent.username}
          </button>
        </div>
      </div>

      <div className="challenge-footer">
        {isIncoming ? (
          <>
            <button className="challenge-secondary" onClick={declineChallenge}>
              Decline
            </button>
            <button className="challenge-primary" onClick={acceptChallenge}>
              Accept
            </button>
          </>
        ) : isCompleted ? (
          <button className="challenge-primary" onClick={viewResults}>
            View results
          </button>
        ) : (
          <button className="challenge-primary" onClick={continueChallenge}>
            Continue challenge
          </button>
        )}
      </div>
    </article>
  );
}

export default function ChallengesPage({ challenges, notice, setNotice, onOpenProfile }) {
  const [filter, setFilter] = useState("All challenges");
  const visibleChallenges = filterChallenges(challenges, filter);

  function inviteFriend() {
    setNotice("Challenge invites will be available when quiz mode is connected.");
  }

  return (
    <section className="sets-section challenges-section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <Swords size={14} /> FRIENDLY COMPETITION
          </div>
          <h2>Challenges</h2>
          <p>Put your knowledge to the test with people you know.</p>
        </div>
        <button className="create-btn" onClick={inviteFriend}>
          <UserPlus size={17} />
          Invite a friend
        </button>
      </div>

      <Notice message={notice} onDismiss={() => setNotice("")} />

      <div className="challenge-tabs" role="tablist" aria-label="Challenge views">
        {filters.map((item) => {
          const count = item === "All challenges"
            ? challenges.length
            : visibleCount(challenges, item);

          return (
            <button
              key={item}
              className={filter === item ? "selected" : ""}
              onClick={() => setFilter(item)}
              role="tab"
              aria-selected={filter === item}
            >
              {item}
              <span>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="challenge-grid">
        {visibleChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onOpenProfile={onOpenProfile}
            onAction={setNotice}
          />
        ))}
      </div>

      {visibleChallenges.length === 0 && (
        <div className="empty-state">
          <Users size={24} />
          <h3>No challenges here yet</h3>
          <p>Invite a friend and make your next study session a match.</p>
        </div>
      )}
    </section>
  );
}

function filterChallenges(challenges, filter) {
  if (filter === "All challenges") return challenges;

  const status = filter.toLowerCase();
  return challenges.filter((challenge) => challenge.status === status);
}

function visibleCount(challenges, filter) {
  return filterChallenges(challenges, filter).length;
}
