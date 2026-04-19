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

  const topWords = [
    new SplitText(".landing-h2-1", TextProps), // Building
    new SplitText(".landing-h2-2", TextProps), // Modern
    new SplitText(".landing-h2-3", TextProps), // Android
  ];
  const botWords = [
    new SplitText(".landing-h2-info", TextProps),   // Apps
    new SplitText(".landing-h2-info-1", TextProps), // Mobile
    new SplitText(".landing-h2-info-2", TextProps), // TV
  ];

  // Synchronised sequence — pairs index into the unique top / bottom words.
  // The first entry is the state the user sees first (Modern Apps). After
  // the last step ([0,0] → [1,0]) the timeline loops back to the first
  // transition seamlessly.
  //   Modern Apps → Android Mobile → Android TV → Building Apps → (loop)
  const sequence: [number, number][] = [
    [1, 0],
    [2, 1],
    [2, 2],
    [0, 0],
  ];

  RevolvePairs(topWords, botWords, sequence);
}

function RevolvePairs(
  topWords: SplitText[],
  botWords: SplitText[],
  sequence: [number, number][]
) {
  const [startTop, startBot] = sequence[0];

  // Park everything that isn't in the first step below its slot.
  topWords.forEach((t, i) => {
    if (i !== startTop) gsap.set(t.chars, { y: 60, opacity: 0 });
  });
  botWords.forEach((b, i) => {
    if (i !== startBot) gsap.set(b.chars, { y: 60, opacity: 0 });
  });

  const tl = gsap.timeline({ repeat: -1 });
  const hold = 1.1;
  const outDur = 0.65;
  const inDur = 0.7;
  const stagger = 0.018;

  sequence.forEach((_, i) => {
    const nextI = (i + 1) % sequence.length;
    const [curT, curB] = sequence[i];
    const [nxtT, nxtB] = sequence[nextI];

    const topChanges = curT !== nxtT;
    const botChanges = curB !== nxtB;
    if (!topChanges && !botChanges) return;

    const label = `step${i}`;
    tl.addLabel(label, `+=${hold}`);

    const animateLine = (
      cur: SplitText,
      nxt: SplitText,
      lineOffset: number
    ) => {
      tl.to(
        cur.chars,
        {
          y: -60,
          opacity: 0,
          duration: outDur,
          ease: "power2.in",
          stagger,
        },
        `${label}+=${lineOffset}`
      ).fromTo(
        nxt.chars,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: inDur,
          ease: "power3.out",
          stagger,
          immediateRender: false,
        },
        `${label}+=${lineOffset + outDur * 0.55}`
      );
    };

    // When both lines animate, nudge the bottom line a hair later so the
    // transition cascades instead of moving in a single robotic block.
    if (topChanges) animateLine(topWords[curT], topWords[nxtT], 0);
    if (botChanges) {
      const offset = topChanges ? 0.08 : 0;
      animateLine(botWords[curB], botWords[nxtB], offset);
    }
  });
}
