import {
  FaGithub,
  FaLinkedinIn,
  FaPhone,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });

    // Animate social icons below when reaching contact section
    const iconsSection = document.querySelector(".icons-section") as HTMLElement;
    if (iconsSection) {
      ScrollTrigger.create({
        trigger: "#contact",
        start: "top 50%",
        end: "top 20%",
        scrub: true,
        onEnter: () => {
          gsap.to(iconsSection, {
            y: 100,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to(iconsSection, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut",
          });
        },
      });
    }
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href="https://github.com/Misbah542"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://linkedin.com/in/misbahhaque"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a
            href="tel:+918376069521"
            rel="noreferrer"
          >
            <FaPhone />
          </a>
        </span>
        <span>
          <a
            href="mailto:misbahul8@gmail.com"
            rel="noreferrer"
          >
            <MdEmail />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href="/MisbahHaque_Resume.pdf"
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
