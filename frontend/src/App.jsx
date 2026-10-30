import { useEffect, useState } from "react";
import { BookOpen, Flame, Search, Trophy, Users, Sparkles } from "lucide-react";
import { getFriends, getLeaderboard, getStudySets } from "./api.js";
import FriendsPage from "./pages/FriendsPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import StudySetsPage from "./pages/StudySetsPage.jsx";

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
          <FriendsPage
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
          <LeaderboardPage entries={leaderboard} friends={friends} notice={notice} setNotice={setNotice} />
        ) : (
          <StudySetsPage
            activeTab={activeTab}
            sets={sets}
            search={search}
            setSearch={setSearch}
            notice={notice}
            setNotice={setNotice}
          />
        )}
        <footer><span>✿ Made for curious minds.</span><span className="api-status"><i className={apiStatus === "connected" ? "online" : ""}></i>{apiStatus === "connected" ? "API connected" : apiStatus === "demo" ? "Demo content · start the API to connect" : "Connecting to API…"}</span></footer>
      </main>
    </div>
  );
}
