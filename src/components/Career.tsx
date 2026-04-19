import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <div className="career-watermark section-watermark section-watermark-violet">03</div>
        <span className="section-label section-label-muted">[ Experience ]</span>
        <h2>
          My career <span>&amp;</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SDE II — Android</h4>
                <h5>Star India Pvt Ltd — Disney + Hotstar</h5>
              </div>
              <h3>2025–Present</h3>
            </div>
            <p>
              Leading end-to-end development of high-traffic feature screens,
              optimising rendering and data flow to reduce load times by 45%.
              Integrated Engage SDK across Mobile and TV platforms, and
              architected modular systems using Hilt, Paging 3, and Retrofit.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SDE II — Android</h4>
                <h5>Viacom Media Pvt Ltd — JioCinema</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Optimised app startup by 60% using Content Provider and Android
              Startup Library. Built Contextual Continue Watching and enhanced
              UpNext playback, contributing to a 25% increase in user
              engagement. Led production stability for IPL 2024 and Olympics.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SDE I — Android</h4>
                <h5>Viacom Media Pvt Ltd — JioCinema</h5>
              </div>
              <h3>2022–24</h3>
            </div>
            <p>
              Led the refactoring and redesign of the Player Skin for Android TV,
              achieving a 40% reduction in rendering time. Developed Login with
              QR Code and supported high-concurrency events like FIFA World Cup
              2022 and IPL 2023.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
