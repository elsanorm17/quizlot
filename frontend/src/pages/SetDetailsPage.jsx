import { ArrowLeft, BookOpen, Edit3, Play, Star } from "lucide-react";

export default function SetDetailsPage({
  set,
  currentUser,
  onBack,
  onOpenProfile,
  onNotice,
}) {
  const cards = set.cards || set.flashcards || [];
  const isOwner = set.owner?.toLowerCase() === currentUser.toLowerCase();
  const owner = set.owner || currentUser;

  return (
    <section className="set-details-section">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={16} />
        Back to study sets
      </button>
      <div className="set-details-hero">
        <div className={`set-art set-details-art ${set.color || "peach"}`}>
          <span className="art-label">{set.tag || "STUDY SET"}</span>
          <div className="art-illustration">✦</div>
        </div>
        <div className="set-details-intro">
          <div className="eyebrow">SET OVERVIEW</div>
          <h2>{set.title}</h2>
          <p>{set.description || "A study set ready for you to explore."}</p>
          <button className="creator profile-creator" onClick={() => onOpenProfile(owner)}>
            <span className="creator-avatar">{owner.charAt(0).toUpperCase()}</span>
            <span>by <b>{owner}</b></span>
          </button>
        </div>
        <div className="set-detail-actions">
          <button
            className="primary-action"
            onClick={() => onNotice(`Study mode for “${set.title}” is the next feature to implement.`)}
          >
            <Play size={16} />
            Start studying
          </button>
          {isOwner && (
            <button className="secondary-action" onClick={() => onNotice("Set editing is coming next.")}>
              <Edit3 size={15} />
              Edit set
            </button>
          )}
        </div>
      </div>
      <div className="flashcards-heading">
        <div>
          <div className="eyebrow">WHAT'S INSIDE</div>
          <h3>Flashcards</h3>
        </div>
        <span>{cards.length} cards</span>
      </div>
      <div className="flashcard-list">
        {cards.length ? (
          cards.map((card, index) => (
            <article className="study-flashcard" key={card.question_num || index}>
              <div className="flashcard-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="flashcard-content">
                <div className="flashcard-label">QUESTION</div>
                <h4>{card.question}</h4>
                <div className="flashcard-answer">
                  <div className="flashcard-label">ANSWER</div>
                  <p>{card.answer}</p>
                </div>
              </div>
              <span className={`difficulty ${card.difficulty || "medium"}`}>
                {card.difficulty || "medium"}
              </span>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <BookOpen size={24} />
            <h3>No flashcards yet</h3>
            <p>This set does not have any cards to show.</p>
          </div>
        )}
      </div>
    </section>
  );
}