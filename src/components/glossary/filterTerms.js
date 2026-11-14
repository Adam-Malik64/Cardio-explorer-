// Search + filter rules for the glossary (Issue #4). Pure functions so they can be unit tested.
// The query is matched as plain text (never as a regex or HTML). Matching ignores case,
// extra spaces, accents and curly vs straight quotes, so "heart's" finds "heart’s".

export const MAX_QUERY_LENGTH = 100;

/** Lowercases, strips accents, straightens quotes and collapses whitespace. */
export function normaliseText(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”″]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Caps the length, then normalises. */
export function normaliseQuery(query) {
  return normaliseText(String(query ?? '').slice(0, MAX_QUERY_LENGTH));
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
    return normaliseText(t.term).includes(q) || normaliseText(t.definition).includes(q);
  });
}
