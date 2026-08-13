import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Contact.css";

const CHANNELS = [
  {
    label: "Email",
    value: "misbahul8@gmail.com",
    href: "mailto:misbahul8@gmail.com",
  },
  { label: "Phone", value: "+91 83760 69521", href: "tel:+918376069521" },
  {
    label: "GitHub",
    value: "github.com/Misbah542",
    href: "https://github.com/Misbah542",
    icon: <FaGithub />,
  },
  {
    label: "LinkedIn",
    value: "in/misbahhaque",
    href: "https://linkedin.com/in/misbahhaque",
    icon: <FaLinkedinIn />,
  },
];

const Contact = () => {
  return (
    <div className="contact-section" id="contact">
      <div className="section-container">
        <div className="contact-watermark section-watermark">06</div>
        <div className="contact-container">
          <span className="section-label">Get in touch</span>

          <h2 className="contact-heading">
            Let's build
            <br />
            <em>something</em>
          </h2>

          <a
            className="contact-cta"
            href="mailto:misbahul8@gmail.com"
            data-cursor="disable"
          >
            <span>misbahul8@gmail.com</span>
            <MdArrowOutward />
          </a>

          <div className="contact-grid">
            {CHANNELS.map((c) => (
              <a
                className="contact-channel"
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-cursor="disable"
              >
                <span className="contact-channel-label">{c.label}</span>
                <span className="contact-channel-value">
                  {c.icon}
                  {c.value}
                </span>
              </a>
            ))}
          </div>

          <div className="contact-foot">
            <span className="contact-sign">
              Designed &amp; developed by <b>Misbah ul Haque</b>
            </span>
            <span className="contact-meta">
              <span className="pulse-dot" />
              Bengaluru, IN · © 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
