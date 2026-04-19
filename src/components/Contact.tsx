import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section" id="contact">
      <div className="contact-container section-container">
        <div className="contact-watermark section-watermark">06</div>
        <span className="section-label">[ Get In Touch ]</span>
        <h3 className="contact-heading">Contact</h3>

        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <div className="contact-links">
              <a
                href="https://linkedin.com/in/misbahhaque"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                <span className="link-arrow">→</span> LinkedIn
              </a>
              <a href="mailto:misbahul8@gmail.com" data-cursor="disable">
                <span className="link-arrow">→</span> Email
              </a>
              <span className="contact-phone" data-cursor="disable">
                <span className="link-arrow">→</span> +91-8376069521
              </span>
            </div>
          </div>

          <div className="contact-box">
            <h4>Social</h4>
            <div className="contact-social-links">
              <a
                href="https://github.com/Misbah542"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                GitHub <MdArrowOutward className="social-icon" />
              </a>
              <a
                href="https://linkedin.com/in/misbahhaque"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn <MdArrowOutward className="social-icon" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                YouTube <MdArrowOutward className="social-icon" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                Instagram <MdArrowOutward className="social-icon" />
              </a>
            </div>
          </div>

          <div className="contact-box contact-credit">
            <h2>
              Designed and Developed <br /> by <span>Misbah ul Haque</span>
            </h2>
            <div className="contact-copyright">
              <MdCopyright /> 2026 — All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
