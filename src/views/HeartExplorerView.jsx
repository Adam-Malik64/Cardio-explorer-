// 4-Chamber Heart & Blood Flow Explorer (Issue #1), shown on /modules/heart-explorer.
// Part 1: a simplified diagram of buttons; select a chamber or valve to read its job.
// Part 2: a step-by-step tour of one trip around the double loop. Nothing moves on its own,
// and oxygen status is always written in words, not shown by colour alone.
import { useId, useState } from 'react';
import { parts, sources, tourSteps } from '../mocks/heartExplorer';

const bloodLabel = { 'oxygen-poor': 'Oxygen-poor blood', 'oxygen-rich': 'Oxygen-rich blood' };

export default function HeartExplorerView() {
  const id = useId();
  const [selectedId, setSelectedId] = useState(parts[0].id);
  const [step, setStep] = useState(0);

  const selected = parts.find((p) => p.id === selectedId);
  const current = tourSteps[step];
  const atStart = step === 0;
  const atEnd = step === tourSteps.length - 1;

  return (
    <div className="explorer">
      <section className="card" aria-labelledby={`${id}-parts`}>
        <h2 id={`${id}-parts`}>Explore the chambers and valves</h2>
        <p className="muted">
          This is a simplified diagram, not to scale. It shows the heart as if you are facing
          someone, so <strong>the heart’s right side is on your left</strong>.
        </p>

        <div className="explorer-layout">
          <div className="heart-diagram" role="group" aria-label="Heart diagram: chambers and valves">
            <p className="heart-side-label" aria-hidden="true">
              Heart’s right side
            </p>
            <p className="heart-side-label" aria-hidden="true">
              Heart’s left side
            </p>
            {parts.map((p) => (
              <button
                key={p.id}
                type="button"
                className={[
                  'heart-part',
                  `heart-part-${p.kind}`,
                  `blood-${p.blood}`,
                  current.part === p.id ? 'is-tour-step' : '',
                ].join(' ')}
                aria-label={`${p.name}, ${p.blood}${current.part === p.id ? ', blood is here' : ''}`}
                aria-pressed={p.id === selectedId}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="heart-part-name">{p.name}</span>
                <span className="heart-part-blood">{p.blood}</span>
                {current.part === p.id && (
                  <span className="heart-part-here">Blood is here</span>
                )}
              </button>
            ))}
          </div>

          <div className="explorer-panel" aria-live="polite" data-testid="part-panel">
            <h3>{selected.name}</h3>
            <p className="eyebrow">
              {selected.kind === 'chamber' ? 'Chamber' : 'Valve'} · {selected.side} side ·{' '}
              {bloodLabel[selected.blood]}
            </p>
            <p>
              <strong>Its job:</strong> {selected.job}
            </p>
            <p>
              <strong>Blood goes next:</strong> {selected.next}
            </p>
          </div>
        </div>

        <p className="explorer-note">
          Diagrams colour oxygen-poor blood blue and oxygen-rich blood red to tell them apart. Real
          blood is always red: oxygen-poor blood is just a darker red.
        </p>
      </section>

      <section className="card" aria-labelledby={`${id}-tour`}>
        <h2 id={`${id}-tour`}>Follow the blood</h2>
        <p className="eyebrow" data-testid="tour-progress">
          Step {step + 1} of {tourSteps.length}
        </p>

        <div className="tour-step" aria-live="polite" data-testid="tour-step">
          <p className="tour-where">
            <strong>{current.part ? parts.find((p) => p.id === current.part).name : current.place}</strong>
            {' · '}
            {current.loop}
          </p>
          <p>{current.text}</p>
          <p className="tour-blood">Blood: {current.blood}</p>
        </div>

        {/* aria-disabled (not disabled) keeps keyboard focus on the button at either end */}
        <div className="tour-controls">
          <button
            type="button"
            className="button button-secondary"
            aria-disabled={atStart}
            onClick={() => !atStart && setStep((s) => s - 1)}
          >
            Previous step
          </button>
          <button
            type="button"
            className="button"
            aria-disabled={atEnd}
            onClick={() => !atEnd && setStep((s) => s + 1)}
          >
            Next step
          </button>
          <button type="button" className="button button-secondary" onClick={() => setStep(0)}>
            Start again
          </button>
        </div>
        <p className="muted">
          The highlighted part in the diagram above shows where the blood is now.
        </p>
      </section>

      <p className="explorer-sources muted">
        Sources:{' '}
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
        . For learning only, not medical advice.
      </p>
    </div>
  );
}
