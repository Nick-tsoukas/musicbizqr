<template>
  <div class="container mx-auto pb-14">
    <div class="flex flex-col items-center p-4 max-w-5xl mx-auto">

      <!-- Full-screen overlay ONLY while saving -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
      </div>

      <!-- QR Code Wrapper with local re-render spinner -->
      <transition name="fade">
        <div
          class="relative inline-block p-4 sticky top-20 rounded-lg shadow-md"
          style="z-index: 999999 !important"
        >
          <!-- Local overlay while the QR is re-rendering -->
          <!-- <div
            v-if="isRendering"
            class="qr-reloading-overlay"
            aria-live="polite"
            aria-busy="true"
          >
            <div class="conic-spinner"></div>
            <span class="sr-only">Updating QR code…</span>
          </div> -->

          <div ref="qrcodeWrapper">
            <!-- QR code will be rendered here by qr-code-styling -->
          </div>
        </div>
      </transition>

      <div class="mt-4 flex flex-col space-y-4 w-full">
        <!-- Name Input -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <span class="mb-1 text-white text-xl font-semibold">Name</span>
          </div>
          <div class="p-4">
            <label class="mdc-text-field mb-4">
              <input
                v-model="name"
                type="text"
                class="mdc-text-field__input"
                placeholder="Enter Name"
              />
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Choose QR Type -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <span class="mb-1 text-white text-xl font-semibold">Choose QR Type</span>
          </div>
          <div class="p-4">
            <div class="flex flex-wrap gap-4">
              <!-- Band -->
              <div
                @click="selectType('bandProfile')"
                :class="{
                  'border-green border-4': route.query.type == 'bandProfile',
                  'border-black': route.query.type !== 'bandProfile',
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Artist Page</span>
              </div>

              <!-- External URL -->
              <div
                @click="selectType('externalURL')"
                :class="{
                  'border-green border-4': route.query.type == 'externalURL',
                  'border-black': route.query.type !== 'externalURL',
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Link URL</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Band Selection (Only show if route.query.type === 'bandProfile') -->
        <div v-if="route.query.type === 'bandProfile'" class="bg-white rounded-md p-4">
          <label class="mdc-text-field mb-4">
            <span class="mb-1 text-gray-700">Select Band:</span>
            <select v-model="selectedBand" class="mdc-text-field__input">
              <option disabled value="">Select a band</option>
              <option :value="null">None</option>
              <option v-for="band in bands" :key="band.id" :value="band.id">
                {{ band.name }}
              </option>
              <option value="createNew">Create New Band</option>
            </select>
            <span class="mdc-line-ripple"></span>
          </label>
        </div>

        <!-- External Link Input (if applicable) -->
        <div v-if="route.query.type === 'externalURL'" class="bg-white rounded-md p-4">
          <label class="mdc-text-field mb-4">
            <span class="mb-1 text-gray-700">External Link:</span>
            <input
              v-model="link"
              type="text"
              class="mdc-text-field__input"
              placeholder="Enter URL"
              @change="link = normalizeLink(link)"
            />
            <span class="mdc-line-ripple"></span>
          </label>
        </div>

        <!-- Background & Foreground Colors -->
        <div class="bg-white rounded-md">
          <div
            class="flex bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 items-center"
          >
            <h2 class="font-semibold text-white text-xl">Background & Foreground Colors</h2>
          </div>
          <div class="p-4 flex flex-col gap-6 sm:flex-row md:grid-cols-2">
            <!-- Background -->
            <div>
              <label class="flex items-center">
                <span class="mr-2 text-gray-700">Background:</span>
                <div class="color-picker">
                  <input v-model="bgColor" type="text" class="color-text-input" />
                  <input v-model="bgColor" type="color" class="color-input" />
                </div>
              </label>
            </div>
            <!-- Foreground -->
            <div>
              <label class="flex items-center">
                <span class="mr-2 text-gray-700">Foreground:</span>
                <div class="color-picker">
                  <input v-model="dotsColor" type="text" class="color-text-input" />
                  <input v-model="dotsColor" type="color" class="color-input" />
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Gradient Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Gradient Options</h2>
          </div>
          <div class="p-4">
            <label class="mb-4 flex items-center">
              <input type="checkbox" v-model="gradient" class="mr-2" />
              <span class="text-gray-700">Enable Gradient</span>
            </label>
            <div v-if="gradient">
              <label class="mdc-text-field mb-4">
                <span class="mb-1 text-gray-700">Gradient Type:</span>
                <select v-model="gradientType" class="mdc-text-field__input">
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
                <span class="mdc-line-ripple"></span>
              </label>
              <label class="mdc-text-field mb-4">
                <span class="mb-1 text-gray-700">Gradient Rotation (degrees):</span>
                <input
                  v-model.number="gradientRotation"
                  type="number"
                  class="mdc-text-field__input"
                  min="0"
                  max="360"
                />
                <span class="mdc-line-ripple"></span>
              </label>
              <label class="color-picker-label mb-4 flex items-center">
                <span class="mb-1 text-gray-700 mr-2">Gradient Start Color:</span>
                <ColorSwatchPicker v-model="gradientStartColor" />
              </label>
              <label class="color-picker-label mb-4 flex items-center">
                <span class="mb-1 text-gray-700 mr-2">Gradient End Color:</span>
                <ColorSwatchPicker v-model="gradientEndColor" />
              </label>
            </div>
          </div>
        </div>

        <!-- Image Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Image Options</h2>
          </div>
          <div class="p-4">
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Upload Logo:</span>
              <input type="file" @change="handleImageUpload" class="mdc-text-field__input" />
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Dots Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Dots Options</h2>
          </div>
          <div class="p-4">
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Dots Type:</span>
              <select v-model="dotsType" class="mdc-text-field__input">
                <option value="rounded">Rounded</option>
                <option value="dots">Dots</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
                <option value="square">Square</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Corners Square Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Corners Square Options</h2>
          </div>
          <div class="p-4">
            <label class="color-picker-label mb-4">
              <span class="mb-1 text-gray-700">Corners Square Color:</span>
              <div class="color-picker">
                <input v-model="cornersSquareColor" type="text" class="color-text-input" />
                <input v-model="cornersSquareColor" type="color" class="color-input" />
              </div>
            </label>
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Corners Square Type:</span>
              <select v-model="cornersSquareType" class="mdc-text-field__input">
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="extraRounded">Extra Rounded</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Corners Dot Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Corners Dot Options</h2>
          </div>
          <div class="p-4">
            <label class="color-picker-label mb-4">
              <span class="mb-1 text-gray-700">Corners Dot Color:</span>
              <div class="color-picker">
                <input v-model="cornersDotColor" type="text" class="color-text-input" />
                <input v-model="cornersDotColor" type="color" class="color-input" />
              </div>
            </label>
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Corners Dot Type:</span>
              <select v-model="cornersDotType" class="mdc-text-field__input">
                <option value="square">Square</option>
                <option value="dot">Dot</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Save Button -->
        <button @click="saveQrCode" class="mdc-button w-full mt-4">
          Save QR Code
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useAsyncData } from '#app'
import { useRouter, useRoute, useStrapi, useStrapiUser, useStrapiClient } from '#imports'
import { v4 as uuidv4 } from 'uuid'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

