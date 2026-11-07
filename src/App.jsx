// Route table. Every page renders inside the shared Layout.
import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout';
import HomeView from './views/HomeView';
import ModulesView from './views/ModulesView';
import ModuleView from './views/ModuleView';
import AboutView from './views/AboutView';
import NotFoundView from './views/NotFoundView';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeView />} />
        <Route path="modules" element={<ModulesView />} />
        <Route path="modules/:slug" element={<ModuleView />} />
        <Route path="about" element={<AboutView />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  );
}
