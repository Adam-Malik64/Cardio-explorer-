// Everything shown on /modules/pulse-simulator (Issue #2): the education-only notice,
// the pulse-counting practice and the heart rate zone simulator.
import PulseCounter from './PulseCounter';
import PulseSimulator from './PulseSimulator';

export default function PulseModule() {
  return (
    <div className="pulse-module">
      <p className="edu-notice" role="note">
        <strong>For learning only.</strong> This page uses simulated numbers and practice
        estimates. It is not medical advice and cannot tell you anything about your own health.
      </p>
      <PulseCounter />
      <PulseSimulator />
    </div>
  );
}
