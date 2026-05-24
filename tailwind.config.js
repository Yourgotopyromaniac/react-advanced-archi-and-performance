/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#131629",
          secondary: {
            blue: "#6C7CFF",
            gray: "#A12043",
            white: "#1C2039",
          },
        },
        accent: {
          yellow: "#FFB836",
          green: "#56CDAD",
          red: "#FF6550",
          blue: "#26A4FF",
          orange: "#FF865E",
          purple: "#7B61FF",
        },
        neutral: {
          100: "#25324B",
          80: "#515B6F",
          60: "#7C8493",
          40: "#A8ADB7",
          20: "#E4E5E7",
          10: "#F9FAFC",
          0: "#F8F8FD",
        },
      },
    },
  },

  plugins: [],
};
