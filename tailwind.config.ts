import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        zincPanel: "#101217",
        zincLine: "#242833",
        terminalGreen: "#9de58b",
        caution: "#f4c167"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 18px 50px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
