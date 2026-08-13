const TechStack = () => {
  return (
    <div className="techstack" id="techstack">
      <div className="section-container">
        <div className="techstack-watermark section-watermark">05</div>
        <div className="techstack-container">
          <div className="techstack-head">
            <span className="section-label">Toolkit</span>
            <h2>
              The <span className="grad-accent">stack</span>
            </h2>
            <p className="techstack-note">
              Scattered across the page until you get here — scroll and it
              assembles.
            </p>
          </div>

          {/* Icons render in TechStackCanvas: they drift as a background layer
              and lock into a grid under this heading on scroll. */}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
