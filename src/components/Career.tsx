import "./styles/Career.css";

type Role = {
  period: string;
  title: string;
  org: string;
  product: string;
  points: string[];
  tags: string[];
};

const ROLES: Role[] = [
  {
    period: "Jan 2025 — Present",
    title: "Software Development Engineer II · Android",
    org: "Star India Pvt Ltd",
    product: "Disney+ Hotstar",
    points: [
      "Architected and delivered the Custom Profiles platform end-to-end across Android Mobile, Android TV and Go-based BFF services — owning API/proto contracts, backend implementation, client integration and rollout for a multi-profile ecosystem serving millions.",
      "Led fingerprint-based login across Android Mobile and Go BFF services, driving requirements, proto/API contracts and rollout strategy for secure, low-friction auth.",
      "Integrated the Engage SDK across Mobile and TV, lifting user interactions and retention with an impact of 600K video views per month.",
    ],
    tags: ["Kotlin", "Android TV", "Go", "gRPC", "BFF"],
  },
  {
    period: "Jun 2024 — Dec 2024",
    title: "Software Development Engineer II · Android",
    org: "Viacom Media Pvt Ltd",
    product: "JioCinema",
    points: [
      "Cut app startup by 20% using Content Provider and the Android Startup Library, improving cold start across the fleet.",
      "Built Contextual Continue Watching with optimised pagination, caching and API orchestration — roughly 3s off response latency and better resume accuracy.",
      "Redesigned the UpNext playback experience for a 25% lift in engagement, and upgraded impression tracking for downstream insight quality.",
      "Led production stability for IPL 2024, the Paris Olympics and ISL — 99.9% crash-free at 50M+ peak concurrency.",
    ],
    tags: ["Compose", "Paging 3", "Caching", "Firebase", "Mux"],
  },
  {
    period: "Jul 2022 — May 2024",
    title: "Software Development Engineer I · Android",
    org: "Viacom Media Pvt Ltd",
    product: "JioCinema",
    points: [
      "Rebuilt the Android TV Player Skin from the ground up for a 40% reduction in rendering time and noticeably smoother playback.",
      "Shipped Login with QR Code and a custom view for OTP entry.",
      "Held a 99.6% crash-free rate through FIFA World Cup 2022, IPL 2023 and India's international cricket series.",
    ],
    tags: ["Leanback", "ExoPlayer", "MVVM", "RxJava"],
  },
  {
    period: "Aug 2018 — May 2022",
    title: "B.Tech, Electronics & Communication",
    org: "PES University",
    product: "RR Campus · Minor in Computer Science",
    points: [],
    tags: [],
  },
];

const Career = () => {
  return (
    <div className="career-section" id="career">
      <div className="section-container">
        <div className="career-watermark section-watermark">03</div>
        <div className="career-container">
          <span className="section-label">Experience</span>
          <h2 className="career-heading">
            The <em>track</em>
            <br />
            record
          </h2>

          <div className="career-info">
            <div className="career-timeline">
              <div className="career-dot"></div>
            </div>

            {ROLES.map((role) => (
              <div className="career-info-box" key={role.period}>
                <div className="career-info-in">
                  <div className="career-role">
                    <h4>{role.title}</h4>
                    <h5>
                      {role.org} <span>— {role.product}</span>
                    </h5>
                  </div>
                  <h3>{role.period}</h3>
                </div>

                {role.points.length > 0 && (
                  <ul className="career-points">
                    {role.points.map((point) => (
                      <li key={point.slice(0, 24)}>{point}</li>
                    ))}
                  </ul>
                )}

                {role.tags.length > 0 && (
                  <div className="career-tags">
                    {role.tags.map((tag) => (
                      <span className="chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
