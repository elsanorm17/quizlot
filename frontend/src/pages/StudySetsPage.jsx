import { useMemo } from "react";
import { BookOpen, ChevronRight, Plus, Search, Star } from "lucide-react";
import { Notice } from "../components/PagePrimitives.jsx";

const currentUser = "quizlot";
const fallbackColors = ["peach", "pink", "yellow", "orange"];

export default function StudySetsPage({ activeTab, sets, search, setSearch, notice, setNotice, onOpenProfile }) {
  const mySets = useMemo(() => sets.filter((set) => set.owner?.toLowerCase() === currentUser), [sets]);
  const visibleSets = useMemo(() => {
    const availableSets = activeTab === "My study sets" ? mySets : sets;
    return availableSets.filter((set) =>
      `${set.title} ${set.description || ""} ${set.owner || ""} ${set.tag || ""}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeTab, mySets, search, sets]);

  return (
    <section className="sets-section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">{activeTab === "My study sets" ? "YOUR COLLECTION" : "FIND YOUR FLOW"}</div>
          <h2>{activeTab === "Discover" ? "Pick your next challenge" : activeTab}</h2>
          <p>{activeTab === "My study sets" ? `${mySets.length} set${mySets.length === 1 ? "" : "s"} created by you.` : "Choose a set, test what you know, and earn those points."}</p>
        </div>
        <button className="create-btn" onClick={() => setNotice("Set creation is coming next. The database schema already supports user-owned flashcard sets.")}>
          <Plus size={17}/> Create a set
        </button>
      </div>
      <Notice message={notice} onDismiss={() => setNotice("")} />
      <div className="search-row">
        <div className="search-box">
          <Search size={18}/>
          <input aria-label={activeTab === "My study sets" ? "Search my study sets" : "Search study sets"} placeholder={activeTab === "My study sets" ? "Search your study sets..." : "Search topics, subjects, or creators..."} value={search} onChange={(event) => setSearch(event.target.value)}/>
        </div>
        {search && <button className="filter-btn" onClick={() => setSearch("")}>Clear search</button>}
      </div>
      <div className="set-grid">{visibleSets.map((set, index) =>
        <article className="set-card" key={set.set_id}>
          <div className={`set-art ${set.color || fallbackColors[index % 4]}`}>
            <span className="art-label">{set.tag || "STUDY SET"}</span>
            <div className="art-illustration">{index % 4 === 0 ? "⌘" : index % 4 === 1 ? "✿" : index % 4 === 2 ? "✦" : "∑"}</div>
            <span className="art-spark">✧</span>
          </div>
          <div className="set-info">
            <div className="set-meta">
              <span><BookOpen size={14}/> {set.question_count || 0} questions</span>
              <span className="set-difficulty"><Star size={13} fill="currentColor"/> Beginner</span>
            </div>
            <h3>{set.title}</h3>
            <p>{set.description || "A study set ready for you to explore."}</p>
            <div className="set-footer">
              <button className="creator profile-creator" onClick={() => onOpenProfile(set.owner || "quizlot")}><span className="creator-avatar">{(set.owner || "q").charAt(0).toUpperCase()}</span><span>by <b>{set.owner || "quizlot"}</b></span></button>
              <button className="start-btn" onClick={() => setNotice(`Quiz mode for “${set.title}” is the next feature to implement.`)} aria-label={`Start ${set.title}`}>Start <ChevronRight size={16}/></button>
            </div>
          </div>
        </article>)}
      </div>
      {visibleSets.length === 0 && <div className="empty-state"><BookOpen size={24}/><h3>{activeTab === "My study sets" && !search ? "Your collection is waiting" : "No sets found"}</h3><p>{activeTab === "My study sets" && !search ? "Create your first study set to start building your collection." : "Try another search term."}</p></div>}
    </section>
  );
}
