// Heart Health Glossary & Fact Cards (Issue #4), shown on /modules/glossary.
// Search and filter the terms, then flip cards to test your recall. The search text is never
// stored, logged or put in the URL (it might reveal a student's own health worry).
import { useId, useRef, useState } from 'react';
import FactCard from '../components/glossary/FactCard';
import { filterTerms, MAX_QUERY_LENGTH } from '../components/glossary/filterTerms';
import { areas, terms as allTerms } from '../mocks/glossary';

export default function GlossaryView({ terms = allTerms }) {
  const id = useId();
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [flipped, setFlipped] = useState(() => new Set());

  const shown = filterTerms(terms, query, area);
  const areaIds = Object.keys(areas).filter((a) => terms.some((t) => t.area === a));
  const trimmed = query.trim();

  function toggle(termId) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) next.delete(termId);
      else next.add(termId);
      return next;
    });
  }

  function clearAll() {
    setQuery('');
    setArea('all');
    searchRef.current?.focus();
  }

  return (
    <section className="card glossary" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Glossary &amp; fact cards</h2>
      <p className="muted">
        Plain-language definitions for learning and revision. Not medical advice.
      </p>

      <div className="glossary-controls">
        <div className="glossary-search">
          <label htmlFor={`${id}-search`}>Search terms</label>
          <input
            id={`${id}-search`}
            ref={searchRef}
            type="search"
            value={query}
            maxLength={MAX_QUERY_LENGTH}
            autoComplete="off"
            aria-describedby={`${id}-search-hint`}
            onChange={(e) => setQuery(e.target.value.slice(0, MAX_QUERY_LENGTH))}
          />
          <p id={`${id}-search-hint`} className="glossary-hint">
            Searches term names and definitions. Up to {MAX_QUERY_LENGTH} characters.
          </p>
        </div>

        <fieldset className="glossary-filter">
          <legend>Learning area</legend>
          {['all', ...areaIds].map((a) => (
            <label key={a} className="glossary-filter-option">
              <input
                type="radio"
                name={`${id}-area`}
                value={a}
                checked={area === a}
                onChange={() => setArea(a)}
              />
              {a === 'all' ? 'All' : areas[a]}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="glossary-toolbar">
        <p role="status" className="glossary-count" data-testid="glossary-count">
          {shown.length === 0
            ? 'No terms match'
            : `${shown.length} ${shown.length === 1 ? 'term' : 'terms'} shown`}
        </p>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => setFlipped(new Set())}
        >
          Reset all cards
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="glossary-empty">
          <p data-testid="glossary-empty">
            {trimmed
              ? `No terms match “${trimmed}”${area !== 'all' ? ` in ${areas[area]}` : ''}.`
              : 'There are no terms to show yet.'}
          </p>
          {(trimmed || area !== 'all') && (
            <button type="button" className="button" onClick={clearAll}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <ul className="fact-card-grid">
          {shown.map((t) => (
            <li key={t.id}>
              <FactCard term={t} flipped={flipped.has(t.id)} onFlip={() => toggle(t.id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
