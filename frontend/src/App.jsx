import { useEffect, useMemo, useState } from "react";
import { BookOpen, Flame, Search, Plus, Trophy, Users, Sparkles, ChevronRight, MessageCircle, UserPlus, Check, X, Star, Medal, Crown } from "lucide-react";
import { getFriends, getLeaderboard, getStudySets } from "./api.js";

const starterSets = [
  {
    set_id: 1,
    title: "Computer Science Basics",
    description: "The building blocks of code",
    question_count: 12,
    owner: "quizlot",
    tag: "Computer Science",
    color: "peach",
  },
  {
    set_id: 2,
    title: "Biology: The Cell",
    description: "Organelles, processes & more",
    question_count: 18,
    owner: "studybuddy",
    tag: "Biology",
    color: "pink",
  },
  {
    set_id: 3,
    title: "World Geography",
    description: "A little trip around the world",
    question_count: 15,
    owner: "mapmaven",
    tag: "Geography",
    color: "yellow",
  },
  {
    set_id: 4,
    title: "Intro to Statistics",
    description: "Make sense of the numbers",
    question_count: 20,
    owner: "numbersnerd",
    tag: "Math",
    color: "orange",
  },
];
const currentUser = "quizlot";
const starterFriends = [
  { username: "joe_cool", email: "snoopy@peanuts.com", points: 420, color: "pink" },
  { username: "charlieBrown", email: "chuck@yahoo.mail", points: 285, color: "yellow" },
  { username: "woodstock", email: "lil.birdy@gmail.com", points: 190, color: "peach" },
];
const starterRequests = [
  { username: "shaq", email: "shaquilleoneal@gmail.com", points: 155, color: "orange" },
  { username: "aaron", email: "aaron.carter@gmail.com", points: 230, color: "pink" },
];
const starterLeaderboard = [
  { username: "joe_cool", points: 420, color: "pink" },
  { username: "charlieBrown", points: 285, color: "yellow" },
  { username: "woodstock", points: 190, color: "peach" },
  { username: "quizlot", points: 120, color: "orange" },
  { username: "shaq", points: 95, color: "pink" },
  { username: "aaron", points: 70, color: "yellow" },
];
const friendColors = ["pink", "yellow", "peach", "orange"];
const navigationItems = [
  ["Discover", Search],
  ["My study sets", BookOpen],
  ["Friends", Users],
  ["Leaderboard", Trophy],
];
const setTags = ["Computer Science", "Biology", "Geography", "Math"];
const setColors = ["peach", "pink", "yellow", "orange"];

function Notice({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="notice" role="status">
      {message}
      <button onClick={onDismiss} aria-label="Dismiss">×</button>
    </div>
  );
}

function FriendAvatar({ username, color }) {
  return (
    <div className={`friend-avatar ${color}`}>
      {username.slice(0, 2).toUpperCase()}
    </div>
  );
}

function FriendCard({ friend, onMessage }) {
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

function FriendRequest({ request, onAccept, onDecline }) {
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

function LeaderboardView({ entries, friends, notice, setNotice }) {
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
              <strong>@{entry.username}</strong>
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
            <span className="leader-name"><FriendAvatar username={entry.username} color={entry.color || friendColors[index % friendColors.length]} /> @{entry.username}{entry.username === currentUser && <em>You</em>}</span>
            <strong>{entry.points} pts</strong>
          </div>
        ))}
      </div>
      {visibleEntries.length === 0 && <div className="empty-state"><Users size={24} /><h3>No friends on the board yet</h3><p>Add friends and start learning together.</p></div>}
    </section>
  );
}

