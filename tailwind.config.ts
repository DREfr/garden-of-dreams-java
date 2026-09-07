import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F1ECE0",
        card: "#FBF8F2",
        ink: "#2A2822",
        "ink-soft": "#5B5748",
        sage: {
          deep: "#3F4D37",
          DEFAULT: "#5C6E4F",
          soft: "#A9B597",
          mist: "#DDE3D1",
        },
        gold: {
          deep: "#8C6A31",
          DEFAULT: "#B08D4F",
          soft: "#D9C29A",
        },
        clay: "#B6553B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-public-sans)", "sans-serif"],
      },
      borderRadius: {
        arch: "3rem 3rem 0 0",
        petal: "2.5rem 0.5rem 2.5rem 0.5rem",
      },
      maxWidth: {
        prose: "68ch",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
