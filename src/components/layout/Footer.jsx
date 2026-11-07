// Site footer: brand, quick links to each module, and the "not medical advice" disclaimer.
import { Link } from 'react-router';
import { modules } from '../../content/modules';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">♥</span>
            Cardio Explorer
          </Link>
          <p className="muted">
            Interactive heart health learning for middle and high school students.
          </p>
        </div>

        <nav aria-label="Footer" className="footer-links">
          <h2 className="footer-heading">Learn</h2>
          <ul>
            {modules.map((module) => (
              <li key={module.slug}>
                <Link to={`/modules/${module.slug}`}>{module.title}</Link>
              </li>
            ))}
            <li>
              <Link to="/modules">All modules</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-disclaimer">
          <h2 className="footer-heading">Important</h2>
          <p>
            Cardio Explorer is for education only and is not medical advice. Talk to a healthcare
            professional about your own heart health. In an emergency, call your local emergency
            number.
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="muted">© {new Date().getFullYear()} Cardio Explorer</p>
      </div>
    </footer>
  );
}
