import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skill, SkillNames, SKILLS } from "../data/constants";
import { useMediaQuery } from "../hooks/use-media-query";
import {
  KeyboardSection,
  getKeyboardState,
} from "./animated-keyboard-config";
import { useSounds } from "./hooks/use-sounds";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

gsap.registerPlugin(ScrollTrigger);

const AnimatedKeyboard = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<KeyboardSection>("hidden");

  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || activeSection !== "techstack") return;
    if (selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }
    } else {
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        if (selectedSkillRef.current) playReleaseSound();
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
      }
    }
  };

  const handleSplineInteractions = () => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    });

    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    });

    splineApp.addEventListener("mouseHover", handleMouseHover);
  };

  // --- Animation Setup Helpers ---

  const setupScrollAnimations = () => {
    if (!splineApp || !splineContainer.current) {
      console.log("[AnimatedKeyboard] setupScrollAnimations bail: app=", !!splineApp, "container=", !!splineContainer.current);
      return;
    }
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) {
      console.log("[AnimatedKeyboard] setupScrollAnimations bail: keyboard NOT found");
      return;
    }
    console.log("[AnimatedKeyboard] setupScrollAnimations: keyboard found, setting up triggers");

    // Start at hidden state (very small scale, off-screen) — do NOT use kbd.visible
    const hiddenState = getKeyboardState({ section: "hidden", isMobile });
    const careerState = getKeyboardState({ section: "career", isMobile });
    const workState = getKeyboardState({ section: "work", isMobile });
    const techstackState = getKeyboardState({ section: "techstack", isMobile });

    gsap.set(kbd.scale, hiddenState.scale);
    gsap.set(kbd.position, hiddenState.position);
    gsap.set(kbd.rotation, hiddenState.rotation);

    // Career: hidden → career
    gsap.timeline({
      scrollTrigger: {
        trigger: "#career",
        start: "top 80%",
        end: "top 30%",
        scrub: true,
        onEnter: () => setActiveSection("career"),
        onLeaveBack: () => setActiveSection("hidden"),
      },
    })
      .fromTo(kbd.scale, hiddenState.scale, careerState.scale, 0)
      .fromTo(kbd.position, hiddenState.position, careerState.position, 0)
      .fromTo(kbd.rotation, hiddenState.rotation, careerState.rotation, 0);

    // Work: career → work
    gsap.timeline({
      scrollTrigger: {
        trigger: "#work",
        start: "top 80%",
        end: "top 30%",
        scrub: true,
        onEnter: () => setActiveSection("work"),
        onLeaveBack: () => setActiveSection("career"),
      },
    })
      .fromTo(kbd.scale, careerState.scale, workState.scale, 0)
      .fromTo(kbd.position, careerState.position, workState.position, 0)
      .fromTo(kbd.rotation, careerState.rotation, workState.rotation, 0);

    // TechStack: work → techstack
    gsap.timeline({
      scrollTrigger: {
        trigger: "#techstack",
        start: "top 60%",
        end: "top 20%",
        scrub: true,
        onEnter: () => setActiveSection("techstack"),
        onLeaveBack: () => setActiveSection("work"),
      },
    })
      .fromTo(kbd.scale, workState.scale, techstackState.scale, 0)
      .fromTo(kbd.position, workState.position, techstackState.position, 0)
      .fromTo(kbd.rotation, workState.rotation, techstackState.rotation, 0);

    // Contact: techstack → hidden
    gsap.timeline({
      scrollTrigger: {
        trigger: "#contact",
        start: "top 70%",
        end: "top 30%",
        scrub: true,
        onEnter: () => setActiveSection("hidden"),
        onLeaveBack: () => setActiveSection("techstack"),
      },
    })
      .fromTo(kbd.scale, techstackState.scale, hiddenState.scale, 0)
      .fromTo(kbd.position, techstackState.position, hiddenState.position, 0);
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => {}, stop: () => {} };

    let tweens: gsap.core.Tween[] = [];
    const removePrevTweens = () => tweens.forEach((t) => t.kill());

    const start = () => {
      removePrevTweens();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          const t = gsap.to(keycap.position, {
            y: Math.random() * 200 + 200,
            duration: Math.random() * 2 + 2,
            delay: idx * 0.6,
            repeat: -1,
            yoyo: true,
            yoyoEase: "none",
            ease: "elastic.out(1,0.3)",
          });
          tweens.push(t);
        });
    };

    const stop = () => {
      removePrevTweens();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        const t = gsap.to(keycap.position, {
          y: 0,
          duration: 4,
          repeat: 1,
          ease: "elastic.out(1,0.7)",
        });
        tweens.push(t);
      });
      setTimeout(removePrevTweens, 1000);
    };

    return { start, stop };
  };

  // --- Effects ---

  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    setupScrollAnimations();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      keycapAnimationsRef.current?.stop();
    };
  }, [splineApp, isMobile]);

  useEffect(() => {
    if (!splineApp) return;
    const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight = splineApp.findObjectByName("text-mobile");

    if (
      !textDesktopDark ||
      !textDesktopLight ||
      !textMobileDark ||
      !textMobileLight
    )
      return;

    const hideAll = () => {
      textDesktopDark.visible = false;
      textDesktopLight.visible = false;
      textMobileDark.visible = false;
      textMobileLight.visible = false;
    };

    if (activeSection !== "techstack") {
      hideAll();
    } else {
      hideAll();
      if (isMobile) {
        textMobileLight.visible = true;
      } else {
        textDesktopLight.visible = true;
      }
    }
  }, [splineApp, isMobile, activeSection]);

  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true,
      });
    }

    const manageAnimations = async () => {
      if (activeSection !== "techstack") {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      if (activeSection === "career") {
        rotateKeyboard?.restart();
      } else {
        rotateKeyboard?.pause();
      }

      keycapAnimationsRef.current?.stop();
    };

    manageAnimations();

    return () => {
      rotateKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  // Update Spline variables when a skill is selected
  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill, splineApp]);

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none">
      <Suspense fallback={null}>
        <Spline
          className="w-full h-full"
          ref={splineContainer}
          style={{ pointerEvents: activeSection === "techstack" ? "auto" : "none" }}
          onLoad={(app: Application) => {
            console.log("[AnimatedKeyboard] Spline loaded");
            const kbd = app.findObjectByName("keyboard");
            console.log("[AnimatedKeyboard] keyboard object:", kbd ? "FOUND" : "NOT FOUND");
            const allObjects = app.getAllObjects();
            console.log("[AnimatedKeyboard] all objects:", allObjects.map(o => o.name));
            setSplineApp(app);
          }}
          scene="/models/skills-keyboard.spline"
        />
      </Suspense>
    </div>
  );
};

export default AnimatedKeyboard;
