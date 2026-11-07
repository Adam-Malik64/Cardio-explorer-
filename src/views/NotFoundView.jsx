// Shown for any unknown URL, and for module pages whose slug does not exist.
import { Link } from 'react-router';

export default function NotFoundView() {
  return (
    <section className="page-shell">
      <h1>Page not found</h1>
      <p className="lead">We couldn't find that page.</p>
      <Link to="/" className="button">
        Go to the home page
      </Link>
    </section>
  );
}
