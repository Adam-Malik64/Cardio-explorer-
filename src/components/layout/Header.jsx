// Site header: brand link plus main navigation, which collapses into a menu button on small screens.
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/modules', label: 'Modules', end: false },
  { to: '/about', label: 'About', end: false },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the user navigates (adjusting state during render,
  // per https://react.dev/learn/you-might-not-need-an-effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">♥</span>
          Cardio Explorer
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span className="menu-icon" aria-hidden="true" />
        </button>

        <nav id="main-nav" aria-label="Main" className={menuOpen ? 'site-nav open' : 'site-nav'}>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
