import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f2",
          100: "#d5ebde",
          200: "#a9d6bd",
          300: "#78bd99",
          400: "#4fa47a",
          500: "#2f8a60",
          600: "#226f4c",
          700: "#1c5940",
          800: "#194935",
          900: "#153c2c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
