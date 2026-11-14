// Shared page frame: skip link, header, the current page (Outlet) and footer.
// <main> is full width so the landing page can use edge-to-edge sections;
// other views wrap their content in .container themselves.
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
