import { useEffect, useMemo, useState } from "react";
import { BookOpen, Flame, Search, Plus, Trophy, Users, Sparkles, ChevronRight, Clock3, Star } from "lucide-react";
import { getStudySets } from "./api.js";

const starterSets = [
  { set_id: 1, title: "Computer Science Basics", description: "The building blocks of code", question_count: 12, owner: "quizlot", tag: "Computer Science", color: "peach" },
  { set_id: 2, title: "Biology: The Cell", description: "Organelles, processes & more", question_count: 18, owner: "studybuddy", tag: "Biology", color: "pink" },
  { set_id: 3, title: "World Geography", description: "A little trip around the world", question_count: 15, owner: "mapmaven", tag: "Geography", color: "yellow" },
  { set_id: 4, title: "Intro to Statistics", description: "Make sense of the numbers", question_count: 20, owner: "numbersnerd", tag: "Math", color: "orange" },
];

export default function App() {
  const [sets, setSets] = useState(starterSets);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Discover");
  const [notice, setNotice] = useState("");
  const [apiStatus, setApiStatus] = useState("connecting");

  useEffect(() => {
    getStudySets()
      .then(({ items }) => {
        if (items?.length) setSets(items.map((item, i) => ({ ...item, tag: ["Computer Science", "Biology", "Geography", "Math"][i % 4], color: ["peach", "pink", "yellow", "orange"][i % 4] })));
        setApiStatus("connected");
      })
      .catch(() => setApiStatus("demo"));
  }, []);

  const visibleSets = useMemo(() => sets.filter((set) =>
    `${set.title} ${set.description || ""} ${set.owner || ""} ${set.tag || ""}`.toLowerCase().includes(search.toLowerCase())
  ), [sets, search]);

  function selectTab(tab) {
    setActiveTab(tab);
    if (tab !== "Discover") setNotice(`${tab} is part of the next build — this starter is ready for the feature to be wired in.`);
    else setNotice("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => selectTab("Discover")} aria-label="Quizlot home">
          <span className="brand-mark">q</span><span>quizlot<span className="brand-dot">.</span></span>
        </a>
        <div className="side-label">YOUR SPACE</div>
        <nav>
          {[["Discover", Search], ["My study sets", BookOpen], ["Friends", Users], ["Leaderboard", Trophy]].map(([label, Icon]) =>
            <button key={label} className={`nav-item ${activeTab === label ? "active" : ""}`} onClick={() => selectTab(label)}>
              <Icon size={18} strokeWidth={2.1}/><span>{label}</span>{label === "Leaderboard" && <span className="nav-spark">✦</span>}
            </button>
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="streak-card"><div className="streak-icon"><Flame size={19} fill="currentColor"/></div><div><strong>Keep it going!</strong><p>Little by little adds up.</p></div></div>
          <div className="profile"><div className="avatar">S</div><div className="profile-text"><strong>Study pal</strong><span>Level 1 learner</span></div><span className="profile-menu">···</span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">Your space <span>/</span> <b>{activeTab}</b></div><div className="top-actions"><div className="points"><span>✦</span> 120 pts</div><button className="avatar small" title="Profile">S</button></div></header>
        <section className="welcome-row">
          <div><div className="eyebrow"><Sparkles size={14}/> YOUR NEXT STUDY SESSION</div><h1>Hey there, learner<span className="wave">✳</span></h1><p className="subtitle">A little practice today goes a long way.</p></div>
          <div className="welcome-doodle" aria-hidden="true"><span className="doodle-star">✳</span><div className="doodle-card"><BookOpen size={30}/></div><span className="doodle-spark">✦</span></div>
        </section>

        <section className="stats-grid">
          <div className="stat-card stat-pink"><div className="stat-icon"><Flame size={18}/></div><div><span className="stat-label">Daily streak</span><div className="stat-number">3 <small>days</small></div><p>You're on a roll!</p></div></div>
          <div className="stat-card stat-yellow"><div className="stat-icon"><BookOpen size={18}/></div><div><span className="stat-label">Sets explored</span><div className="stat-number">8</div><p>Curiosity looks good on you</p></div></div>
          <div className="stat-card stat-peach"><div className="stat-icon"><Trophy size={18}/></div><div><span className="stat-label">Total points</span><div className="stat-number">120</div><p>Next level: 200 pts</p></div></div>
        </section>

        <section className="sets-section">
          <div className="section-heading"><div><div className="eyebrow">FIND YOUR FLOW</div><h2>{activeTab === "Discover" ? "Pick your next challenge" : activeTab}</h2><p>Choose a set, test what you know, and earn those points.</p></div><button className="create-btn" onClick={() => setNotice("Set creation is coming next. The database schema already supports user-owned flashcard sets.")}><Plus size={17}/> Create a set</button></div>
          {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
          <div className="search-row"><div className="search-box"><Search size={18}/><input aria-label="Search study sets" placeholder="Search topics, subjects, or creators..." value={search} onChange={e => setSearch(e.target.value)}/><kbd>⌘ K</kbd></div><button className="filter-btn" onClick={() => setSearch("")}>Clear search</button></div>
          <div className="set-grid">{visibleSets.map((set, i) => <article className="set-card" key={set.set_id}><div className={`set-art ${set.color || ["peach","pink","yellow","orange"][i % 4]}`}><span className="art-label">{set.tag || "STUDY SET"}</span><div className="art-illustration">{i % 4 === 0 ? "⌘" : i % 4 === 1 ? "✿" : i % 4 === 2 ? "✦" : "∑"}</div><span className="art-spark">✧</span></div><div className="set-info"><div className="set-meta"><span><BookOpen size={14}/> {set.question_count || 0} questions</span><span className="set-difficulty"><Star size={13} fill="currentColor"/> Beginner</span></div><h3>{set.title}</h3><p>{set.description || "A study set ready for you to explore."}</p><div className="set-footer"><div className="creator"><span className="creator-avatar">{(set.owner || "q").charAt(0).toUpperCase()}</span><span>by <b>{set.owner || "quizlot"}</b></span></div><button className="start-btn" onClick={() => setNotice(`Quiz mode for “${set.title}” is the next feature to implement.`)} aria-label={`Start ${set.title}`}>Start <ChevronRight size={16}/></button></div></div></article>)}</div>
          {visibleSets.length === 0 && <div className="empty-state"><Search size={24}/><h3>No sets found</h3><p>Try another search term.</p></div>}
        </section>
        <footer><span>✿ Made for curious minds.</span><span className="api-status"><i className={apiStatus === "connected" ? "online" : ""}></i>{apiStatus === "connected" ? "API connected" : apiStatus === "demo" ? "Demo content · start the API to connect" : "Connecting to API…"}</span></footer>
      </main>
    </div>
  );
}
