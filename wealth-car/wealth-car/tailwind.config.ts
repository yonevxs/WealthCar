import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#150f8c",
        primaryHover: "#0b075e",
        accent: "#00a8ff",
        dark: "#1e293b",
        light: "#f8fafc",
        // legado — mantido para login/cadastro/dashboard
        navy: {
          DEFAULT: "#150f8c",
          light: "#1e1aa8",
          dark: "#0b075e",
        },
        brand: {
          DEFAULT: "#150f8c",
          light: "#1e1aa8",
          dark: "#0b075e",
        },
        surface: "#F3E8E8",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        sans: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
