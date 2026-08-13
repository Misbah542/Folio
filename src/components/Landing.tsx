import { PropsWithChildren } from "react";
import "./styles/Landing.css";

/* Short and only two of them, so the strip never runs under the bot. */
const METRICS = [
  { value: "4+", label: "yrs" },
  { value: "50M+", label: "concurrent" },
];

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <span className="landing-label">
            <span className="pulse-dot" />
            Android &amp; Go Engineer — Bengaluru, IN
          </span>
          <h1 className="landing-name">
            MISBAH
            <br />
            <span>UL HAQUE</span>
          </h1>
          <hr className="landing-rule" />
          <p className="landing-blurb">
            I build Android apps that survive prime time — Mobile, TV and the Go
            services behind them.
          </p>
        </div>

        <div className="landing-info">
          <span className="landing-info-tag">// currently</span>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">Building</div>
            <div className="landing-h2-2">Modern</div>
            <div className="landing-h2-3">Android</div>
          </h2>
          <h2 className="landing-info-bottom">
            <div className="landing-h2-info">Apps</div>
            <div className="landing-h2-info-1">Mobile</div>
            <div className="landing-h2-info-2">TV</div>
          </h2>
        </div>

        <div className="landing-metrics">
          {METRICS.map((m) => (
            <span className="landing-metric" key={m.label}>
              <b>{m.value}</b> {m.label}
            </span>
          ))}
        </div>

        <div className="landing-scroll">
          <span>Scroll</span>
          <i />
        </div>
      </div>
      {children}
    </div>
  );
};

export default Landing;
