// /about: what Cardio Explorer is, who made it, where its data comes from, and the disclaimer.
import { Link } from 'react-router';
import { modules } from '../content/modules';
import { DISCLAIMER } from '../content/disclaimer';

export default function AboutView() {
  return (
    <div className="container page about">
      <header className="page-header">
        <h1>About Cardio Explorer</h1>
        <p className="lead">
          An interactive heart health learning site for middle and high school students and their
          teachers.
        </p>
      </header>

      <section className="card" aria-labelledby="about-what">
        <h2 id="about-what">What it is</h2>
        <p>
          Cardio Explorer turns the heart, blood flow and heart-healthy habits into things you can
          click, test and explore. It has four modules:
        </p>
        <ul className="about-modules">
          {modules.map((m) => (
            <li key={m.slug}>
              <Link to={`/modules/${m.slug}`}>{m.title}</Link>: {m.summary}
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="about-project">
        <h2 id="about-project">A student learning project</h2>
        <p>
          Cardio Explorer is a student learning project, built while learning web development
          with AI-assisted tools. It is not made by doctors and is not a clinical or official
          health product. Facts are summarised from reputable sources such as the World Health
          Organization (WHO), the American Heart Association (AHA), the CDC and the NHLBI, and each
          module links to the sources it uses.
        </p>
      </section>

      <section className="card" aria-labelledby="about-data">
        <h2 id="about-data">All data is synthetic</h2>
        <p>
          Every number, heart rate, quiz question and example in this app is synthetic, fake demo
          data created for learning. None of it comes from real patients or real people.
        </p>
        <p>
          The app has no accounts and does not save, track or send anything you type, such as a
          pulse count or a search.
        </p>
      </section>

      <section className="card about-disclaimer" aria-labelledby="about-disclaimer">
        <h2 id="about-disclaimer">Important</h2>
        <p className="disclaimer-text" data-testid="about-disclaimer">
          {DISCLAIMER}
        </p>
        <p>
          If you have questions about your own heart health, talk to a parent or carer, a school
          nurse, or a doctor.
        </p>
      </section>
    </div>
  );
}
