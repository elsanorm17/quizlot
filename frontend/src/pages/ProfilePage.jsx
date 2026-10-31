import { ArrowLeft, BookOpen, Mail, Trophy, Users } from "lucide-react";
import { FriendAvatar } from "../components/PagePrimitives.jsx";

const currentUser = "quizlot";
const profileColors = ["pink", "yellow", "peach", "orange"];

export default function ProfilePage({ username, friends, leaderboard, sets, onBack, onOpenProfile }) {
  const friend = friends.find((item) => item.username === username);
  const standing = leaderboard.findIndex((entry) => entry.username === username);
  const points = friend?.points ?? leaderboard.find((entry) => entry.username === username)?.points ?? 0;
  const color = friend?.color ?? leaderboard.find((entry) => entry.username === username)?.color ?? profileColors[username.length % profileColors.length];
  const createdSets = sets.filter((set) => set.owner?.toLowerCase() === username.toLowerCase());
  const isCurrentUser = username === currentUser;

  return (
    <section className="profile-page">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} /> Back to {isCurrentUser ? "your space" : "friends"}</button>
      <div className={`profile-hero ${color}`}>
        <div className="profile-avatar-wrap"><FriendAvatar username={username} color={color} /></div>
        <div className="profile-identity">
          <div className="eyebrow">{isCurrentUser ? "YOUR LEARNING PROFILE" : "QUIZLOT LEARNER"}</div>
          <h2>@{username}</h2>
          <p>{friend?.email || (isCurrentUser ? "Keep learning, one question at a time." : "This learner is building their Quizlot journey.")}</p>
        </div>
        <div className="profile-spark">✦</div>
      </div>

      <div className="profile-stats">
        <div><Trophy size={18} /><strong>{points}</strong><span>points</span></div>
        <div><BookOpen size={18} /><strong>{createdSets.length}</strong><span>study sets</span></div>
        <div><Users size={18} /><strong>{friend ? "Friend" : standing >= 0 ? `#${standing + 1}` : "Learner"}</strong><span>{friend ? "in your circle" : "leaderboard"}</span></div>
      </div>

      <div className="profile-columns">
        <div className="profile-panel">
          <div className="eyebrow">ABOUT THIS LEARNER</div>
          <h3>{isCurrentUser ? "A curious mind in progress." : `Say hello to @${username}.`}</h3>
          <p>{isCurrentUser ? "Small, consistent study sessions add up. Keep exploring topics that make you curious." : "Learning is better with a little company. See what they have been creating and cheering them on."}</p>
          {friend?.email && <span className="profile-contact"><Mail size={14} /> {friend.email}</span>}
        </div>
        <div className="profile-panel">
          <div className="eyebrow">CREATED STUDY SETS</div>
          {createdSets.length ? createdSets.map((set) => <button className="profile-set" key={set.set_id}><BookOpen size={16} /><span>{set.title}</span><small>{set.question_count || 0} questions</small></button>) : <p className="profile-empty">No public study sets yet.</p>}
        </div>
      </div>

      {standing >= 0 && <button className="profile-rank" onClick={() => onOpenProfile(username)}><Trophy size={16} /> Ranked <strong>#{standing + 1}</strong> on the community leaderboard <span>{points} pts</span></button>}
    </section>
  );
}
