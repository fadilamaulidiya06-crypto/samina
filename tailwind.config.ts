import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8f1",
          100: "#dcefe0",
          500: "#31945c",
          600: "#237a49",
          700: "#1d623c",
          900: "#153d2b"
        },
        ink: "#1d2a24",
        sand: "#f7f7f1"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(22, 54, 36, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
