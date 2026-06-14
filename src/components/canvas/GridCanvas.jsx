// src/components/canvas/GridCanvas.jsx
// Dotted-grid section wrapper — the dark canvas backdrop.
export function GridCanvas({ children, className = "" }) {
  return (
    <section className={`relative overflow-hidden bg-ink ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,#05080a_100%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-24">{children}</div>
    </section>
  );
}

export default GridCanvas;
