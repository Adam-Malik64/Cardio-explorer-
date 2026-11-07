// Landing page overview of the four core modules from BRIEF.md (read from content/modules.js).
import ModuleCard from '../ModuleCard';
import { modules } from '../../content/modules';

export default function FeatureGrid() {
  return (
    <section className="section" aria-labelledby="features-title">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">What you’ll explore</p>
          <h2 id="features-title">Four interactive ways to learn about your heart</h2>
          <p className="lead">
            See how the heart is built, watch blood flow, test how habits affect your heart, and
            review the key words, all in one place.
          </p>
        </header>

        <ul className="card-grid feature-grid">
          {modules.map((module, index) => (
            <li key={module.slug}>
              <ModuleCard module={module} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
