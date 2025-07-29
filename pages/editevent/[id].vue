<template>
  <div class="container mx-auto max-w-5xl pt-[var(--header-height)]">
    <h1 class="text-white text-3xl font-bold mb-10">Edit Event</h1>
    <form @submit.prevent="submitEditEvent">
      <!-- Event Details Section -->
      <div class="bg-white mb-10">
        <div
          class="flex flex-col bg-[#000] p-6 mb-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2 class="font-semibold text-white text-2xl">Event Details</h2>
        </div>
        <div class="p-6">
          <div class="mdc-text-field mb-4">
            <input
              type="text"
              id="edit-event-title"
              class="mdc-text-field__input"
              v-model="event.title"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-title">
              Event Title
            </label>
            <div class="mdc-line-ripple"></div>
          </div>

          <!-- Tiptap block -->
          <div class="mb-4">
            <label for="edit-event-description" class="block text-black mb-1">
              Event Description
            </label>
            <client-only>
              <div
                v-if="editor"
                class="bg-white rounded-md border border-gray-300 p-2"
              >
                <!-- Toolbar Buttons -->
                <div class="flex space-x-2 mb-2">
                  <button
                    type="button"
                    :class="[
                      'px-2 py-1 border rounded',
                      editor.isActive('bold') ? 'bg-gray-200' : 'bg-white',
                    ]"
                    @click="toggleBold"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    :class="[
                      'px-2 py-1 border rounded',
                      editor.isActive('italic') ? 'bg-gray-200' : 'bg-white',
                    ]"
                    @click="toggleItalic"
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    :class="[
                      'px-2 py-1 border rounded',
                      editor.isActive('underline') ? 'bg-gray-200' : 'bg-white',
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
        </div>
      </div>

      <!-- Event Date and Time Section -->
      <div class="bg-white">
        <div
          class="flex flex-col bg-[#000] p-6 mb-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2 class="font-semibold text-white text-2xl">Event Details</h2>
        </div>
        <div class="p-6">
          <div class="mdc-text-field mb-4">
            <input
              type="date"
              id="edit-event-date"
              class="mdc-text-field__input"
              v-model="event.date"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-date">
              Event Date
            </label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input
              type="time"
              id="edit-event-time"
              class="mdc-text-field__input"
              v-model="event.time"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-time">
              Event Time
            </label>
            <div class="mdc-line-ripple"></div>
          </div>
        </div>
      </div>

      <!-- Event Location and Link Section -->
      <div class="bg-white mt-10">
        <div
          class="flex flex-col bg-[#000] p-6 mb-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2 class="font-semibold text-white text-2xl">
            Event Location and Link
          </h2>
        </div>
        <div class="p-6">
          <div class="mdc-text-field mb-4">
            <input
              type="text"
              id="edit-event-venue"
              class="mdc-text-field__input"
              v-model="event.venue"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-venue">
              Venue
            </label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input
              type="text"
              id="edit-event-city"
              class="mdc-text-field__input"
              v-model="event.city"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-city">City</label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input
              type="text"
              id="edit-event-state"
              class="mdc-text-field__input"
              v-model="event.state"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-state"
              >State</label
            >
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input
              type="text"
              id="edit-event-address"
              class="mdc-text-field__input"
              v-model="event.address"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-address">
              Street Address
            </label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input
              type="text"
              id="edit-event-link"
              class="mdc-text-field__input"
              v-model="event.link"
              @blur="event.link = normalizeLink(event.link)"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-link"
              >Ticket Link</label
            >
            <div class="mdc-line-ripple"></div>
          </div>
          <!-- Contact Phone -->
          <div class="mdc-text-field mb-4">
            <input
              type="tel"
              id="edit-event-phone"
              class="mdc-text-field__input"
              v-model="event.contactPhone"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-phone"
              >Contact Phone</label
            >
            <div class="mdc-line-ripple"></div>
          </div>

          <!-- Contact Email -->
          <div class="mdc-text-field mb-4">
            <input
              type="email"
              id="edit-event-email"
              class="mdc-text-field__input"
              v-model="event.contactEmail"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-email"
              >Contact Email</label
            >
            <div class="mdc-line-ripple"></div>
          </div>
        </div>
      </div>

      <!-- Event Image Section -->
      <div class="mt-10 bg-white">
        <div
          class="flex flex-col bg-[#000] p-6 mb-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2 class="font-semibold text-white text-2xl">Event Image</h2>
        </div>
        <div class="mb-4 p-6">
          <div v-if="event.imageUrl" class="mb-4 mx-auto max-w-[500px]">
            <img
              :src="event.imageUrl"
              alt="Event Image"
              class="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <input
            type="file"
            id="edit-event-image"
            class="styled-file-input"
            @change="handleEventImageUpload"
            accept="image/*"
          />
          <label
            for="edit-event-image"
            class="styled-file-label w-full text-center"
          >
            Choose Event Image
          </label>
        </div>
      </div>

      <!-- Select Band Section -->
      <div class="mt-10 bg-white">
        <div
          class="flex flex-col bg-[#000] p-6 mb-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2 class="font-semibold text-white text-2xl">Choose Band</h2>
        </div>
        <div class="p-6">
          <div class="mdc-text-field mb-4">
            <select v-model="event.band" class="mdc-text-field__input">
              <option value="" disabled>Select Band (Optional)</option>
              <option v-for="band in bands" :key="band.id" :value="band.id">
                {{ band.name }}
              </option>
            </select>
            <label class="mdc-floating-label" for="edit-event-band">
              Select Band
            </label>
            <div class="mdc-line-ripple"></div>
          </div>
        </div>
      </div>

      <!-- Save Changes Button -->
      <button type="submit" class="mdc-button mb-4 w-full mt-10">
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const client = useStrapiClient();
const user = useStrapiUser();
const loading = ref(false);

