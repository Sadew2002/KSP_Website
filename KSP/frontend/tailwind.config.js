module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ksp-red': '#EF014F',
        'ksp-black': '#1A1A1B',
        'ksp-gray': '#F4F4F6',
        'ksp-white': '#FFFFFF',
        'ksp-green': '#27AE60',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      backgroundColor: {
        'default': '#F4F4F6',
      }
    },
  },
  plugins: [],
}
