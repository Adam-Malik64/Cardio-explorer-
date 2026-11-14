// Each built module renders its interactive screen at /modules/<slug>; others show "coming soon".
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ModuleView from './ModuleView';
import { modules } from '../content/modules';
import { moduleInteractives } from '../components/moduleInteractives';

afterEach(cleanup);

function renderAt(slug) {
  return render(
    <MemoryRouter initialEntries={[`/modules/${slug}`]}>
      <Routes>
        <Route path="/modules/:slug" element={<ModuleView />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ModuleView routing', () => {
  it('every registered interactive matches a module slug in modules.js', () => {
    const slugs = modules.map((m) => m.slug);
    for (const slug of Object.keys(moduleInteractives)) expect(slugs).toContain(slug);
  });

  it('/modules/habits-quiz shows the quiz instead of the placeholder', () => {
    renderAt('habits-quiz');
    expect(screen.getByRole('heading', { level: 2, name: 'Heart habits quiz' })).toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it('modules without an interactive still show the placeholder', () => {
    const unbuilt = modules.find((m) => !moduleInteractives[m.slug]);
    if (!unbuilt) return; // every module is built
    renderAt(unbuilt.slug);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });
});