import { parse, format } from "date-fns";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const event = ref({
  title: "",
  description: {} as any, // ← use `any` so it can hold ProseMirror JSON
  date: "",
  time: "",
  state: "",
  city: "",
  address: "",
  venue: "",
  link: "",
  contactEmail: "",
  contactPhone: "",
  image: null as File | null,
  imageUrl: null as string | null,
  band: null as number | null,
});

function normalizeLink(link: string): string {
  if (!link) return "";

  // Already has a protocol → return as-is
  if (/^https?:\/\//i.test(link)) return link.trim();

  // Starts with www → add https://
  if (/^www\./i.test(link)) return `https://${link.trim()}`;

  // Otherwise assume https://
  return `https://www.${link.trim()}`;
}

// Toggle Bold / Italic / Underline helpers
const toggleBold = () => {
  if (!editor.value) return;
  editor.value.chain().focus().toggleBold().run();
};
const toggleItalic = () => {
  if (!editor.value) return;
  editor.value.chain().focus().toggleItalic().run();
};
const toggleUnderline = () => {
  if (!editor.value) return;
  editor.value.chain().focus().toggleUnderline().run();
};

// 1) Initialize Tiptap editor (starts empty; we’ll set content when fetched)
const editor = useEditor({
  extensions: [StarterKit, Underline],
  content: "",
  autofocus: false,
  editorProps: {
    attributes: {
      class: "px-2 py-2 outline-none",
    },
  },
});

const bands = ref<Array<{ id: number; name: string }>>([]);
const selectedBandId = ref(null as number | null);

const fetchEvent = async () => {
  const eventId = route.params.id as string;
  try {
    // — Use response.data.attributes, not response.data.data.attributes —
    const { data } = await client(`/events/${eventId}`, {
      params: {
        populate: {
          band: { populate: "*" },
          image: { populate: "*" },
        },
      },
    });
    // `data` is now the Strapi object with an `attributes` field
    const attrs = data.attributes;

    selectedBandId.value = attrs.band?.data?.id || null;

    event.value = {
      title: attrs.title,
      description: attrs.description || "",
      date: attrs.date,
      time: attrs.time ? attrs.time.slice(0, 5) : "",
      state: attrs.state,
      city: attrs.city,
      address: attrs.address,
      venue: attrs.venue,
      contactEmail: attrs.contactEmail,
      contactPhone: attrs.contactPhone,
      link: attrs.link,
      image: null,
      imageUrl: attrs.image?.data?.attributes?.url || null,
      band: attrs.band?.data?.id || null,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

const handleEventImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files![0];
  event.value.image = file;
  event.value.imageUrl = URL.createObjectURL(file);
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  try {
    const parsedTime = parse(timeStr, "HH:mm", new Date());
    return format(parsedTime, "HH:mm:ss.SSS");
  } catch (error) {
    console.error("Error parsing/formatting time:", error);
    return timeStr;
  }
};

const submitEditEvent = async () => {
  const eventId = route.params.id as string;
  try {
    loading.value = true;
    const eventForm = new FormData();

    // — Always pull from Tiptap, not from event.value.description —
    const descriptionJson = editor.value?.getJSON() || {
      type: "doc",
      content: [],
    };

    const eventData: Record<string, unknown> = {
      title: event.value.title || undefined,
      description: descriptionJson, // ← now sending JSON
      date: event.value.date || undefined,
      time: formatTime(event.value.time) || undefined,
      city: event.value.city || undefined,
      state: event.value.state || undefined,
      venue: event.value.venue || undefined,
      address: event.value.address || undefined,
      contactPhone: event.value.contactPhone || undefined,
      contactEmail: event.value.contactEmail || undefined,
      link: normalizeLink(event.value.link) || undefined,
      users_permissions_user: user.value.id,
    };

    if (event.value.band) {
      eventData.band = event.value.band;
    }

    eventForm.append("data", JSON.stringify(eventData));

    if (event.value.image) {
      eventForm.append("files.image", event.value.image);
    }

    await client(`/events/${eventId}`, {
      method: "PUT",
      body: eventForm,
    });

    router.push("/dashboard");
  } catch (error) {
    loading.value = false;
    console.error("Error updating event:", error);
  }
};

onMounted(async () => {
  try {
    // Fetch bands for dropdown
    const response = await client("/bands", {
      params: {
        filters: {
          users_permissions_user: { id: user.value.id },
        },
        populate: ["users_permissions_user"],
      },
    });
    console.log("this is the response ", response.data);
    bands.value = response.data.map((b: any) => ({
      id: b.id,
      name: b.name,
    }));
  } catch (error) {
    console.error("Error fetching bands:", error);
  }

  await fetchEvent();
});

// 2) Once `event.description` is fetched, push into Tiptap
watch(
  () => event.value.description,
  (newDesc) => {
    if (editor.value && newDesc !== undefined) {
      editor.value.commands.setContent(newDesc, false);
    }
  }
);

// 3) Removed the “editor.on('update')” watcher entirely
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.container-mdc {
  max-width: 90vw;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ProseMirror {
  white-space: pre-wrap;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: white;
}

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
  transition:
    transform 0.2s,
    color 0.2s;
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
</style>
