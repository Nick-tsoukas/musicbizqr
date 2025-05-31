<template>
  <div class="bg-[#000] container mx-auto max-w-5xl px-6">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div class="bg-black">
      <h1 class="title text-white">Create New Event</h1>

      <form class="form-group" @submit.prevent="submitNewEvent">
        <!-- Event Details Section -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Event Details</h2>
          </div>
          <div class="p-6">
            <!-- Title -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="new-event-title"
                class="mdc-text-field__input"
                v-model="newEvent.title"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="new-event-title">
                Event Title
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Description (Rich Text via Tiptap) -->
            <div class="mb-4">
              <label for="new-event-description" class="block text-white mb-1">
                Event Description
              </label>
              <client-only>
                <div v-if="editor" class="bg-white rounded-md border border-gray-300 p-2">
                  <!-- Toolbar Buttons -->
                  <div class="flex space-x-2 mb-2">
                    <button
                      type="button"
                      :class="[
                        'px-2 py-1 border rounded',
                        editor.isActive('bold') ? 'bg-gray-200' : 'bg-white'
                      ]"
                      @click="toggleBold"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      :class="[
                        'px-2 py-1 border rounded',
                        editor.isActive('italic') ? 'bg-gray-200' : 'bg-white'
                      ]"
                      @click="toggleItalic"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      :class="[
                        'px-2 py-1 border rounded',
                        editor.isActive('underline') ? 'bg-gray-200' : 'bg-white'
                      ]"
                      @click="toggleUnderline"
                    >
                      <u>U</u>
                    </button>
                  </div>
                  <!-- Editable Content Area -->
                  <EditorContent
                    class="min-h-[150px] focus:outline-none"
                    :editor="editor"
                  />
                </div>
                <div
                  v-else
                  class="bg-white rounded-md border border-gray-300 p-4 text-center text-gray-500"
                >
                  Loading editor…
                </div>
              </client-only>
            </div>

            <!-- Date -->
            <div class="mdc-text-field mb-4">
              <input
                type="date"
                id="new-event-date"
                class="mdc-text-field__input"
                v-model="newEvent.date"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="new-event-date">
                Event Date
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Time -->
            <div class="mdc-text-field mb-4">
              <input
                type="time"
                id="new-event-time"
                class="mdc-text-field__input"
                v-model="newEvent.time"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="new-event-time">
                Event Time
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Venue -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="new-event-venue"
                class="mdc-text-field__input"
                v-model="newEvent.venue"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="new-event-venue">
                Venue
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- City -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="new-event-city"
                class="mdc-text-field__input"
                v-model="newEvent.city"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="new-event-city">
                City
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- State -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="new-event-state"
                class="mdc-text-field__input"
                v-model="newEvent.state"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="new-event-state">
                State
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Address -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="new-event-address"
                class="mdc-text-field__input"
                v-model="newEvent.address"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="new-event-address">
                Street Address
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Contact Email -->
            <div class="mdc-text-field mb-4">
              <input
                type="email"
                id="new-event-contact-email"
                class="mdc-text-field__input"
                v-model="newEvent.contactEmail"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="new-event-contact-email">
                Contact Email
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Contact Phone -->
            <div class="mdc-text-field mb-4">
              <input
                type="tel"
                id="new-event-contact-phone"
                class="mdc-text-field__input"
                v-model="newEvent.contactPhone"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-contact-phone">
                Contact Phone
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Age Restriction -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="new-event-age-restriction"
                class="mdc-text-field__input"
                v-model="newEvent.ageRestriction"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-age-restriction">
                Age Restriction
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Event Image Section -->
        <div
          class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
        >
          <h3 class="font-semibold text-white text-2xl">Upload Event Image</h3>
        </div>
        <div class="mb-4 py-10 bg-white p-6">
          <input
            type="file"
            required
            id="new-event-image"
            class="styled-file-input"
            @change="handleNewEventImageUpload"
            accept="image/*"
          />
          <label for="new-event-image" class="styled-file-label w-full text-center">
            Choose Event Image
          </label>
          <div v-if="newEvent.imageUrl" class="mb-4">
            <img
              :src="newEvent.imageUrl"
              alt="Event Image"
              class="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <!-- Event Link Section -->
        <div class="bg-white rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Event Link</h2>
          </div>
          <div class="p-6">
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="new-event-link"
                class="mdc-text-field__input"
                v-model="newEvent.link"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-link">
                Event Link
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Social Media Links Section -->
        <div class="bg-white rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Social Media Links</h2>
          </div>
          <div class="p-6">
            <!-- Facebook -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="new-event-facebook"
                class="mdc-text-field__input"
                v-model="newEvent.facebook"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-facebook">
                Facebook URL
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Twitter -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="new-event-twitter"
                class="mdc-text-field__input"
                v-model="newEvent.twitter"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-twitter">
                Twitter URL
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Instagram -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="new-event-instagram"
                class="mdc-text-field__input"
                v-model="newEvent.instagram"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-instagram">
                Instagram URL
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- YouTube -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="new-event-youtube"
                class="mdc-text-field__input"
                v-model="newEvent.youtube"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-youtube">
                YouTube URL
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- TikTok -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="new-event-tiktok"
                class="mdc-text-field__input"
                v-model="newEvent.tiktok"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-tiktok">
                TikTok URL
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Website -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="new-event-website"
                class="mdc-text-field__input"
                v-model="newEvent.website"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="new-event-website">
                Website URL
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Band Selection Section (Optional) -->
        <div class="bg-white rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Select Band</h2>
          </div>
          <div class="p-6">
            <div class="mdc-text-field mb-4">
              <select v-model="newEvent.band" class="mdc-text-field__input">
                <option value="" disabled>Select Band (Optional)</option>
                <option v-for="band in bands" :key="band.id" :value="band.id">
                  {{ band.name }}
                </option>
              </select>
              <label class="mdc-floating-label" for="new-event-band">
                Select Band
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="mdc-button w-full mt-10">
          Create Event
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from '#imports'
import { useStrapiClient, useStrapiUser, useStrapi } from '#imports'

