// Landing page hero: headline, value proposition, "Start Learning" CTA and a decorative
// heart-and-ECG illustration.
import { Link } from 'react-router';
import { modules } from '../../content/modules';

export default function Hero() {
  const firstModule = modules[0];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Interactive heart health learning</p>
          <h1 id="hero-title">
            Get to know the muscle that <span className="accent-text">never takes a break</span>.
          </h1>
          <p className="lead">
            Explore the four chambers, follow blood as it flows through your body, simulate your
            pulse across heart rate zones, and test how daily habits affect your heart, all in one
            interactive app.
          </p>
          <div className="hero-actions">
            <Link to={`/modules/${firstModule.slug}`} className="button button-large">
              Start Learning
            </Link>
            <Link to="/modules" className="button button-secondary button-large">
              Browse all modules
            </Link>
          </div>
          <p className="hero-meta">
            {modules.length} interactive modules · Free · Made for middle and high school biology
          </p>
        </div>

        <HeartbeatGraphic />
      </div>
    </section>
  );
}

// Decorative only: hidden from screen readers. The ECG trace is always visible; a short
// highlight (.ecg-pulse) travels along it unless the visitor prefers reduced motion.
const ECG_PATH =
  'M0 40 H40 l6 -6 l6 6 H66 l4 6 l6 -36 l6 46 l5 -10 H110 l8 -10 l10 10 H150 ' +
  'l6 -6 l6 6 H176 l4 6 l6 -36 l6 46 l5 -10 H220 l8 -10 l10 10 H300';

function HeartbeatGraphic() {
  return (
    <div className="hero-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="hero-heart">
        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
      </svg>
      <div className="ecg-card">
        <div className="ecg-header">
          <span>Heart rate</span>
          <strong>
            72 <small>bpm</small>
          </strong>
        </div>
        <svg viewBox="0 0 300 80" className="ecg" preserveAspectRatio="none">
          <path className="ecg-line" d={ECG_PATH} />
          <path className="ecg-pulse" d={ECG_PATH} pathLength="100" />
        </svg>
      </div>
    </div>
  );
}
