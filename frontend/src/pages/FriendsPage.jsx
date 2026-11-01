import { Search, UserPlus, Users } from "lucide-react";
import { FriendCard, FriendRequest, Notice } from "../components/PagePrimitives.jsx";

export default function FriendsPage({
  friends,
  requests,
  search,
  setSearch,
  friendFilter,
  setFriendFilter,
  notice,
  setNotice,
  onOpenProfile,
}) {
  const visibleFriends = friends.filter((friend) =>
    `${friend.username} ${friend.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="sets-section friends-section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">YOUR CIRCLE</div>
          <h2>Friends</h2>
          <p>Keep each other curious, motivated, and moving forward.</p>
        </div>
        <button
          className="create-btn"
          onClick={() => setNotice("Friend search will connect to your account when user profiles are added.")}
        >
          <UserPlus size={17} /> Add friends
        </button>
      </div>

      <Notice message={notice} onDismiss={() => setNotice("")} />

      <div className="search-row">
        <div className="search-box">
          <Search size={18} />
          <input
            aria-label="Search friends"
            placeholder="Search friends..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear friend search">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="friend-tabs" role="tablist" aria-label="Friend views">
        {["All friends", "Requests"].map((filter) => (
          <button
            key={filter}
            className={friendFilter === filter ? "selected" : ""}
            onClick={() => setFriendFilter(filter)}
            role="tab"
            aria-selected={friendFilter === filter}
          >
            {filter}
            <span>{filter === "Requests" ? requests.length : friends.length}</span>
          </button>
        ))}
      </div>

      {friendFilter === "Requests" ? (
        <div className="request-list">
          {requests.map((request) => (
            <FriendRequest
              key={request.username}
              request={request}
              onAccept={(username) => setNotice(`@${username} is now in your friends list.`)}
              onDecline={(username) => setNotice(`Request from @${username} dismissed.`)}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </div>
      ) : (
        <div className="friend-grid">
          {visibleFriends.map((friend) => (
            <FriendCard
              key={friend.username}
              friend={friend}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </div>
      )}

      {friendFilter === "All friends" && visibleFriends.length === 0 && (
        <div className="empty-state">
          <Users size={24} />
          <h3>No friends found</h3>
          <p>Try a different name or username.</p>
        </div>
      )}
    </section>
  );
}
