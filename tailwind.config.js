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
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
        textColor: {
          DEFAULT: '#2C2C2C',
        },
        colors: {
          'off-black': '#2C2C2C',
          'off-white': '#F5F5F5',
          // Override default black and white
          black: '#2C2C2C',
          white: '#F5F5F5',
          'neon-green': '#39FF14',
          'neon-purple': '#9100FF',
          'accent': '#FF00FF',
          'complementary1': '#00FFFF',
          'complementary2': '#FFD700',
        },
        textColor: {
          'default-black': '#2C2C2C',
          'default-white': '#F5F5F5',
        },
        backgroundColor: {
          'default-black': '#2C2C2C',
          'default-white': '#F5F5F5',
        },
      },
    },
    plugins: [],
  };
  