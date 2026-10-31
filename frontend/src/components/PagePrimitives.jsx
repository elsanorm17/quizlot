import { Check, X } from "lucide-react";

export function Notice({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="notice" role="status">
      {message}
      <button onClick={onDismiss} aria-label="Dismiss">×</button>
    </div>
  );
}

export function FriendAvatar({ username, color }) {
  return (
    <div className={`friend-avatar ${color}`}>
      {username.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function FriendCard({ friend, onOpenProfile }) {
  return (
    <article className="friend-card" onClick={() => onOpenProfile(friend.username)} onKeyDown={(event) => event.key === "Enter" && onOpenProfile(friend.username)} tabIndex="0">
      <div className="friend-card-top">
        <FriendAvatar username={friend.username} color={friend.color} />
        <span className="points-badge">{friend.points} pts</span>
      </div>
      <div className="friend-details">
        <button className="profile-link" onClick={() => onOpenProfile(friend.username)}>@{friend.username}</button>
        <span>{friend.email}</span>
        <p>{friend.points} points earned</p>
      </div>
      <div className="friend-card-footer">
        <span>Quizlot friend</span>
      </div>
    </article>
  );
}

export function FriendRequest({ request, onAccept, onDecline, onOpenProfile }) {
  return (
    <article className="request-card" onClick={() => onOpenProfile(request.username)}>
      <FriendAvatar username={request.username} color={request.color} />
      <div className="friend-details">
        <button className="profile-link" onClick={() => onOpenProfile(request.username)}>@{request.username}</button>
        <span>{request.email} · {request.points} pts</span>
      </div>
      <div className="request-actions">
        <button
          className="accept-btn"
          onClick={(event) => { event.stopPropagation(); onAccept(request.username); }}
          aria-label={`Accept ${request.username}'s request`}
        >
          <Check size={16} />
        </button>
        <button
          className="decline-btn"
          onClick={(event) => { event.stopPropagation(); onDecline(request.username); }}
          aria-label={`Decline ${request.username}'s request`}
        >
          <X size={16} />
        </button>
      </div>
    </article>
  );
}
