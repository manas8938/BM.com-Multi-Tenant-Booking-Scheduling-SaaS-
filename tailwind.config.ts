import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ember: {
          50: "#FDF1EC", 100: "#FBE0D5", 200: "#F6C2AC", 300: "#F09F7E",
          400: "#EC7C54", 500: "#E8633C", 600: "#C24E2C", 700: "#9C3D22",
          800: "#762D19", 900: "#4F1F11",
        },
        ink: {
          50: "#EEF0F4", 100: "#D9DDE6", 200: "#B3BBCC", 300: "#8C99B3",
          400: "#667799", 500: "#4A5A7D", 600: "#364463", 700: "#29344D",
          800: "#1F2738", 900: "#1B2333", 950: "#12172A",
        },
        gold: {
          50: "#FBF3D9", 100: "#F6E6B3", 200: "#EFD584", 300: "#E7C455",
          400: "#DCB73B", 500: "#C9A227", 600: "#A6841F", 700: "#836718",
          800: "#5F4A11", 900: "#3D2F0A",
        },
        mint: {
          50: "#E7F5EE", 100: "#C7E9D9", 200: "#9AD8BC", 300: "#6BC59D",
          400: "#45B384", 500: "#2F9E6E", 600: "#25805A", 700: "#1C6246",
          800: "#134432", 900: "#0A2A1F",
        },
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
