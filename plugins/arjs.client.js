// plugins/arjs.client.js

import AFRAME from 'aframe'
import 'aframe-html-shader'

export default defineNuxtPlugin(() => {
  // Attach AFRAME to window so that AR.js can find it
  window.AFRAME = AFRAME

  // Dynamically load AR.js after AFRAME is available
  const script = document.createElement('script')
  script.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js'
  script.async = true
  script.onload = () => {
    console.log('AR.js loaded successfully')
  }
  script.onerror = () => {
    console.error('Failed to load AR.js')
  }
  document.head.appendChild(script)
})
