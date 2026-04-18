import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hi there, I'm</h2>
            <h1 className="landing-name">
              MISBAH
              <br />
              <span>UL HAQUE</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Android Developer</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Building</div>
              <div className="landing-h2-2">Modern</div>
            </h2>
            <h2 className="landing-info-bottom">
              <div className="landing-h2-info">Android</div>
              <div className="landing-h2-info-1">Apps</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
