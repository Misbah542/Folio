import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import ScrollSmoother from "../lib/gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (section) {
            smoother.scrollTo(section, true, "top top");
          }
        }
      });
    });

    const navTriggers: ReturnType<typeof ScrollTrigger.create>[] = [];
    const lightSections = ['#about', '.career-section', '.techstack'];
    lightSections.forEach((selector) => {
      const st = ScrollTrigger.create({
        trigger: selector,
        start: 'top 80px',
        end: 'bottom 80px',
        onEnter: () => {
          document.querySelector('.header')?.classList.add('nav-on-light');
          document.querySelector('.icons-section')?.classList.add('nav-on-light');
        },
        onLeave: () => {
          document.querySelector('.header')?.classList.remove('nav-on-light');
          document.querySelector('.icons-section')?.classList.remove('nav-on-light');
        },
        onEnterBack: () => {
          document.querySelector('.header')?.classList.add('nav-on-light');
          document.querySelector('.icons-section')?.classList.add('nav-on-light');
        },
        onLeaveBack: () => {
          document.querySelector('.header')?.classList.remove('nav-on-light');
          document.querySelector('.icons-section')?.classList.remove('nav-on-light');
        },
      });
      navTriggers.push(st);
    });

    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });

    return () => {
      navTriggers.forEach((st) => st.kill());
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          MH
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
