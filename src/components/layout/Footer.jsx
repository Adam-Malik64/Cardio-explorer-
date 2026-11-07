// Site footer with the "not medical advice" disclaimer.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          Cardio Explorer is for education only and is not medical advice. Talk to a healthcare
          professional about your own heart health. In an emergency, call your local emergency number.
        </p>
        <p className="muted">© {new Date().getFullYear()} Cardio Explorer</p>
      </div>
    </footer>
  );
}
