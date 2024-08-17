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
        keyframes: {
          slideinview: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          }
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
        textColor: {
          DEFAULT: '#2C2C2C',
        },
        colors: {
          'off-black': '#191414',
          'off-white': '#F5F5F5',
          // Override default black and white
          black: '#191414',
          white: '#F5F5F5',
          green: '#1db954',
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
  