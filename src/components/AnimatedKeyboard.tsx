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

  // Expose pointer events ONLY when in techstack section so it doesn't block scrolling above
  const isInteractive = activeSection === "techstack";

  useEffect(() => {
    if (!splineApp) return;

    const createSectionTimeline = (
      triggerId: string,
      targetSection: Section,
      prevSection: Section | null,
      start: string = "top 50%",
      end: string = "bottom bottom"
    ) => {
      const kbd = splineApp.findObjectByName("keyboard");
      if (!kbd) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: triggerId,
          start,
          end,
          scrub: true,
          onEnter: () => {
            setActiveSection(targetSection);
            kbd.visible = true;
            const state = getKeyboardState({ section: targetSection, isMobile });
            gsap.to(kbd.scale, { ...state.scale, duration: 1 });
            gsap.to(kbd.position, { ...state.position, duration: 1 });
            gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
          },
          onLeaveBack: () => {
            if (prevSection) {
              setActiveSection(prevSection);
              const state = getKeyboardState({ section: prevSection, isMobile });
              gsap.to(kbd.scale, { ...state.scale, duration: 1 });
              gsap.to(kbd.position, { ...state.position, duration: 1 });
              gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
            } else {
              setActiveSection(null);
              kbd.visible = false;
            }
          },
        },
      });
    };

    const kbd = splineApp.findObjectByName("keyboard");
    if (kbd) {
      kbd.visible = false; // Hidden initially
      createSectionTimeline("#career", "career", null);
      createSectionTimeline("#work", "work", "career", "top 70%");
      createSectionTimeline("#techstack", "techstack", "work", "top 30%");
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [splineApp, isMobile]);

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
