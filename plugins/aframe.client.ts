// plugins/aframe.client.ts

// Import A-Frame (this registers the global AFRAME object)
import 'aframe';
// Import the aframe-html-shader so we can render HTML as a texture
import 'aframe-html-shader';

// Optionally, you can log that A-Frame has been loaded
if (process.client) {
  console.log("A-Frame and aframe-html-shader loaded");
}
