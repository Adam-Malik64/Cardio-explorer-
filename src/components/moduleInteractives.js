// Maps a module slug to its interactive screen. Modules not listed here show the
// "coming soon" placeholder on their page (see src/views/ModuleView.jsx).
import PulseModule from './pulse/PulseModule';
import HabitsQuizView from '../views/HabitsQuizView';
import GlossaryView from '../views/GlossaryView';

export const moduleInteractives = {
  'pulse-simulator': PulseModule,
  'habits-quiz': HabitsQuizView,
  glossary: GlossaryView,
};