/* ----------------------------- Utilities ----------------------------- */
function normalizeLink(link) {
  if (!link) return ''
  if (/^https?:\/\//i.test(link)) return link.trim()
  if (/^www\./i.test(link)) return `https://${link.trim()}`
  return `https://www.${link.trim()}`
}

/* ------------------------------- State -------------------------------- */
const qrcodeWrapper = ref(null)
const qrCode = ref(null)

const uuid = uuidv4()
const qrValue = ref(`https://musicbizqr.com/directqr?id=${uuid}`)
const qrSize = ref(300)

const name = ref('name')
const link = ref(null)

// Full-screen while saving:
const loading = ref(false)

// Local spinner while QR re-renders:
const isRendering = ref(false)
let renderTimer = null
function startRender(minMs = 250) {
  if (renderTimer) {
    isRendering.value = true
    return
  }
  isRendering.value = true
  renderTimer = window.setTimeout(() => {
    isRendering.value = false
    renderTimer = null
  }, minMs)
}
function endRenderSoon(extraMs = 150) {
  if (renderTimer) window.clearTimeout(renderTimer)
  renderTimer = window.setTimeout(() => {
    isRendering.value = false
    renderTimer = null
  }, extraMs)
}

// Style options
const bgColor = ref('#FFFFFF')
const dotsColor = ref('#000000')
const cornersSquareColor = ref('#000000')
const cornersDotColor = ref('#000000')
const gradient = ref(false)
const gradientType = ref('linear')
const gradientRotation = ref(0)
const gradientStartColor = ref('#e6289d')
const gradientEndColor = ref('#40353c')
const dotsType = ref('square')
const cornersSquareType = ref('square')
const cornersDotType = ref('square')

const imageSettings = reactive({
  src: '',
  imageSize: 0.4,
  margin: 0,
  crossOrigin: 'anonymous'
})

const lastColorOptions = reactive({
  bgColor: '',
  dotsColor: '',
  cornersSquareColor: '',
  cornersDotColor: '',
  gradient: false,
  gradientType: '',
  gradientRotation: 0,
  gradientStartColor: '',
  gradientEndColor: ''
})

/* ---------------------------- QR Builders ---------------------------- */
function getQRCodeOptions() {
  const options = {
    width: qrSize.value,
    height: qrSize.value,
    data: qrValue.value,
    errorCorrectionLevel: 'H',
    dotsOptions: { type: dotsType.value },
    cornersSquareOptions: {
      color: cornersSquareColor.value,
      type: cornersSquareType.value
    },
    cornersDotOptions: {
      color: cornersDotColor.value,
      type: cornersDotType.value
    },
    backgroundOptions: {
      color: bgColor.value,
      transparent: false
    },
    imageOptions: {
      crossOrigin: imageSettings.crossOrigin,
      margin: imageSettings.margin,
      imageSize: imageSettings.imageSize
    }
  }

  if (imageSettings.src) options.image = imageSettings.src

  if (gradient.value) {
    options.dotsOptions.gradient = {
      type: gradientType.value,
      rotation: (gradientRotation.value * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: gradientStartColor.value },
        { offset: 1, color: gradientEndColor.value }
      ]
    }
  } else {
    options.dotsOptions.color = dotsColor.value
  }

  return options
}

