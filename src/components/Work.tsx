import "./styles/Work.css";
import { MdArrowOutward } from "react-icons/md";

type Project = {
  index: string;
  title: string;
  category: string;
  blurb: string;
  tools: string[];
  link?: string;
};

const projects: Project[] = [
  {
    index: "01",
    title: "Tetris",
    category: "Android game · Compose",
    blurb:
      "A full Tetris built on MVVM and Kotlin Compose — real-time piece movement, collision detection and scoring, with LiveData and Coroutines keeping game state smooth across devices.",
    tools: ["Kotlin", "Jetpack Compose", "MVVM", "LiveData", "Coroutines"],
  },
  {
    index: "02",
    title: "SplitTrip",
    category: "Travel & utility",
    blurb:
      "A trip-expense companion for splitting costs across a group, built as a Compose-first Android app with an offline-capable local store.",
    tools: ["Kotlin", "Jetpack Compose", "Room", "Material 3"],
  },
];

const Work = () => {
  return (
    <div className="work-section" id="work">
      <div className="section-container">
        <div className="work-watermark section-watermark">04</div>
        <div className="work-container">
          <span className="section-label">Side projects</span>
          <h2 className="work-heading">
            Built for
            <br />
            <em>the fun of it</em>
          </h2>

          <div className="work-grid">
            {projects.map((project) => (
              <article className="work-box panel" key={project.title}>
                <header className="work-box-head">
                  <span className="work-box-index">{project.index}</span>
                  <span className="work-box-category">{project.category}</span>
                </header>

                <h3 className="work-box-title">{project.title}</h3>
                <p className="work-box-blurb">{project.blurb}</p>

                <div className="work-box-tools">
                  {project.tools.map((tool) => (
                    <span className="chip" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            <a
              className="work-box work-box-link panel"
              href="https://github.com/Misbah542"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
            >
              <span className="work-box-index">+</span>
              <h3 className="work-box-title">
                More on GitHub
                <MdArrowOutward />
              </h3>
              <p className="work-box-blurb">
                Experiments, samples and the rest of the shelf.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
