// Link to another website. Opens in a new tab and tells screen-reader users so.
// The separating space sits outside the hidden span: accessible-name computation trims
// leading spaces inside it, which would run the words together.
export default function ExternalLink({ href, children, className }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}{' '}
      <span className="visually-hidden">(opens in a new tab)</span>
    </a>
  );
}

/** "Source A and Source B" as external links. */
export function SourceList({ items }) {
  return items.map((s, i) => (
    <span key={s.href}>
      {i > 0 && ' and '}
      <ExternalLink href={s.href}>{s.label}</ExternalLink>
    </span>
  ));
}
