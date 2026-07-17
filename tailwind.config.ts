import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1c2b39",
        "ink-deep": "#141f29",
        surface: "#1e2f3d",
        "surface-2": "#28404f",
        paper: "#f7f5f0",
        prussian: "#1f3a5f",
        "prussian-light": "#2d5183",
        ochre: "#b8862b",
        "ochre-light": "#d6a54a",
        sage: "#8aa396",
        line: "#d8d2c4",
        "line-dark": "rgba(247, 245, 240, 0.12)",
      },
      fontFamily: {
        display: ["var(--font-serif)", "Georgia", "serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
