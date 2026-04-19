import React, { Suspense, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section, getKeyboardState } from "./keyboard-config";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedKeyboard() {
  const isMobile = window.innerWidth <= 1024;
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Delay loading the heavy Spline engine by 1.5 seconds so text and initial animations can finish first
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Expose pointer events ONLY when in techstack section so it doesn't block scrolling above
  const isInteractive = activeSection === "techstack";

  useEffect(() => {
    if (!splineApp) return;

    const triggers: ScrollTrigger[] = [];

    const createSectionTimeline = (
      triggerId: string,
      targetSection: Section,
      prevSection: Section | null,
      start: string = "top 50%",
      end: string = "bottom bottom"
    ) => {
      const kbd = splineApp.findObjectByName("keyboard");
      if (!kbd) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerId,
          start,
          end,
          scrub: true,
          onEnter: () => {
            setActiveSection(targetSection);
            kbd.visible = true;
            const state = getKeyboardState({ section: targetSection, isMobile });
            gsap.to(kbd.scale, { ...state.scale, duration: 1, overwrite: "auto" });
            gsap.to(kbd.position, { ...state.position, duration: 1, overwrite: "auto" });
            gsap.to(kbd.rotation, { ...state.rotation, duration: 1, overwrite: "auto" });
          },
          onEnterBack: () => {
            setActiveSection(targetSection);
            kbd.visible = true;
            const state = getKeyboardState({ section: targetSection, isMobile });
            gsap.to(kbd.scale, { ...state.scale, duration: 1, overwrite: "auto" });
            gsap.to(kbd.position, { ...state.position, duration: 1, overwrite: "auto" });
            gsap.to(kbd.rotation, { ...state.rotation, duration: 1, overwrite: "auto" });
          },
          onLeaveBack: () => {
            if (prevSection) {
              setActiveSection(prevSection);
              const state = getKeyboardState({ section: prevSection, isMobile });
              gsap.to(kbd.scale, { ...state.scale, duration: 1, overwrite: "auto" });
              gsap.to(kbd.position, { ...state.position, duration: 1, overwrite: "auto" });
              gsap.to(kbd.rotation, { ...state.rotation, duration: 1, overwrite: "auto" });
            } else {
              setActiveSection(null);
              kbd.visible = false;
            }
          },
        },
      });

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    };

    const kbd = splineApp.findObjectByName("keyboard");
    if (kbd) {
      createSectionTimeline("#career", "career", null);
      createSectionTimeline("#work", "work", "career", "top 70%");
      createSectionTimeline("#techstack", "techstack", "work", "top 30%");
      
      // Force ScrollTrigger to evaluate the current scroll position immediately
      setTimeout(() => {
        ScrollTrigger.refresh();
        const careerEl = document.querySelector("#career");
        if (careerEl) {
          const rect = careerEl.getBoundingClientRect();
          if (rect.top > window.innerHeight / 2) {
            kbd.visible = false;
          } else {
            kbd.visible = true;
          }
        }
      }, 100);
    }

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [splineApp, isMobile]);

  if (!shouldLoad) return null;

  return (
    <div 
      className={`fixed inset-0 z-0 ${isInteractive ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
    >
      <Suspense fallback={null}>
        <Spline
          ref={splineContainer}
          onLoad={(app: Application) => setSplineApp(app)}
          scene="/models/skills-keyboard.spline"
        />
      </Suspense>
    </div>
  );
}
