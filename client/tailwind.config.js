module.exports = {
  /**
   * configure the purge option with the paths to all of your
   * components so Tailwind can tree-shake unused styles in production builds
   */
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
