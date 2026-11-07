// Card linking to a single learning module. Used on the Modules page and the landing page.
import { Link } from 'react-router';
import { findCategory } from '../content/modules';

/**
 * @param {{
 *   module: import('../content/modules').LearningModule,
 *   showCategory?: boolean,
 * }} props
 * showCategory adds a colour-coded learning-area label (used where cards are not grouped).
 */
export default function ModuleCard({ module, showCategory = false }) {
  return (
    <Link to={`/modules/${module.slug}`} className={`card module-card cat-${module.category}`}>
      <span className="card-icon" aria-hidden="true">{module.icon}</span>
      {showCategory && <span className="category-tag">{findCategory(module.category)?.title}</span>}
      <h3>{module.title}</h3>
      <p>{module.summary}</p>
    </Link>
  );
}
