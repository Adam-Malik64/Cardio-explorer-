// /modules: every module, grouped by learning area.
import ModuleCard from '../components/ModuleCard';
import { categories, modules } from '../content/modules';

export default function ModulesView() {
  return (
    <div className="container page">
      <header className="page-header">
        <h1>Learning Modules</h1>
        <p className="lead">Pick a topic to start learning.</p>
      </header>

      {categories.map((category) => (
        <section key={category.id} className="module-group" aria-labelledby={`group-${category.id}`}>
          <h2 id={`group-${category.id}`}>{category.title}</h2>
          <p className="muted">{category.description}</p>
          <ul className="card-grid">
            {modules
              .filter((module) => module.category === category.id)
              .map((module) => (
                <li key={module.slug}>
                  <ModuleCard module={module} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
