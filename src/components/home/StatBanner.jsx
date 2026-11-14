// "Why Heart Health Matters" banner: sourced statistics from content/stats.js.
import { Link } from 'react-router';
import { modules } from '../../content/modules';
import { stats } from '../../content/stats';

export default function StatBanner() {
  const habitsModule = modules.find((m) => m.theme === 'habits');

  return (
    <section className="stat-banner" aria-labelledby="stats-title">
      <div className="container">
        <h2 id="stats-title">Why heart health matters</h2>

        <ul className="stat-list">
          {stats.map((stat) => (
            <li key={stat.value} className="stat">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <a className="stat-source" href={stat.href} target="_blank" rel="noreferrer">
                Source: {stat.source}
                {' '}
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="stat-note">
          The good news: the World Health Organization lists unhealthy diet, physical inactivity,
          tobacco and harmful alcohol use as the most important behavioural risk factors, and
          they’re habits you can learn about and change.
        </p>
        <Link
          to={habitsModule ? `/modules/${habitsModule.slug}` : '/modules'}
          className="button button-inverse"
        >
          Take the habits quiz
        </Link>
      </div>
    </section>
  );
}
