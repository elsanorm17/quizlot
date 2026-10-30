import { Check, MessageCircle, X } from "lucide-react";

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

export function FriendCard({ friend, onMessage }) {
  return (
    <article className="friend-card">
      <div className="friend-card-top">
        <FriendAvatar username={friend.username} color={friend.color} />
        <span className="points-badge">{friend.points} pts</span>
      </div>
      <div className="friend-details">
        <strong>@{friend.username}</strong>
        <span>{friend.email}</span>
        <p>{friend.points} points earned</p>
      </div>
      <div className="friend-card-footer">
        <span>Quizlot friend</span>
        <button
          className="message-btn"
          onClick={() => onMessage(friend.username)}
          aria-label={`Message ${friend.username}`}
        >
          <MessageCircle size={16} /> Message
        </button>
      </div>
    </article>
  );
}

export function FriendRequest({ request, onAccept, onDecline }) {
  return (
    <article className="request-card">
      <FriendAvatar username={request.username} color={request.color} />
      <div className="friend-details">
        <strong>@{request.username}</strong>
        <span>{request.email} · {request.points} pts</span>
      </div>
      <div className="request-actions">
        <button
          className="accept-btn"
          onClick={() => onAccept(request.username)}
          aria-label={`Accept ${request.username}'s request`}
        >
          <Check size={16} />
        </button>
        <button
          className="decline-btn"
          onClick={() => onDecline(request.username)}
          aria-label={`Decline ${request.username}'s request`}
        >
          <X size={16} />
        </button>
      </div>
    </article>
  );
}
