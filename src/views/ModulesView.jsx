// /modules: all four core modules.
import ModuleCard from '../components/ModuleCard';
import { modules } from '../content/modules';

export default function ModulesView() {
  return (
    <div className="container page">
      <header className="page-header">
        <h1>Learning Modules</h1>
        <p className="lead">Pick a module to start exploring.</p>
      </header>

      <ul className="card-grid feature-grid">
        {modules.map((module, index) => (
          <li key={module.slug}>
            <ModuleCard module={module} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
}
