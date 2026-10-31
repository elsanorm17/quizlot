import { ArrowLeft, BookOpen, Check, ChevronRight, Star, Trophy, UserPlus, Users, X } from "lucide-react";
import { FriendAvatar } from "../components/PagePrimitives.jsx";

const currentUser = "quizlot";
const profileColors = ["pink", "yellow", "peach", "orange"];

export default function ProfilePage({ username, friends, requests, leaderboard, sets, outgoingRequests, onBack, onOpenProfile, onRequestFriend, onRemoveFriendRequest, onAcceptFriendRequest, onDeclineFriendRequest, onRemoveFriend }) {
  const friend = friends.find((item) => item.username === username);
  const incomingRequest = requests.find((item) => item.username === username);
  const outgoingRequest = outgoingRequests.find((item) => item.username === username);
  const standing = leaderboard.findIndex((entry) => entry.username === username);
  const points = friend?.points ?? leaderboard.find((entry) => entry.username === username)?.points ?? 0;
  const color = friend?.color ?? leaderboard.find((entry) => entry.username === username)?.color ?? profileColors[username.length % profileColors.length];
  const createdSets = sets.filter((set) => set.owner?.toLowerCase() === username.toLowerCase());
  const isCurrentUser = username === currentUser;
  const relationship = isCurrentUser ? "self" : friend ? "friend" : incomingRequest ? "incoming" : outgoingRequest ? "outgoing" : "none";

  return (
    <section className="profile-page">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} /> Back to {isCurrentUser ? "your space" : "friends"}</button>
      {standing >= 0 && <button className="profile-rank" onClick={() => onOpenProfile(username)}><Trophy size={16} /> Ranked <strong>#{standing + 1}</strong> on the community leaderboard <span>{points} pts</span></button>}
      <div className={`profile-hero ${color}`}>
        <div className="profile-avatar-wrap"><FriendAvatar username={username} color={color} /></div>
        <div className="profile-identity">
          <div className="eyebrow">{isCurrentUser ? "YOUR LEARNING PROFILE" : "QUIZLOT LEARNER"}</div>
          <h2>@{username}</h2>
          <p>{friend?.email || (isCurrentUser ? "Keep learning, one question at a time." : "This learner is building their Quizlot journey.")}</p>
        </div>
        <div className="profile-spark">✦</div>
      </div>

      <div className={`profile-stats ${isCurrentUser ? "" : "profile-stats-four"}`}>
        <div><Trophy size={18} /><strong>{points}</strong><span>points</span></div>
        <div><BookOpen size={18} /><strong>{createdSets.length}</strong><span>study sets</span></div>
        <div><Trophy size={18} /><strong>{standing >= 0 ? `#${standing + 1}` : "—"}</strong><span>leaderboard rank</span></div>
        {!isCurrentUser && <div className={`relationship-stat relationship-${relationship}`}><Users size={18} /><strong>{relationship === "friend" ? "Friends" : relationship === "incoming" ? "Incoming" : relationship === "outgoing" ? "Pending" : "Not friends"}</strong><span>connection</span></div>}
      </div>

      {!isCurrentUser && <div className={`profile-relationship relationship-${relationship}`}>
        {relationship === "friend" && <><Check size={17} /><span>You are friends</span><button className="relationship-btn muted" onClick={() => onRemoveFriend(username)}><X size={15} /> Remove friend</button></>}
        {relationship === "outgoing" && <><Check size={17} /><span>Friend request sent</span><button className="relationship-btn muted" onClick={() => onRemoveFriendRequest(username)}><X size={15} /> Remove request</button></>}
        {relationship === "incoming" && <><UserPlus size={17} /><span>They requested to be friends</span><button className="relationship-btn accept" onClick={() => onAcceptFriendRequest(username)}><Check size={15} /> Accept</button><button className="relationship-btn reject" onClick={() => onDeclineFriendRequest(username)}><X size={15} /> Reject</button></>}
        {relationship === "none" && <><Users size={17} /><span>Not friends yet</span><button className="relationship-btn primary" onClick={() => onRequestFriend(username)}><UserPlus size={15} /> Request to be friends</button></>}
      </div>}

      <div className="profile-sets">
        <div className="eyebrow">{createdSets.length ? "CREATED STUDY SETS" : `${username.toUpperCase()} DOES NOT HAVE ANY SETS YET`}</div>
        {createdSets.length ? (
          <div className="set-grid">
            {createdSets.map((set, index) => (
              <article className="set-card" key={set.set_id}>
                <div className={`set-art ${set.color || profileColors[index % profileColors.length]}`}>
                  <span className="art-label">{set.tag || "STUDY SET"}</span>
                  <div className="art-illustration">{index % 4 === 0 ? "⌘" : index % 4 === 1 ? "✿" : index % 4 === 2 ? "✦" : "∑"}</div>
                  <span className="art-spark">✧</span>
                </div>
                <div className="set-info">
                  <div className="set-meta">
                    <span><BookOpen size={14} /> {set.question_count || 0} questions</span>
                    <span className="set-difficulty"><Star size={13} fill="currentColor" /> Beginner</span>
                  </div>
                  <h3>{set.title}</h3>
                  <p>{set.description || "A study set ready for you to explore."}</p>
                  <div className="set-footer">
                    <button className="creator profile-creator" onClick={() => onOpenProfile(set.owner || username)}><span className="creator-avatar">{(set.owner || username).charAt(0).toUpperCase()}</span><span>by <b>{set.owner || username}</b></span></button>
                    <button className="start-btn" onClick={() => onOpenProfile(set.owner || username)}>View <ChevronRight size={16} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

    </section>
  );
}
