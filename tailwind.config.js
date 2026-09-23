/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ink + signal palette: a near-black ink for structure, a single
        // amber "signal" color for actions and status, and a cool slate
        // for secondary text. Chosen to feel like a stock-room ledger,
        // not a generic SaaS card kit.
        ink: {
          950: "#14171C",
          900: "#1C2027",
          700: "#3A404B",
          500: "#616876",
          300: "#9AA1AC",
          100: "#E4E7EB",
          50: "#F5F6F8",
        },
        signal: {
          DEFAULT: "#C8712B",
          dark: "#A35A20",
          light: "#F4E3D2",
        },
        good: "#2F7A4D",
        bad: "#B3423A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
