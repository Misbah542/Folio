import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

/** Boot log lines, each revealed once the loader passes its threshold. */
const BOOT_LINES: [number, string][] = [
  [4, "init  · renderer  … ok"],
  [22, "build · android-bot rig … ok"],
  [45, "load  · environment map … ok"],
  [66, "bind  · pointer + scroll … ok"],
  [84, "warm  · shaders … ok"],
  [99, "boot  · complete"],
];

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (percent < 100) return;
    const a = setTimeout(() => {
      setLoaded(true);
      const b = setTimeout(() => setIsLoaded(true), 1000);
      return () => clearTimeout(b);
    }, 600);
    return () => clearTimeout(a);
  }, [percent]);

  useEffect(() => {
    if (!isLoaded) return;
    import("./utils/initialFX").then((module) => {
      setClicked(true);
      setTimeout(() => {
        if (module.initialFX) module.initialFX();
        setIsLoading(false);
      }, 900);
    });
  }, [isLoaded]);

  return (
    <div className={`loading-screen ${clicked ? "loading-clicked" : ""}`}>
      <div className="loading-top">
        <a href="/#" className="loader-title" data-cursor="disable">
          MH
        </a>
        <span className="loading-tag">Misbah ul Haque · Portfolio</span>
      </div>

      <div className="loading-core">
        <div className="loading-log">
          {BOOT_LINES.map(([at, text]) => (
            <span
              className={`loading-log-line ${percent >= at ? "is-on" : ""}`}
              key={text}
            >
              <i>&gt;</i> {text}
            </span>
          ))}
        </div>

        <div className={`loading-readout ${loaded ? "loading-complete" : ""}`}>
          <span className="loading-state">
            {loaded ? "System ready" : "Booting"}
          </span>
          <span className="loading-percent">
            {String(Math.min(percent, 100)).padStart(3, "0")}
            <i>%</i>
          </span>
        </div>

        <div className="loading-rail">
          <div
            className="loading-rail-fill"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>

      <div className="loading-marquee">
        <Marquee speed={38} gradient={false}>
          <span>Android</span>
          <span>Kotlin</span>
          <span>Jetpack Compose</span>
          <span>Android TV</span>
          <span>Go</span>
          <span>Performance</span>
        </Marquee>
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
