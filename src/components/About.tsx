import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-watermark section-watermark section-watermark-violet">01</div>
      <div className="about-me">
        <span className="section-label section-label-muted">[ About Me ]</span>
        <h2 className="about-heading">About</h2>
        <hr className="about-rule" />
        <p className="para">
          I'm a dedicated Android Developer specializing in building
          high-performance, user-centric mobile applications. With expertise in
          Kotlin, Jetpack Compose, and Material Design, I focus on crafting
          seamless experiences that push the boundaries of the Android platform.
          I'm passionate about architecting scalable solutions and ensuring
          smooth performance, delivering robust software that users truly enjoy.
        </p>
        <div className="about-stats">
          <span className="stat-pill">4+ Years</span>
          <span className="stat-pill">3 Roles</span>
        </div>
      </div>
    </div>
  );
};

export default About;
