// Landing page overview of the learning areas and every module, read from content/modules.js.
import ModuleCard from '../ModuleCard';
import { categories, modules } from '../../content/modules';

export default function FeatureGrid() {
  return (
    <section className="section" aria-labelledby="features-title">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">What you’ll learn</p>
          <h2 id="features-title">Three areas, {modules.length} bite-sized modules</h2>
          <p className="lead">
            Move from how the heart works, to how to look after it, to the measurements that show
            how it’s doing.
          </p>
        </header>

        <ul className="area-list">
          {categories.map((category) => (
            <li key={category.id} className={`area cat-${category.id}`}>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </li>
          ))}
        </ul>

        <ul className="card-grid">
          {modules.map((module) => (
            <li key={module.slug}>
              <ModuleCard module={module} showCategory />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