/* -------------------------- Update Strategies ------------------------- */
// Throttled color-only update (fast)
const updateColourFast = useThrottleFn(() => {
  if (!qrCode.value) return

  const changed =
    bgColor.value !== lastColorOptions.bgColor ||
    dotsColor.value !== lastColorOptions.dotsColor ||
    cornersSquareColor.value !== lastColorOptions.cornersSquareColor ||
    cornersDotColor.value !== lastColorOptions.cornersDotColor ||
    gradient.value !== lastColorOptions.gradient ||
    gradientType.value !== lastColorOptions.gradientType ||
    gradientRotation.value !== lastColorOptions.gradientRotation ||
    gradientStartColor.value !== lastColorOptions.gradientStartColor ||
    gradientEndColor.value !== lastColorOptions.gradientEndColor

  if (!changed) return

  startRender()

  lastColorOptions.bgColor = bgColor.value
  lastColorOptions.dotsColor = dotsColor.value
  lastColorOptions.cornersSquareColor = cornersSquareColor.value
  lastColorOptions.cornersDotColor = cornersDotColor.value
  lastColorOptions.gradient = gradient.value
  lastColorOptions.gradientType = gradientType.value
  lastColorOptions.gradientRotation = gradientRotation.value
  lastColorOptions.gradientStartColor = gradientStartColor.value
  lastColorOptions.gradientEndColor = gradientEndColor.value

  qrCode.value.update({
    backgroundOptions: { color: bgColor.value },
    dotsOptions: {
      type: dotsType.value,
      ...(gradient.value
        ? {
            gradient: {
              type: gradientType.value,
              rotation: (gradientRotation.value * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: gradientStartColor.value },
                { offset: 1, color: gradientEndColor.value }
              ]
            }
          }
        : { color: dotsColor.value })
    },
    cornersSquareOptions: { color: cornersSquareColor.value },
    cornersDotOptions: { color: cornersDotColor.value }
  })

  endRenderSoon()
}, 33) // ~30 FPS

// Debounced full update (size, data, type, image, etc.)
const updateQRCodeSlow = useDebounceFn(() => {
  if (!qrCode.value) return
  startRender()
  qrCode.value.update(getQRCodeOptions())
  endRenderSoon()
}, 150)

// Watchers for non-color changes
function initializeWatcher() {
  watch(
    [
      qrValue,
      qrSize,
      dotsType,
      cornersSquareType,
      cornersDotType,
      () => imageSettings.src
    ],
    updateQRCodeSlow,
    { deep: true }
  )
}

/* --------------------------- Image Handling --------------------------- */
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSettings.src = e.target.result
      startRender()
      updateQRCodeSlow()
    }
    reader.readAsDataURL(file)
  }
}

/* ----------------------- Routing & Strapi wiring ---------------------- */
const props = defineProps({ type: String })
const { find } = useStrapi()
const user = useStrapiUser()
const router = useRouter()
const route = useRoute()
const client = useStrapiClient()

const selectedBand = ref(null)

const {
  data: bandsData,
} = useAsyncData(
  'user-bands',
  async () => {
    if (!user.value?.id) return []
    const res = await find('bands', {
      filters: { users_permissions_user: { id: user.value.id } }
    })
    return Array.isArray(res.data) ? res.data : res.data?.data || []
  },
  { watch: () => user.value?.id, immediate: true }
)

