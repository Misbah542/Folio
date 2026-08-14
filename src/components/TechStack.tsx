import { CSSProperties, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TECH_COUNT, TECH_DOMAINS } from "../data/techSkills";
import "./styles/TechStack.css";

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Each rack reveals on its own trigger, so a long stack never animates
      // rows the reader has already scrolled past.
      gsap.utils.toArray<HTMLElement>(".ts-rack").forEach((rack) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rack,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
        tl.fromTo(
          rack.querySelector(".ts-rack-rule"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "power3.out" },
          0
        )
          .fromTo(
            rack.querySelector(".ts-rack-head"),
            { autoAlpha: 0, x: -18 },
            { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" },
            0.05
          )
          .fromTo(
            rack.querySelectorAll(".ts-item"),
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
              stagger: 0.035,
            },
            0.12
          );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="techstack" id="techstack" ref={rootRef}>
      <div className="section-container">
        <div className="techstack-watermark section-watermark">05</div>

        <div className="ts-head">
          <div className="ts-head-main">
            <span className="section-label">Toolkit</span>
            <h2 className="ts-title">
              The <em>stack</em>
            </h2>
          </div>
          <div className="ts-readout">
            <span className="ts-stat">
              <b>{TECH_COUNT}</b> tools
            </span>
            <span className="ts-stat">
              <b>{TECH_DOMAINS.length}</b> domains
            </span>
            <span className="ts-stat ts-stat-live">
              <i className="pulse-dot" /> in use
            </span>
          </div>
        </div>

        <div className="ts-racks">
          {TECH_DOMAINS.map((domain) => (
            <section className="ts-rack" key={domain.index}>
              <span className="ts-rack-rule" />
              <div className="ts-rack-head">
                <span className="ts-rack-index">{domain.index}</span>
                <h3>{domain.name}</h3>
                <p>{domain.note}</p>
              </div>
              <ul className="ts-rack-items">
                {domain.items.map((tech) => (
                  <li
                    className="ts-item"
                    key={tech.name}
                    style={
                      { "--tech": tech.color ?? domain.hue } as CSSProperties
                    }
                  >
                    <i className="ts-item-dot" />
                    <span className="ts-item-name">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
