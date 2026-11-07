// Card linking to a single learning module. Used on the Modules page.
import { Link } from 'react-router';

/** @param {{ module: import('../content/modules').LearningModule }} props */
export default function ModuleCard({ module }) {
  return (
    <Link to={`/modules/${module.slug}`} className="card module-card">
      <span className="card-icon" aria-hidden="true">{module.icon}</span>
      <h3>{module.title}</h3>
      <p>{module.summary}</p>
    </Link>
  );
}
