import { useState } from "react";
import { Crown, Medal, Trophy, Users } from "lucide-react";
import { FriendAvatar, Notice } from "../components/PagePrimitives.jsx";

const currentUser = "quizlot";
const friendColors = ["pink", "yellow", "peach", "orange"];

export default function LeaderboardPage({ entries, friends, notice, setNotice, onOpenProfile }) {
  const [scope, setScope] = useState("Everyone");
  const friendUsernames = friends.map((friend) => friend.username);
  const visibleEntries = scope === "Friends"
    ? entries.filter((entry) => entry.username === currentUser || friendUsernames.includes(entry.username))
    : entries;
  const podium = visibleEntries.slice(0, 3);
  const remaining = visibleEntries.slice(3);

  return (
    <section className="sets-section leaderboard-section">
      <div className="section-heading">
        <div>
          <div className="eyebrow"><Trophy size={14} /> THE COMMUNITY SCOREBOARD</div>
          <h2>Leaderboard</h2>
          <p>See who is keeping their curiosity in motion.</p>
        </div>
        <button className="create-btn" onClick={() => setNotice("Keep studying to climb the leaderboard!")}>
          <Medal size={17} /> Earn points
        </button>
      </div>

      {notice && <Notice message={notice} onDismiss={() => setNotice("")} />}

      <div className="leaderboard-tabs" role="tablist" aria-label="Leaderboard scope">
        {["Everyone", "Friends"].map((filter) => (
          <button key={filter} className={scope === filter ? "selected" : ""} onClick={() => setScope(filter)} role="tab" aria-selected={scope === filter}>
            {filter === "Everyone" ? <Users size={14} /> : <Medal size={14} />}{filter}
          </button>
        ))}
      </div>

      <div className="podium">
        {podium.map((entry, index) => (
          <article className={`podium-card place-${index + 1}`} key={entry.username}>
            <FriendAvatar username={entry.username} color={entry.color || friendColors[index % friendColors.length]} />
            <div className="podium-platform">
              <div className="podium-rank">{index === 0 ? <Crown size={17} /> : index + 1}</div>
              <button className="profile-link" onClick={() => onOpenProfile(entry.username)}>@{entry.username}</button>
              <span>{entry.points} pts</span>
            </div>
          </article>
        ))}
      </div>

      <div className="leaderboard-list" role="table" aria-label={`${scope} leaderboard rankings`}>
        <div className="leaderboard-list-header" role="row"><span>Rank</span><span>Learner</span><span>Points</span></div>
        {remaining.map((entry, index) => (
          <div className={`leaderboard-row ${entry.username === currentUser ? "current-user" : ""}`} role="row" key={entry.username}>
            <span className="rank-number">{index + 4}</span>
            <span className="leader-name"><FriendAvatar username={entry.username} color={entry.color || friendColors[index % friendColors.length]} /><button className="profile-link" onClick={() => onOpenProfile(entry.username)}>@{entry.username}</button>{entry.username === currentUser && <em>You</em>}</span>
            <strong>{entry.points} pts</strong>
          </div>
        ))}
      </div>
      {visibleEntries.length === 0 && <div className="empty-state"><Users size={24} /><h3>No friends on the board yet</h3><p>Add friends and start learning together.</p></div>}
    </section>
  );
}
