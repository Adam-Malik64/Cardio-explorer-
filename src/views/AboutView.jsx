// /about: what the project is, plus the educational-use disclaimer.
export default function AboutView() {
  return (
    <div className="container page">
      <header className="page-header">
        <h1>About</h1>
        <p className="lead">Cardio Explorer is a learning site about heart health.</p>
      </header>
      <section className="card">
        <p className="placeholder-note">Project description coming soon.</p>
        <p>
          The information here is for education only. It does not replace advice from a doctor,
          nurse or other healthcare professional.
        </p>
      </section>
    </div>
  );
}
