import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CARDS = [
  {
    index: "01",
    title: "Android at scale",
    sub: "Kotlin and Compose, shipped to millions",
    body: "Feature work end-to-end on OTT apps — multi-profile platforms, auth flows and engagement SDKs, built on Compose, Hilt, Paging 3 and Coroutines.",
    tags: ["Kotlin", "Jetpack Compose", "Coroutines", "Dagger Hilt", "Paging 3"],
  },
  {
    index: "02",
    title: "TV & playback",
    sub: "Leanback, ExoPlayer, ten-foot UI",
    body: "Player skins, UpNext and continue-watching surfaces rebuilt for Android TV, Google TV, FireStick and set-top boxes, where every frame is budgeted.",
    tags: ["Android TV", "Leanback", "ExoPlayer", "Google TV", "Set-top box"],
  },
  {
    index: "03",
    title: "Go services",
    sub: "The BFF behind the app",
    body: "Proto and API contracts, middleware and BFF endpoints in Go — owning the round trip instead of stopping at the client boundary.",
    tags: ["Go", "gRPC", "Microservices", "REST", "GraphQL"],
  },
  {
    index: "04",
    title: "Performance",
    sub: "Startup, latency, crash-free rate",
    body: "Profiling cold start, trimming response latency and holding a 99.9% crash-free rate through IPL, the Olympics and World Cup traffic peaks.",
    tags: ["Profiler", "Startup", "Caching", "Crashlytics", "R8"],
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
                One product surface rarely ends where the app does. These are the
                four places my work usually lands.
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
                      <p>{card.body}</p>
                      <h5>Stack</h5>
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
