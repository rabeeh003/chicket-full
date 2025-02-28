import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: {
          DEFAULT: "#de2129", // Custom Danger Color (Red Shade)
          light: "#de2129",
          dark: "#de2129",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      theme: {
        extend: {
          colors: {
            danger: "#de2129", // Overriding HeroUI Danger Color
          },
        },
      },
    }),
  ],
};
