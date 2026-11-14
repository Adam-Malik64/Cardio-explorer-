// Card linking to a single learning module. Used on the landing page and the Modules page.
import { Link } from 'react-router';

/**
 * @param {{ module: import('../content/modules').LearningModule, index: number, headingLevel?: 2 | 3 }} props
 *   headingLevel: 3 under a section h2 (landing page), 2 directly under the page h1 (Modules page).
 */
export default function ModuleCard({ module, index, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <Link to={`/modules/${module.slug}`} className={`card module-card theme-${module.theme}`}>
      <span className="card-icon" aria-hidden="true">{module.icon}</span>
      <span className="kind-tag">
        {index + 1}. {module.kind}
      </span>
      <Heading>{module.title}</Heading>
      <p>{module.summary}</p>
      <span className="card-cta" aria-hidden="true">
        Explore →
      </span>
    </Link>
  );
}
