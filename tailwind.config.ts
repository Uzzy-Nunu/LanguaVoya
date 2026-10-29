import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C2A39",
        paper: "#FBF4E8",
        sand: "#F1E4CE",
        coral: "#C9472F",
        lagoon: "#14707A",
        sun: "#F2B544",
        sage: "#4C7A4F",
        muted: "#59636E",
        danger: "#A8321F",
        line: "rgba(28,42,57,0.14)",
        scrim: "rgba(28,42,57,0.35)",
        panel: "rgba(251,244,232,0.92)",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        body: ["'Figtree'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        input: "10px",
        panel: "18px",
        dock: "28px",
      },
      boxShadow: {
        e1: "0 10px 28px rgba(28,42,57,0.22)",
        e2: "0 18px 48px rgba(28,42,57,0.30)",
      },
    },
  },
  plugins: [],
};

export default config;
