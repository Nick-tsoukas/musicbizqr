/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
    ],
    theme: {
      extend: {
        colors: {
          'neon-green': '#39FF14',
          'neon-purple': '#9100FF',
          'accent': '#FF00FF',
          'complementary1': '#00FFFF',
          'complementary2': '#FFD700',
        },
      },
    },
    plugins: [],
  };
  