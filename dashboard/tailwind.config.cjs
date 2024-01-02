module.exports = {
  content: ["./views/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        brokenWhite: "#F8F9FA",
        mainTeal: "#4FD1C5",
        mainBlack: "#2D3748",
        healthy: "#94CB4B",
        moderate: "#FFCF23",
        unhealthy: "#FFA020",
        unhealthy2: "#DE0705",
        veryUnhealthy: "#5D2660",
        hazardous: "#722221",
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
