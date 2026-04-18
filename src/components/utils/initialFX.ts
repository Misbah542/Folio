import SplitText from "../../lib/gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "var(--backgroundColor)",
    duration: 0.5,
    delay: 1,
  });

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  var landingText2 = new SplitText(".landing-h2-info", TextProps);
  var landingText3 = new SplitText(".landing-h2-info-1", TextProps);
  var landingText4 = new SplitText(".landing-h2-1", TextProps);
  var landingText5 = new SplitText(".landing-h2-2", TextProps);
  var landingText6 = new SplitText(".landing-h2-3", TextProps);
  var landingText7 = new SplitText(".landing-h2-4", TextProps);

  LoopText([landingText2, landingText3]);
  LoopText([landingText4, landingText5, landingText6, landingText7]);
}

function LoopText(texts: SplitText[]) {
  var tl = gsap.timeline({ repeat: -1 });
  const delay = 7;

  texts.forEach((_, i) => {
    const nextIndex = (i + 1) % texts.length;
    const current = texts[i];
    const next = texts[nextIndex];

    tl.fromTo(
      current.chars,
      { y: 0, opacity: 1 },
      {
        y: -80,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.05,
      },
      `+= ${delay}`
    ).fromTo(
      next.chars,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.05,
      },
      "<"
    );
  });
}
