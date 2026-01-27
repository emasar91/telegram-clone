module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lucida: ["var(--font-lucida)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}
