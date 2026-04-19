import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <span className="landing-label">[ Android Developer ]</span>
            <h1 className="landing-name">
              MISBAH
              <br />
              <span>UL HAQUE</span>
            </h1>
            <hr className="landing-rule" />
          </div>
          <div className="landing-info">
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
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
