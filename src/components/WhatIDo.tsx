import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CARDS = [
  {
    index: "01",
    title: "Own the feature",
    sub: "Contract to rollout, not just the screen",
    tags: ["Kotlin", "Compose", "Retrofit"],
  },
  {
    index: "02",
    title: "The ten-foot screen",
    sub: "Player skins and TV navigation, frame by frame",
    tags: ["Leanback", "ExoPlayer", "Android TV"],
  },
  {
    index: "03",
    title: "Frameworks to build on",
    sub: "A shared UI layer instead of duplicated view logic",
    tags: ["MVVM", "Dagger Hilt", "Paging 3"],
  },
  {
    index: "04",
    title: "Hold under load",
    sub: "50M+ concurrent, 99.9% crash-free",
    tags: ["Profiler", "Crashlytics", "Mux"],
  },
];

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);

  return (
    <div className="whatIDO">
      <div className="section-container">
        <div className="what-watermark section-watermark">02</div>
        <div className="what-container">
          <div className="what-flex">
            <div className="what-box">
              <span className="section-label">What I do</span>
              <h2 className="title">
                Four
                <div>fronts</div>
              </h2>
              <p className="what-lede">
                The four places my work usually lands.
              </p>
            </div>

            <div className="what-box">
              <div className="what-box-in">
                {CARDS.map((card, i) => (
                  <div
                    className="what-content what-noTouch"
                    key={card.index}
                    ref={(el) => setRef(el, i)}
                  >
                    <div className="what-corner"></div>
                    <div className="what-content-in">
                      <span className="what-index">{card.index}</span>
                      <h3>{card.title}</h3>
                      <h4>{card.sub}</h4>
                      <div className="what-content-flex">
                        {card.tags.map((tag) => (
                          <div className="what-tags" key={tag}>
                            {tag}
                          </div>
                        ))}
                      </div>
                      <div className="what-arrow"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);
    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
