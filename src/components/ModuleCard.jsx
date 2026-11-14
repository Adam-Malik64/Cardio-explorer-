// Card linking to a single learning module. Used on the landing page and the Modules page.
import { Link } from 'react-router';

/** @param {{ module: import('../content/modules').LearningModule, index: number }} props */
export default function ModuleCard({ module, index }) {
  return (
    <Link to={`/modules/${module.slug}`} className={`card module-card theme-${module.theme}`}>
      <span className="card-icon" aria-hidden="true">{module.icon}</span>
      <span className="kind-tag">
        {index + 1}. {module.kind}
      </span>
      <h3>{module.title}</h3>
      <p>{module.summary}</p>
      <span className="card-cta" aria-hidden="true">
        Explore →
      </span>
    </Link>
  );
}
