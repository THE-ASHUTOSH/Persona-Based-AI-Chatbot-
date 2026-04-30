/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          50: "#f6f7fb",
          100: "#eceef6",
          200: "#d3d8e8",
          300: "#a9b2cf",
          400: "#7c87b0",
          500: "#5a6494",
          600: "#434d76",
          700: "#333a5a",
          800: "#1f2440",
          900: "#11142a",
          950: "#070920"
        }
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 17, 35, 0.06), 0 8px 24px -10px rgba(15, 17, 35, 0.18)"
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "bounce-dot": "bounceDot 1.1s infinite ease-in-out"
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.5" },
          "40%": { transform: "scale(1)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
