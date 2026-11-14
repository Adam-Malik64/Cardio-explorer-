// Heart Rate Zones & Pulse Simulator (Issue #2).
// Students pick an activity level and see the simulated BPM, the heart-rate zone and an
// explanation. Values update instantly; the beating-heart animation is skipped when the
// visitor prefers reduced motion or presses "Pause animation".
import { useState } from 'react';
import { activityLevels, DEMO_AGE, DEMO_MAX_BPM, sources } from '../../mocks/heartRateZones';

export default function PulseSimulator() {
  const [levelId, setLevelId] = useState('rest');
  // Start paused when the visitor has asked the device for reduced motion.
  const [paused, setPaused] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  const level = activityLevels.find((l) => l.id === levelId);
  const percentOfMax = Math.round((level.bpm / DEMO_MAX_BPM) * 100);

  return (
    <section className="card simulator" aria-labelledby="simulator-title">
      <h2 id="simulator-title">Heart rate zones</h2>
      <p className="muted">
        Example student, age {DEMO_AGE}. Simulated data, not real patient data. The estimated
        maximum heart rate is 220 − age = {DEMO_MAX_BPM} BPM; real maximums vary from person to
        person.
      </p>

      <div role="group" aria-label="Activity level" className="activity-buttons">
        {activityLevels.map((l) => (
          <button
            key={l.id}
            type="button"
            className="activity-button"
            aria-pressed={l.id === levelId}
            onClick={() => setLevelId(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className={`simulator-display level-${level.id}`}>
        <div
          className={paused ? 'sim-heart paused' : 'sim-heart'}
          style={{ '--beat-duration': `${60 / level.bpm}s` }}
          data-testid="sim-heart"
          aria-hidden="true"
        >
          ♥
        </div>

        {/* Announced to screen readers whenever the level changes */}
        <div className="sim-readout" aria-live="polite">
          <p className="visually-hidden" data-testid="sim-summary">
            {level.label} activity: about {level.bpm} beats per minute, {level.zone}.
          </p>
          <p className="sim-bpm" aria-hidden="true">
            <span data-testid="bpm-value">{level.bpm}</span> <span className="sim-unit">BPM</span>
          </p>
          <p className="zone-badge" data-testid="zone-badge">
            {level.zone}
          </p>
          <p className="sim-percent">
            About {percentOfMax}% of estimated maximum · e.g. {level.example.toLowerCase()}
          </p>
          <p className="sim-explanation" data-testid="zone-explanation">
            {level.explanation}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="button button-secondary pause-toggle"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? 'Play heart animation' : 'Pause heart animation'}
      </button>

      <p className="sim-sources">
        Zone ranges based on{' '}
        {sources.map((s, i) => (
          <span key={s.href}>
            {i > 0 && ' and '}
            <a href={s.href} target="_blank" rel="noreferrer">
              {s.label}
              {' '}
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
          </span>
        ))}
        .
      </p>
    </section>
  );
}
