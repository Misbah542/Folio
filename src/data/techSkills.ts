export type TechSkill = {
  name: string;
  icon: string;
  color: string;
};

const devicon = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

/** Mirrors the key-skills section of the résumé, Android-first. */
export const TECH_SKILLS: TechSkill[] = [
  // Languages
  { name: "Kotlin", icon: devicon("kotlin/kotlin-original.svg"), color: "#7F52FF" },
  { name: "Java", icon: devicon("java/java-original.svg"), color: "#E76F00" },
  { name: "Go", icon: devicon("go/go-original-wordmark.svg"), color: "#00ADD8" },

  // Android
  { name: "Android", icon: devicon("android/android-original.svg"), color: "#3DDC84" },
  {
    name: "Jetpack Compose",
    icon: devicon("jetpackcompose/jetpackcompose-original.svg"),
    color: "#4285F4",
  },
  {
    name: "Android Studio",
    icon: devicon("androidstudio/androidstudio-original.svg"),
    color: "#3DDC84",
  },
  { name: "Gradle", icon: devicon("gradle/gradle-original.svg"), color: "#02303A" },
  {
    name: "Material Design",
    icon: devicon("materialui/materialui-original.svg"),
    color: "#0081CB",
  },

  // Data & APIs
  { name: "SQLite", icon: devicon("sqlite/sqlite-original.svg"), color: "#003B57" },
  { name: "GraphQL", icon: devicon("graphql/graphql-plain.svg"), color: "#E10098" },
  { name: "Postman", icon: devicon("postman/postman-original.svg"), color: "#FF6C37" },

  // Platform & ops
  { name: "Firebase", icon: devicon("firebase/firebase-plain.svg"), color: "#FFCA28" },
  { name: "Git", icon: devicon("git/git-original.svg"), color: "#F05032" },
  { name: "GitHub", icon: devicon("github/github-original.svg"), color: "#FFFFFF" },
  {
    name: "GitHub Actions",
    icon: devicon("githubactions/githubactions-original.svg"),
    color: "#2088FF",
  },
  { name: "GitLab", icon: devicon("gitlab/gitlab-original.svg"), color: "#FC6D26" },
  { name: "Bitbucket", icon: devicon("bitbucket/bitbucket-original.svg"), color: "#0052CC" },
  { name: "Jira", icon: devicon("jira/jira-original.svg"), color: "#0052CC" },
  { name: "Linux", icon: devicon("linux/linux-original.svg"), color: "#FCC624" },
];
