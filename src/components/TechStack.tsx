const TechStack = () => {
  return (
    <div className="techstack" id="techstack">
      <div className="section-container">
        <div className="techstack-watermark section-watermark">05</div>
        <div className="techstack-container">
          <span className="section-label">[ Tech Stack ]</span>
          <h2>
            My <span className="grad-accent">Android</span> Techstack
          </h2>

          {/* Icons are rendered by TechStackCanvas — they float scattered as
              a background and assemble into a grid under this heading as the
              user scrolls into view. */}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
