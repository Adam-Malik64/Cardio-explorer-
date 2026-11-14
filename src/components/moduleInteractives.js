// Maps a module slug to its interactive screen. Modules not listed here show the
// "coming soon" placeholder on their page (see src/views/ModuleView.jsx).
import HeartExplorerView from '../views/HeartExplorerView';
import PulseModule from './pulse/PulseModule';
import HabitsQuizView from '../views/HabitsQuizView';
import GlossaryView from '../views/GlossaryView';

export const moduleInteractives = {
  'heart-explorer': HeartExplorerView,
  'pulse-simulator': PulseModule,
  'habits-quiz': HabitsQuizView,
  glossary: GlossaryView,
};
