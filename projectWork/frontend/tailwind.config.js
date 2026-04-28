/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d9f0ff",
          200: "#bce5ff",
          300: "#8fd5ff",
          400: "#59bcff",
          500: "#2c9cf5",
          600: "#157fe6",
          700: "#1366cb",
          800: "#1654a4",
          900: "#184882",
        },
        accent: {
          50: "#edfdfa",
          100: "#d2f8f0",
          200: "#aaf0e2",
          300: "#74e3d1",
          400: "#3ccfb9",
          500: "#18b39f",
          600: "#109084",
          700: "#10736b",
          800: "#125c56",
          900: "#124c47",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        card: "0 8px 24px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};