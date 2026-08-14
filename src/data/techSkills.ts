export type TechSkill = {
  name: string;
  /** Brand hue, used as the per-item accent. Kept light enough to read on ink. */
  color: string;
};

export type TechDomain = {
  index: string;
  name: string;
  /** One mono line under the domain title — what this group is actually for. */
  note: string;
  items: TechSkill[];
};

/** The résumé's key skills, grouped by where they sit in the stack. */
export const TECH_DOMAINS: TechDomain[] = [
  {
    index: "01",
    name: "Languages",
    note: "What I write in",
    items: [
      { name: "Kotlin", color: "#A78BFA" },
      { name: "Java", color: "#F0A868" },
      { name: "Go", color: "#4FD3E8" },
    ],
  },
  {
    index: "02",
    name: "Android",
    note: "Phone, tablet, TV",
    items: [
      { name: "Jetpack Compose", color: "#6FA8FF" },
      { name: "Coroutines", color: "#B79CFF" },
      { name: "Dagger Hilt", color: "#7FC4FF" },
      { name: "Paging 3", color: "#5CCFC0" },
      { name: "ExoPlayer", color: "#FF9770" },
      { name: "Android TV", color: "#3DDC84" },
      { name: "Material Design", color: "#63C6F5" },
    ],
  },
  {
    index: "03",
    name: "Services & data",
    note: "The round trip",
    items: [
      { name: "gRPC", color: "#4FC3CE" },
      { name: "REST", color: "#9FB0B8" },
      { name: "GraphQL", color: "#F062B0" },
      { name: "SQLite", color: "#6FB6DE" },
      { name: "Firebase", color: "#FFCA28" },
    ],
  },
  {
    index: "04",
    name: "Build & ops",
    note: "Shipping and uptime",
    items: [
      { name: "Gradle", color: "#6FD8C4" },
      { name: "Android Studio", color: "#3DDC84" },
      { name: "GitHub Actions", color: "#5C9DFF" },
      { name: "Git", color: "#F0705A" },
      { name: "Crashlytics", color: "#FFA867" },
      { name: "Linux", color: "#FCC624" },
    ],
  },
];

export const TECH_COUNT = TECH_DOMAINS.reduce(
  (total, domain) => total + domain.items.length,
  0
);
