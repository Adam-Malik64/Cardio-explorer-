// Search + filter rules for the glossary (Issue #4). Pure functions so they can be unit tested.
// The query is matched as plain text (never as a regex or HTML), ignoring case and extra spaces.

export const MAX_QUERY_LENGTH = 100;

/** Trims, collapses runs of whitespace, lowercases and caps the length. */
export function normaliseQuery(query) {
  return String(query ?? '')
    .slice(0, MAX_QUERY_LENGTH)
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * @param {import('../../mocks/glossary').GlossaryTerm[]} terms
 * @param {string} query  Raw search text
 * @param {string} area   'all' or an area key
 */
export function filterTerms(terms, query, area = 'all') {
  const q = normaliseQuery(query);
  return terms.filter((t) => {
    if (area !== 'all' && t.area !== area) return false;
    if (q === '') return true;
    return t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
  });
}
