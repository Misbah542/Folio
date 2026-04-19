import { MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section" id="contact">
      <div className="section-container">
        <div className="contact-watermark section-watermark">06</div>
        <div className="contact-container">
          <span className="section-label">[ Get In Touch ]</span>
          <h3 className="contact-heading">Contact</h3>

          <div className="contact-flex">
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
    </div>
  );
};

export default Contact;
