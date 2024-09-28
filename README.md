# task list 

- [] update button for upload on album page 
- [] Add option to create new band on add album page 
- [] change all images to nuxt img for preformance 
- [] add more space between form containers 
- [] add the right images for the homescreen phone  


























import { ref, useRuntimeConfig } from '#imports'
import { loadFull } from 'tsparticles'
import { tsParticles } from '@tsparticles/engine'

const { mode } = useRuntimeConfig().public.particles

const show = ref(false)

if (import.meta.client && mode === 'custom') {
  await loadFull(tsParticles)
}

const options = {
  // fullScreen: {
  //   enable: true,
  //   zIndex: -1
  // },
  style: {
    position: 'absolute',
    height: '290px',
    padding: '1rem'
  },
  particles: {
    color: {
      value: "#fgfgfg"
    },
    links: {
      color: "#000",
      enable: true
    },
    move: {
      enable: true
    },
    number: {
      value: 30function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function changeColors() {
  const paths = document.querySelectorAll('.animated-path');
  paths.forEach(path => {
    path.style.fill = getRandomColor();
  });
}

function animateColors() {
  setInterval(changeColors, 2000);
}

onMounted(() => {
  animateColors();
});
    }
  }
}