// 1) Import Tiptap auto-imports provided by `@tiptap/vue-3`:
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

// 2) Reactive form state
const newEvent = ref({
  title: '',
  date: '',
  time: '',
  venue: '',
  city: '',
  state: '',
  address: '',
  contactEmail: '',
  contactPhone: '',
  ageRestriction: '',
  facebook: '',
  twitter: '',
  instagram: '',
  youtube: '',
  tiktok: '',
  website: '',
  band: null as number | null,
  image: null as File | null,
  imageUrl: '' as string | null,
  link: ''
})

// 3) Create the Tiptap editor instance
const editor = useEditor({
  extensions: [
    StarterKit,
    Underline
  ],
  content: '',
  autofocus: false,
  editorProps: {
    attributes: {
      class: 'px-2 py-2 outline-none'
    }
  }
})

// 4) Toggle functions (guard against editor being null)
const toggleBold = () => {
  if (!editor.value) return
  editor.value.chain().focus().toggleBold().run()
}
const toggleItalic = () => {
  if (!editor.value) return
  editor.value.chain().focus().toggleItalic().run()
}
const toggleUnderline = () => {
  if (!editor.value) return
  editor.value.chain().focus().toggleUnderline().run()
}

// 5) The rest of your form logic
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const client = useStrapiClient()
const user = useStrapiUser()
const { update } = useStrapi()
const bands = ref<Array<{ id: number; name: string }>>([])

// 6) Handle image file input
const handleNewEventImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files![0]
  newEvent.value.image = file
  newEvent.value.imageUrl = URL.createObjectURL(file)
}

// 7) Convert “hh:mm” → Strapi “hh:mm:00.000”
const formatTime = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  return `${hours}:${minutes}:00.000`
}

