// Page-level tests for /modules/pulse-simulator (Issue #2, Stories 1, 2, 5 and 6).
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import PulseModule from './PulseModule';
import ModuleView from '../../views/ModuleView';
import Footer from '../layout/Footer';
import { moduleInteractives } from '../moduleInteractives';

afterEach(cleanup);

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/modules/pulse-simulator']}>
      <Routes>
        <Route path="/modules/:slug" element={<ModuleView />} />
      </Routes>
      <Footer />
    </MemoryRouter>,
  );
}

describe('PulseModule', () => {
  it('shows the "for learning only / not medical advice" notice', () => {
    render(<PulseModule />);
    const note = screen.getByRole('note');
    expect(note).toHaveTextContent(/for learning only/i);
    expect(note).toHaveTextContent(/not medical advice/i);
  });

  it('contains both the pulse practice and the zone simulator', () => {
    render(<PulseModule />);
    expect(screen.getByLabelText(/beats counted in 15 seconds/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Activity level' })).toBeInTheDocument();
  });

  it('is registered for the pulse-simulator slug', () => {
    expect(moduleInteractives['pulse-simulator']).toBe(PulseModule);
  });
});

describe('ModuleView at /modules/pulse-simulator', () => {
  it('renders the pulse module with the on-page notice', () => {
    renderPage();
    expect(screen.getByRole('note')).toHaveTextContent(/not medical advice/i);
    expect(screen.getByRole('button', { name: 'Calculate BPM' })).toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it('the footer shows a not-medical-advice disclaimer', () => {
    renderPage();
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText(/not medical advice/i)).toBeInTheDocument();
  });

  it('Story 5: has exactly one h1', () => {
    renderPage();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('Story 5: section headings "Practice taking your pulse" and "Heart rate zones" are h2s', () => {
    renderPage();
    // Accept UK or US spelling of practise/practice
    expect(screen.getByRole('heading', { level: 2, name: /practi[cs]e taking your pulse/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /heart rate zones/i })).toBeInTheDocument();
  });
});
