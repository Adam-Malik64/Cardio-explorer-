// Guided pulse-counting practice (Issue #2, Story 1).
// Students find their wrist pulse, optionally run a 15-second timer, type their count and
// see it turned into beats per minute. Nothing typed is stored or sent anywhere.
import { useEffect, useId, useState } from 'react';
import { checkPulseCount, COUNT_SECONDS, MULTIPLIER } from './pulseCount';

export default function PulseCounter() {
  const id = useId();
  const inputId = `${id}-count`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const [secondsLeft, setSecondsLeft] = useState(COUNT_SECONDS);
  const [running, setRunning] = useState(false);
  const [timerStatus, setTimerStatus] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Tick once a second while running.
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [running]);

  // Stop and announce when time is up.
  useEffect(() => {
    if (running && secondsLeft === 0) {
      setRunning(false);
      setTimerStatus("Time's up. Enter your count.");
    }
  }, [running, secondsLeft]);

  // One toggle button (same element) so keyboard focus never jumps.
  function toggleTimer() {
    if (running) {
      setRunning(false);
      setSecondsLeft(COUNT_SECONDS);
      setTimerStatus('Timer stopped.');
    } else {
      setSecondsLeft(COUNT_SECONDS);
      setRunning(true);
      setTimerStatus('Counting started');
    }
  }

  // Clears the timer, input, error and result together (handy for a teacher-led demo).
  function resetAll() {
    setRunning(false);
    setSecondsLeft(COUNT_SECONDS);
    setValue('');
    setError('');
    setResult(null);
    setTimerStatus('Practice reset.');
  }

  function handleChange(event) {
    setValue(event.target.value);
    setResult(null); // never show a stale BPM next to a new count
  }

  function handleSubmit(event) {
    event.preventDefault();
    const check = checkPulseCount(value);
    if (check.ok) {
      setError('');
      setResult(check);
    } else {
      setResult(null);
      setError(check.error);
    }
  }

  return (
    <section className="card pulse-counter" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Practice taking your pulse</h2>

      <ol className="pulse-steps">
        <li>
          Find your pulse on the inside of your wrist, just below your thumb. Use two fingers, not
          your thumb, and press gently.
        </li>
        <li>Press Start and count the beats you feel until the timer stops.</li>
        <li>Type your count in the box.</li>
        <li>Press Calculate BPM to see your beats per minute.</li>
      </ol>
      <p className="muted">
        If you feel dizzy or unwell, stop and tell a teacher or another trusted adult.
      </p>

      <div className="pulse-timer">
        <p className="pulse-timer-display" data-testid="timer-display">
          <span className="pulse-timer-number">{secondsLeft}</span> seconds left
        </p>
        <button type="button" className="button" onClick={toggleTimer} aria-pressed={running}>
          {running ? 'Stop timer' : `Start ${COUNT_SECONDS}-second count`}
        </button>
        {/* Announces start / stop / finish only, not every second */}
        <p className="visually-hidden" aria-live="polite" data-testid="timer-status">
          {timerStatus}
        </p>
      </div>

      <form className="pulse-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId}>Beats counted in {COUNT_SECONDS} seconds</label>
        <p id={hintId} className="pulse-hint">
          Type a whole number, for example 18. The timer is optional.
        </p>
        <div className="pulse-form-row">
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            onChange={handleChange}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          />
          <button type="submit" className="button">
            Calculate BPM
          </button>
        </div>
        {error && (
          <p id={errorId} className="pulse-error" role="alert">
            <span aria-hidden="true">⚠ </span>
            {error}
          </p>
        )}
      </form>

      <div aria-live="polite" data-testid="pulse-result">
        {result && (
          <div className="pulse-result">
            <p className="pulse-result-bpm">
              {result.count} × {MULTIPLIER} = <strong>{result.bpm}</strong> beats per minute
            </p>
            <p className="muted">
              This is a practice estimate. Counting mistakes are common. It is not a medical
              measurement.
            </p>
          </div>
        )}
      </div>

      <button type="button" className="button button-secondary pulse-reset" onClick={resetAll}>
        Reset
      </button>
    </section>
  );
}