function FriendsView({
  friends,
  requests,
  search,
  setSearch,
  friendFilter,
  setFriendFilter,
  notice,
  setNotice,
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

      <div className="friend-stats">
        <div><strong>{friends.length}</strong><span>Friends</span></div>
        <div><strong>{requests.length}</strong><span>Requests</span></div>
        <div><strong>12</strong><span>Shared sets</span></div>
      </div>

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
            <button
              className="search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear friend search"
            >
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
            />
          ))}
        </div>
      ) : (
        <div className="friend-grid">
          {visibleFriends.map((friend) => (
            <FriendCard
              key={friend.username}
              friend={friend}
              onMessage={(username) => setNotice(`Messaging @${username} will be available in the next build.`)}
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

export default function App() {
  const [sets, setSets] = useState(starterSets);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Discover");
  const [notice, setNotice] = useState("");
  const [apiStatus, setApiStatus] = useState("connecting");
  const [friendFilter, setFriendFilter] = useState("All friends");
  const [friends, setFriends] = useState(starterFriends);
  const [requests, setRequests] = useState(starterRequests);
  const [leaderboard, setLeaderboard] = useState(starterLeaderboard);

  useEffect(() => {
    getStudySets()
      .then(({ items }) => {
        if (items?.length) {
          setSets(items.map((item, index) => ({
            ...item,
            tag: setTags[index % setTags.length],
            color: setColors[index % setColors.length],
          })));
        }
        setApiStatus("connected");
      })
      .catch(() => setApiStatus("demo"));
  }, []);

  useEffect(() => {
    getFriends(currentUser)
      .then(({ friends: loadedFriends, requests: loadedRequests }) => {
        setFriends(loadedFriends.map((friend, i) => ({ ...friend, color: friendColors[i % friendColors.length] })));
        setRequests(loadedRequests.map((request, i) => ({ ...request, color: friendColors[(i + 1) % friendColors.length] })));
      })
      .catch(() => {
        setFriends(starterFriends);
        setRequests(starterRequests);
      });
  }, []);

  useEffect(() => {
    getLeaderboard(currentUser)
      .then(({ entries }) => {
        if (entries?.length) {
          setLeaderboard(entries.map((entry, index) => ({
            ...entry,
            color: friendColors[index % friendColors.length],
          })));
        }
      })
      .catch(() => setLeaderboard(starterLeaderboard));
  }, []);

  const mySets = useMemo(() => sets.filter((set) => set.owner?.toLowerCase() === currentUser), [sets]);
  const visibleSets = useMemo(() => {
    const availableSets = activeTab === "My study sets" ? mySets : sets;
    return availableSets.filter((set) =>
      `${set.title} ${set.description || ""} ${set.owner || ""} ${set.tag || ""}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeTab, mySets, search, sets]);

  function selectTab(tab) {
    setActiveTab(tab);
    setSearch("");
    setNotice("");
    setFriendFilter("All friends");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => selectTab("Discover")} aria-label="Quizlot home">
          <span className="brand-mark">q</span><span>quizlot<span className="brand-dot">.</span></span>
        </a>
        <nav>
          {navigationItems.map(([label, Icon]) => (
            <button
              key={label}
              className={`nav-item ${activeTab === label ? "active" : ""}`}
              onClick={() => selectTab(label)}
            >
              <Icon size={18} strokeWidth={2.1} />
              <span>{label}</span>
              {label === "Leaderboard" && <span className="nav-spark">✦</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="streak-card">
            <div className="streak-icon">
              <Flame size={19} fill="currentColor"/>
            </div>
            <div>
              <strong>Keep it going!</strong>
              <p>Little by little adds up.</p>
            </div>
          </div>
          <div className="profile">
            <div className="avatar">S</div>
            <div className="profile-text">
              <strong>Study pal</strong>
              <span>Level 1 learner</span>
            </div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Your space <span>/</span> <b>{activeTab}</b>
          </div>
          <div className="top-actions">
            <div className="points">
              <span>✦</span> 120 pts
            </div>
            <button className="avatar small" title="Profile">S</button>
          </div>
        </header>
        <section className="welcome-row">
          <div>
            <div className="eyebrow">
              <Sparkles size={14}/> YOUR NEXT STUDY SESSION
            </div>
            <h1>Hey there, learner<span className="wave">✳</span></h1>
            <p className="subtitle">A little practice today goes a long way.</p>
          </div>
          <div className="welcome-doodle" aria-hidden="true">
            <span className="doodle-star">✳</span>
            <div className="doodle-card"><BookOpen size={30}/></div>
            <span className="doodle-spark">✦</span>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card stat-pink">
            <div className="stat-icon">
              <Flame size={18}/>
            </div>
            <div>
              <span className="stat-label">Daily streak</span>
              <div className="stat-number">3 <small>days</small></div>
              <p>You're on a roll!</p>
            </div>
          </div>
          <div className="stat-card stat-yellow">
            <div className="stat-icon"><BookOpen size={18}/></div>
            <div>
              <span className="stat-label">Sets explored</span>
              <div className="stat-number">8</div>
              <p>Curiosity looks good on you</p>
            </div>
          </div>
          <div className="stat-card stat-peach">
            <div className="stat-icon"><Trophy size={18}/></div>
            <div>
              <span className="stat-label">Total points</span>
              <div className="stat-number">120</div>
              <p>Next level: 200 pts</p>
            </div>
          </div>
        </section>

        {activeTab === "Friends" ? (
          <FriendsView
            friends={friends}
            requests={requests}
            search={search}
            setSearch={setSearch}
            friendFilter={friendFilter}
            setFriendFilter={setFriendFilter}
            notice={notice}
            setNotice={setNotice}
          />
        ) : activeTab === "Leaderboard" ? (
          <LeaderboardView entries={leaderboard} friends={friends} notice={notice} setNotice={setNotice} />
        ) : <section className="sets-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                {activeTab === "My study sets" ? "YOUR COLLECTION" : "FIND YOUR FLOW"}
              </div>
              <h2>
                {activeTab === "Discover" ? "Pick your next challenge" : activeTab}
              </h2>
              <p>
                {activeTab === "My study sets" ? `${mySets.length} set${mySets.length === 1 ? "" : "s"} created by you.` : "Choose a set, test what you know, and earn those points."}
              </p>
            </div>
            <button className="create-btn" onClick={() => setNotice("Set creation is coming next. The database schema already supports user-owned flashcard sets.")}>
              <Plus size={17}/> Create a set
            </button>
          </div>
          {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
          <div className="search-row">
            <div className="search-box">
              <Search size={18}/>
              <input aria-label={activeTab === "My study sets" ? "Search my study sets" : "Search study sets"} placeholder={activeTab === "My study sets" ? "Search your study sets..." : "Search topics, subjects, or creators..."} value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            {search && <button className="filter-btn" onClick={() => setSearch("")}>Clear search</button>}
          </div>
          <div className="set-grid">{visibleSets.map((set, i) => 
            <article className="set-card" key={set.set_id}>
              <div className={`set-art ${set.color || ["peach","pink","yellow","orange"][i % 4]}`}>
                <span className="art-label">
                  {set.tag || "STUDY SET"}
                </span>
                <div className="art-illustration">
                  {i % 4 === 0 ? "⌘" : i % 4 === 1 ? "✿" : i % 4 === 2 ? "✦" : "∑"}
                </div>
                <span className="art-spark">✧</span>
              </div>
              <div className="set-info">
                <div className="set-meta">
                  <span>
                    <BookOpen size={14}/> {set.question_count || 0} questions
                  </span>
                  <span className="set-difficulty">
                    <Star size={13} fill="currentColor"/> Beginner
                  </span>
                </div>
                <h3>
                  {set.title}
                </h3>
                <p>
                  {set.description || "A study set ready for you to explore."}
                </p>
                <div className="set-footer">
                  <div className="creator">
                    <span className="creator-avatar">
                      {(set.owner || "q").charAt(0).toUpperCase()}
                    </span>
                    <span>
                      by <b>{set.owner || "quizlot"}</b>
                    </span>
                  </div>
                  <button className="start-btn" onClick={() => setNotice(`Quiz mode for “${set.title}” is the next feature to implement.`)} aria-label={`Start ${set.title}`}>
                    Start <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            </article>)}
          </div>
          {visibleSets.length === 0 && <div className="empty-state"><BookOpen size={24}/><h3>{activeTab === "My study sets" && !search ? "Your collection is waiting" : "No sets found"}</h3><p>{activeTab === "My study sets" && !search ? "Create your first study set to start building your collection." : "Try another search term."}</p></div>}
        </section>}
        <footer><span>✿ Made for curious minds.</span><span className="api-status"><i className={apiStatus === "connected" ? "online" : ""}></i>{apiStatus === "connected" ? "API connected" : apiStatus === "demo" ? "Demo content · start the API to connect" : "Connecting to API…"}</span></footer>
      </main>
    </div>
  );
}