const bands = computed(() => bandsData.value || [])

/* -------------------------------- Mount -------------------------------- */
onMounted(async () => {
  if (process.client) {
    const { default: QRCodeStyling } = await import('qr-code-styling')
    qrCode.value = new QRCodeStyling(getQRCodeOptions())

    startRender()
    qrCode.value.append(qrcodeWrapper.value)
    endRenderSoon()

    initializeWatcher()

    // Real-time color updates
    watch(
      [
        bgColor,
        dotsColor,
        gradient,
        gradientType,
        gradientRotation,
        gradientStartColor,
        gradientEndColor,
        cornersSquareColor,
        cornersDotColor
      ],
      updateColourFast,
      { deep: true }
    )
  }
})

/* ------------------------------ Actions -------------------------------- */
const selectType = (selected) => {
  router.push({
    query: { ...route.query, type: selected }
  })
}

const saveQrCode = async () => {
  try {
    loading.value = true

    const form = {
      url: qrValue.value,
      users_permissions_user: { id: user.value.id },
      q_type: route.query.type,
      link: normalizeLink(link.value),
      name: name.value,
      options: getQRCodeOptions()
    }

    if (route.query.type === 'bandProfile') {
      form.band = selectedBand.value !== 'createNew' ? selectedBand.value : null
    }

    const blob = await qrCode.value.getRawData('png')
    const file = new File([blob], 'qrcode.png')
    const formData = new FormData()
    formData.append('files.q_image', file, 'qrcode.png')
    formData.append('data', JSON.stringify(form))

    const { data } = await client('/qrs', {
      method: 'POST',
      body: formData
    })

    if (!data?.id) throw new Error('QR code was not saved (no ID returned).')

    if (route.query.type === 'bandProfile' && selectedBand.value === 'createNew') {
      router.push({ name: 'createband', query: { qrId: data.id } })
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error during QR code save:', error?.response?.data || error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Container top spacing */
.container { margin-top: 2rem; }

/* Fade transition for the QR container */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ========== FULL-SCREEN saving overlay (unchanged behavior) ========== */
.loading-container {
  position: fixed; inset: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
}
.spinner {
  border: 8px solid #f3f3f3; border-top: 8px solid #555;
  border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ========== LOCAL overlay while the QR re-renders ========== */
.qr-reloading-overlay {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(2px);
  border-radius: 0.5rem;
  z-index: 10;
}
.conic-spinner {
  width: 56px; height: 56px;
  border-radius: 9999px;
  mask: radial-gradient(circle 14px, transparent 98%, #000) subtract,
        conic-gradient(from 0deg, #000 0 360deg);
  background:
    conic-gradient(from 0deg, rgba(255,255,255,0.0) 0 60deg, rgba(255,255,255,0.85) 60deg 120deg, rgba(255,255,255,0.0) 120deg 360deg);
  animation: conic-rotate 1s linear infinite;
  filter: drop-shadow(0 2px 8px rgba(255,255,255,0.6));
}
@keyframes conic-rotate { to { transform: rotate(360deg); } }

/* MD text field */
.mdc-text-field { position: relative; margin-bottom: 1.5rem; display: inline-block; width: 100%; }
.mdc-text-field__input {
  font-size: 1rem; line-height: 1.5; padding: 0.75rem 0.5rem;
  border: 1px solid #000; border-radius: 10px; outline: none; width: 100%; box-sizing: border-box;
}
.mdc-line-ripple { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background-color: #6200ee; transform: scaleX(0); transition: transform 0.2s; }
.mdc-text-field__input:focus ~ .mdc-line-ripple { transform: scaleX(1); }

/* Button */
.mdc-button {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.75rem 1.5rem; font-size: 0.875rem; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.0892857143em;
  color: #fff; background-color: #2c2c2c; border: none; border-radius: 4px; cursor: pointer;
  transition: background-color 0.2s;
}
.mdc-button:hover { background-color: #3700b3; }
.mdc-button:focus { outline: none; }

/* Color Picker */
.color-picker { position: relative; overflow: visible; z-index: 99999 !important; }
.color-input {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  border: none; width: 36px; height: 36px; padding: 0; cursor: pointer; border-radius: 50%;
}
.color-text-input {
  font-size: 1rem; line-height: 1.5; padding: 0.75rem 2.5rem 0.75rem 0.5rem;
  border: 1px solid #000; border-radius: 10px; outline: none; width: 100%; box-sizing: border-box;
  position: relative; padding-right: 36px;
}

/* Helpers */
.font-bold { font-weight: 700; }
.border-green { border-color: green; }
.border-black { border-color: black; }
</style>
