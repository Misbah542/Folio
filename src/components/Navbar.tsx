import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import ScrollSmoother from "../lib/gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const LINKS = [
  { id: "about", label: "About", index: "01" },
  { id: "career", label: "Career", index: "03" },
  { id: "work", label: "Work", index: "04" },
  { id: "contact", label: "Contact", index: "06" },
];

const Navbar = () => {
  const [active, setActive] = useState<string>("");
  const [docked, setDocked] = useState(false);

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

    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });

    // Dock state + active section marker.
    const dockTrigger = ScrollTrigger.create({
      start: 60,
      end: "max",
      onToggle: (self) => setDocked(self.isActive),
    });

    const sectionTriggers = LINKS.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(id),
      })
    );

    return () => {
      dockTrigger.kill();
      sectionTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div className={`header ${docked ? "header-docked" : ""}`}>
        <a href="/#" className="navbar-title" data-cursor="disable">
          <span className="navbar-mark">MH</span>
          <span className="navbar-name">Misbah ul Haque</span>
        </a>

        <ul>
          {LINKS.map(({ id, label, index }) => (
            <li key={id} className={active === id ? "nav-active" : ""}>
              <a data-href={`#${id}`} href={`#${id}`} data-cursor="disable">
                <span className="nav-index">{index}</span>
                <span className="nav-label">{label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-status">
          <span className="pulse-dot" />
          <span>Open to work</span>
        </div>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
