export type TechSkill = {
  name: string;
  /** Brand hue. Falls back to the domain's hue when the tool has no colour of
   *  its own, so each rack reads as one family with the known marks popping. */
  color?: string;
};

export type TechDomain = {
  index: string;
  name: string;
  /** One mono line under the domain title — what this group is actually for. */
  note: string;
  hue: string;
  items: TechSkill[];
};

/** The résumé's key skills, grouped by where they sit in the stack. */
export const TECH_DOMAINS: TechDomain[] = [
  {
    index: "01",
    name: "Languages",
    note: "What I write in",
    hue: "#A78BFA",
    items: [
      { name: "Kotlin" },
      { name: "Java", color: "#F0A868" },
      { name: "Go", color: "#4FD3E8" },
    ],
  },
  {
    index: "02",
    name: "Android",
    note: "Phone, tablet, TV",
    hue: "#3DDC84",
    items: [
      { name: "Jetpack Compose", color: "#6FA8FF" },
      { name: "Android Leanback" },
      { name: "ExoPlayer", color: "#FF9770" },
      { name: "Coroutines", color: "#B79CFF" },
      { name: "Dagger Hilt", color: "#7FC4FF" },
      { name: "RxJava", color: "#D08BFF" },
      { name: "LiveData" },
      { name: "ViewModel" },
      { name: "Paging 3", color: "#5CCFC0" },
      { name: "Navigation" },
    ],
  },
  {
    index: "03",
    name: "Architecture",
    note: "How it holds together",
    hue: "#7FC4FF",
    items: [
      { name: "MVVM" },
      { name: "MVI" },
      { name: "MVP" },
      { name: "Clean Architecture" },
      { name: "Dependency Injection" },
    ],
  },
  {
    index: "04",
    name: "Data & APIs",
    note: "The round trip",
    hue: "#5CCFC0",
    items: [
      { name: "Room" },
      { name: "SQLite", color: "#6FB6DE" },
      { name: "Retrofit" },
      { name: "REST" },
      { name: "GraphQL", color: "#F062B0" },
      { name: "gRPC", color: "#4FC3CE" },
    ],
  },
  {
    index: "05",
    name: "Analytics & monitoring",
    note: "Knowing what shipped",
    hue: "#FFA867",
    items: [
      { name: "Firebase Analytics", color: "#FFCA28" },
      { name: "Crashlytics", color: "#FFCA28" },
      { name: "Mux", color: "#F062B0" },
      { name: "Mixpanel", color: "#7FC4FF" },
      { name: "Sentry", color: "#B79CFF" },
    ],
  },
  {
    index: "06",
    name: "Testing",
    note: "Proof before release",
    hue: "#F0708A",
    items: [
      { name: "JUnit" },
      { name: "Espresso" },
      { name: "MockK" },
      { name: "Robolectric" },
      { name: "Instrumentation" },
    ],
  },
  {
    index: "07",
    name: "Platforms",
    note: "Where it runs",
    hue: "#63C6F5",
    items: [
      { name: "Android Mobile", color: "#3DDC84" },
      { name: "Android TV", color: "#3DDC84" },
      { name: "Google TV" },
      { name: "FireStick", color: "#FFA867" },
      { name: "Jio Set-Top Box" },
    ],
  },
  {
    index: "08",
    name: "Build & tooling",
    note: "Shipping and uptime",
    hue: "#D4B36A",
    items: [
      { name: "Gradle", color: "#6FD8C4" },
      { name: "Studio Profiler", color: "#3DDC84" },
      { name: "GitHub Actions", color: "#5C9DFF" },
      { name: "CI/CD" },
      { name: "Postman", color: "#FF9770" },
      { name: "Charles Proxy" },
      { name: "Play Console", color: "#3DDC84" },
      { name: "Git", color: "#F0705A" },
      { name: "Bitbucket", color: "#5C9DFF" },
    ],
  },
];

export const TECH_COUNT = TECH_DOMAINS.reduce(
  (total, domain) => total + domain.items.length,
  0
);
