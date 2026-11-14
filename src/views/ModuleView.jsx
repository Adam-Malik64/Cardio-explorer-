// /modules/:slug: one module: its outline plus its interactive screen (see moduleInteractives).
import { Link, useParams } from 'react-router';
import { findModule, modules } from '../content/modules';
import { moduleInteractives } from '../components/moduleInteractives';
import NotFoundView from './NotFoundView';
import useDocumentTitle from '../components/layout/useDocumentTitle';

export default function ModuleView() {
  const { slug } = useParams();
  const module = findModule(slug);
  useDocumentTitle(module ? module.title : 'Page not found');

  if (!module) return <NotFoundView />;

  const index = modules.indexOf(module);
  const prev = modules[index - 1];
  const next = modules[index + 1];
  const Interactive = moduleInteractives[module.slug];

  return (
    <article className="container page module">
      <Link to="/modules" className="back-link">
        ← All modules
      </Link>

      <header className="page-header">
        <p className="eyebrow">
          {module.kind} · Module {index + 1} of {modules.length}
        </p>
        <h1>
          <span aria-hidden="true">{module.icon} </span>
          {module.title}
        </h1>
        <p className="lead">{module.summary}</p>
      </header>

      <section className="card">
        <h2>What you’ll explore</h2>
        <ul className="topic-list">
          {module.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>

      {Interactive ? (
        <Interactive />
      ) : (
        <p className="placeholder-note">The interactive version of this module is coming soon.</p>
      )}

      <nav aria-label="Module" className="module-pager">
        {prev ? <Link to={`/modules/${prev.slug}`}>← {prev.title}</Link> : <span />}
        {next && <Link to={`/modules/${next.slug}`}>{next.title} →</Link>}
      </nav>
    </article>
  );
}
