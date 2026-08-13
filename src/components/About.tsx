import "./styles/About.css";

const FACTS = [
  { k: "Now", v: "SDE II · Disney+ Hotstar" },
  { k: "Stack", v: "Kotlin · Compose · Go" },
  { k: "Surfaces", v: "Mobile · TV · BFF" },
  { k: "Base", v: "Bengaluru, IN" },
];

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="section-container">
        <div className="about-watermark section-watermark">01</div>
        <div className="about-container">
          <div className="about-me">
            <span className="section-label">About</span>
            <h2 className="about-heading">
              Ships for
              <br />
              <em>millions</em>
            </h2>
            <hr className="about-rule" />
            <p className="para">
              I'm an Android and Go engineer with 4+ years spent on streaming at
              scale — Android Mobile, Android TV and the Go BFF services that
              feed them. Most of my work lives where{" "}
              <strong>UI polish meets hard performance budgets</strong>: startup
              time, frame pacing, memory, and staying crash-free through IPL
              finals and World Cup nights.
            </p>
            <p className="para">
              Lately that has meant owning features end-to-end — proto and API
              contracts, backend implementation, client integration and rollout
              — rather than stopping at the app boundary.
            </p>

            <dl className="about-facts">
              {FACTS.map((f) => (
                <div className="about-fact" key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
