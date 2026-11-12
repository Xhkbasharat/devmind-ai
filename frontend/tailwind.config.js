
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
          50: "#f3f0ff",
          100: "#e8e1ff",
          200: "#d2c5ff",
          300: "#b6a0ff",
          400: "#9877ff",
          500: "#7955f5",
          600: "#6840e5",
          700: "#5532c2",
          800: "#462da0",
          900: "#3b2882",
        },

        midnight: {
          950: "#0b0e19",
          900: "#101422",
          800: "#151b2b",
          700: "#20283a",
        },
      },

      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 25px rgba(121, 85, 245, 0.20)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },

  plugins: [],
};
