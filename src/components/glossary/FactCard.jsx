// One flip-style fact card (Issue #4). The front asks the student to recall the term; the
// "flip" button reveals the definition and fact. It is a native button (Enter/Space/click,
// never hover-only), and the back is only rendered once flipped, so screen readers do not
// read the answer early.
import { useId } from 'react';
import { areas } from '../../mocks/glossary';

export default function FactCard({ term, flipped, onFlip }) {
  const id = useId();
  return (
    <article className={flipped ? 'fact-card flipped' : 'fact-card'} aria-labelledby={`${id}-term`}>
      <p className="fact-card-area">{areas[term.area] ?? term.area}</p>
      <h3 id={`${id}-term`} className="fact-card-term">
        {term.term}
      </h3>

      {flipped ? (
        <div className="fact-card-back" data-testid={`back-${term.id}`}>
          <p>{term.definition}</p>
          {term.fact && (
            <p className="fact-card-fact">
              <strong>Fact:</strong> {term.fact}
            </p>
          )}
          {term.source && (
            <p className="fact-card-source">
              Source:{' '}
              <a href={term.source.href} target="_blank" rel="noreferrer">
                {term.source.label}
                {' '}
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
            </p>
          )}
        </div>
      ) : (
        <p className="fact-card-prompt muted">Can you remember what this means?</p>
      )}

      <button type="button" className="button button-secondary" aria-pressed={flipped} onClick={onFlip}>
        {flipped ? 'Hide definition' : 'Show definition'}
        {' '}
        <span className="visually-hidden">of {term.term}</span>
      </button>
    </article>
  );
}
