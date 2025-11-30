/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "glass-dark": "rgba(15, 23, 42, 0.8)",
        "glass-light": "rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        "ambient-gradient": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      },
      backdropFilter: {
        glass: "blur(10px)",
      },
    },
  },
  plugins: [],
};