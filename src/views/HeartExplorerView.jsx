// 4-Chamber Heart & Blood Flow Explorer (Issue #1), shown on /modules/heart-explorer.
// Part 1: a simplified diagram of buttons; select a chamber or valve to read its job.
// Part 2: an optional step-by-step tour of one trip around the double loop. Nothing moves on
// its own, and oxygen status is always written in words, not shown by colour alone.
import { useId, useRef, useState } from 'react';
import { SourceList } from '../components/ExternalLink';
import { parts, sources, tourSteps } from '../mocks/heartExplorer';

const bloodLabel = { 'oxygen-poor': 'Oxygen-poor blood', 'oxygen-rich': 'Oxygen-rich blood' };

export default function HeartExplorerView() {
  const id = useId();
  const [selectedId, setSelectedId] = useState(null);
  const [touring, setTouring] = useState(false);
  const [step, setStep] = useState(0);
  const tourHeadingRef = useRef(null);
  const startRef = useRef(null);

  const selected = parts.find((p) => p.id === selectedId);
  const current = tourSteps[step];
  const tourPart = touring ? current.part : null;
  const atStart = step === 0;
  const atEnd = step === tourSteps.length - 1;

  function startTour() {
    setStep(0);
    setTouring(true);
    // Focus the tour's first step once it renders
    requestAnimationFrame(() => tourHeadingRef.current?.focus());
  }

  function exitTour() {
    setTouring(false);
    requestAnimationFrame(() => startRef.current?.focus());
  }

  return (
    <div className="explorer">
      <section className="card" aria-labelledby={`${id}-parts`}>
        <h2 id={`${id}-parts`}>Explore the chambers and valves</h2>
        <p className="muted">
          This is a simplified diagram, not to scale. It shows the heart as if you are facing
          someone, so <strong>the heart’s right side is on your left</strong>. The pulmonary and
          aortic valves are drawn at the top because blood leaves the ventricles upwards through
          them.
        </p>

        <div className="explorer-layout">
          <div className="heart-diagram" role="group" aria-label="Heart diagram: chambers and valves">
            <p className="heart-side-label heart-side-right" aria-hidden="true">
              Heart’s right side
            </p>
            <p className="heart-side-label heart-side-left" aria-hidden="true">
              Heart’s left side
            </p>
            {parts.map((p) => (
              <button
                key={p.id}
                type="button"
                style={{ gridArea: p.gridArea }}
                className={[
                  'heart-part',
                  `heart-part-${p.kind}`,
                  `blood-${p.blood}`,
                  tourPart === p.id ? 'is-tour-step' : '',
                ].join(' ')}
                aria-label={`${p.name}, ${p.blood}${tourPart === p.id ? ', blood is here' : ''}`}
                aria-pressed={p.id === selectedId}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="heart-part-name">{p.name}</span>
                <span className="heart-part-blood">{p.blood}</span>
                {tourPart === p.id && <span className="heart-part-here">Blood is here</span>}
              </button>
            ))}
          </div>

          <div className="explorer-panel" aria-live="polite" data-testid="part-panel">
            {selected ? (
              <>
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
              </>
            ) : (
              <p className="explorer-prompt">
                Choose a chamber or valve in the diagram to see what it does.
              </p>
            )}
          </div>
        </div>

        <p className="explorer-note">
          Diagrams colour oxygen-poor blood blue and oxygen-rich blood red to tell them apart. Real
          blood is always red: oxygen-poor blood is just a darker red.
        </p>
      </section>

      <section className="card" aria-labelledby={`${id}-tour`}>
        <h2 id={`${id}-tour`}>Follow the blood</h2>

        {!touring ? (
          <>
            <p>
              Take a step-by-step tour of one trip around the body: through the right side of the
              heart, the lungs, the left side of the heart and the body.
            </p>
            <button type="button" className="button" onClick={startTour} ref={startRef}>
              Start the tour
            </button>
          </>
        ) : (
          <>
            <h3 className="eyebrow" data-testid="tour-progress" ref={tourHeadingRef} tabIndex={-1}>
              Step {step + 1} of {tourSteps.length}
            </h3>

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
              <button type="button" className="button button-secondary" onClick={exitTour}>
                Exit tour
              </button>
            </div>
            <p className="muted">The diagram above marks where the blood is now.</p>
          </>
        )}

        <details className="tour-summary">
          <summary>Read the whole blood path as text</summary>
          <ol>
            {tourSteps.map((s) => (
              <li key={s.text}>
                {s.text} <span className="muted">({s.loop}; blood: {s.blood})</span>
              </li>
            ))}
          </ol>
        </details>
      </section>

      <p className="explorer-sources muted">
        Sources: <SourceList items={sources} />. For learning only, not medical advice.
      </p>
    </div>
  );
}
