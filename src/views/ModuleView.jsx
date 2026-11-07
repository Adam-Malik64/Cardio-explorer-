// /modules/:slug: one module. Shows its outline until the lesson content is written.
import { Link, useParams } from 'react-router';
import { findCategory, findModule, modules } from '../content/modules';
import NotFoundView from './NotFoundView';

export default function ModuleView() {
  const { slug } = useParams();
  const module = findModule(slug);

  if (!module) return <NotFoundView />;

  const index = modules.indexOf(module);
  const prev = modules[index - 1];
  const next = modules[index + 1];

  return (
    <article className="container page module">
      <Link to="/modules" className="back-link">
        ← All modules
      </Link>

      <header className="page-header">
        <p className="eyebrow">
          {findCategory(module.category)?.title} · Module {index + 1} of {modules.length}
        </p>
        <h1>
          <span aria-hidden="true">{module.icon} </span>
          {module.title}
        </h1>
        <p className="lead">{module.summary}</p>
      </header>

      <section className="card">
        <h2>Topics to cover</h2>
        <ul className="topic-list">
          {module.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>

      <p className="placeholder-note">Lesson content coming soon.</p>

      <nav aria-label="Module" className="module-pager">
        {prev ? <Link to={`/modules/${prev.slug}`}>← {prev.title}</Link> : <span />}
        {next && <Link to={`/modules/${next.slug}`}>{next.title} →</Link>}
      </nav>
    </article>
  );
}
