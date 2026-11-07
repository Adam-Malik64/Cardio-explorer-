// /: placeholder shell. The full landing page will replace this.
import { Link } from 'react-router';

export default function HomeView() {
  return (
    <section className="page-shell">
      <h1>Cardio Explorer</h1>
      <p className="lead">Learn how your heart works and how to keep it healthy.</p>
      <p className="placeholder-note">Landing page coming soon.</p>
      <Link to="/modules" className="button">
        Browse the modules
      </Link>
    </section>
  );
}