// 8) Submit new event to Strapi
const submitNewEvent = async () => {
  if (!editor.value) {
    console.warn('Editor not ready')
    return
  }

  try {
    loading.value = true
    const eventForm = new FormData()

    // Grab HTML from Tiptap
    const descriptionHtml = editor.value.getHTML()

    const eventData: Record<string, unknown> = {
      title: newEvent.value.title,
      description: descriptionHtml,
      date: newEvent.value.date,
      city: newEvent.value.city,
      state: newEvent.value.state,
      venue: newEvent.value.venue,
      address: newEvent.value.address,
      time: formatTime(newEvent.value.time),
      link: newEvent.value.link,
      users_permissions_user: user.value.id,
      contactEmail: newEvent.value.contactEmail,
      contactPhone: newEvent.value.contactPhone,
      ageRestriction: newEvent.value.ageRestriction,
      facebook: newEvent.value.facebook,
      twitter: newEvent.value.twitter,
      instagram: newEvent.value.instagram,
      youtube: newEvent.value.youtube,
      tiktok: newEvent.value.tiktok,
      website: newEvent.value.website
    }

    if (newEvent.value.band) {
      eventData.band = newEvent.value.band
    }

    eventForm.append('data', JSON.stringify(eventData))

    if (newEvent.value.image) {
      eventForm.append('files.image', newEvent.value.image)
    }

    const { data: event } = await client('/events', {
      method: 'POST',
      body: eventForm
    })

    // If a QR ID was passed via query, attach it
    if (route.query.qrId) {
      await update('qrs', route.query.qrId as string, {
        event: event.id
      })
    }

    router.push('/dashboard')
  } catch (error) {
    console.error('Error creating new event:', error)
  } finally {
    loading.value = false
  }
}

// 9) On mount, fetch bands for the dropdown
onMounted(async () => {
  try {
    const response = await client('/bands', {
      params: {
        filters: {
          users_permissions_user: { id: user.value.id }
        }
      }
    })
    bands.value = response.data
    if (bands.value.length > 0) {
      newEvent.value.band = bands.value[0].id
    }
  } catch (error) {
    console.error('Error fetching bands:', error)
  }
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Title */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: white;
}

/* MDC Text Field */
.mdc-text-field {
  position: relative;
  margin-bottom: 1.5rem;
  display: inline-block;
  width: 100%;
}
.mdc-text-field__input::placeholder {
  color: transparent;
}
.mdc-text-field__input:focus::placeholder {
  color: #aaa;
}
.mdc-text-field__input {
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.75rem 0.5rem;
  border: 1px solid #000;
  border-radius: 10px;
  outline: none;
  width: 100%;
}
.mdc-floating-label {
  position: absolute;
  z-index: 99999;
  top: 0.75rem;
  left: 0.5rem;
  padding-left: 0.2em;
  padding-right: 0.2em;
  font-size: 1rem;
  background: white;
  line-height: 1;
  color: #aaa;
  pointer-events: none;
  transition: transform 0.2s, color 0.2s;
}
.mdc-text-field__input:focus + .mdc-floating-label,
.mdc-text-field__input:not(:placeholder-shown) + .mdc-floating-label {
  transform: translateY(-1.5rem);
  color: #6200ee;
}
.mdc-line-ripple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #6200ee;
  transform: scaleX(0);
  transition: transform 0.2s;
}
.mdc-text-field__input:focus ~ .mdc-line-ripple {
  transform: scaleX(1);
}

/* MDC Button */
.mdc-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.0892857143em;
  color: #fff;
  background-color: #2c2c2c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.mdc-button:hover {
  background-color: #3700b3;
}
.mdc-button:focus {
  outline: none;
}

/* Styled File Input */
.styled-file-input {
  display: none;
}
.styled-file-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.0892857143em;
  color: #fff;
  background-color: #2c2c2c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.styled-file-label:hover {
  background-color: #3700b3;
}

/* Loading Spinner */
.loading-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
