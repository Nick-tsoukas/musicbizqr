<template>
  <div class="container mx-auto max-w-5xl">
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
            <label class="mdc-floating-label" for="edit-event-title"
              >Event Title</label
            >
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <textarea
              id="edit-event-description"
              class="mdc-text-field__input"
              v-model="event.description"
              placeholder=" "
            ></textarea>
            <label class="mdc-floating-label" for="edit-event-description"
              >Event Description</label
            >
            <div class="mdc-line-ripple"></div>
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
            <label class="mdc-floating-label" for="edit-event-date"
              >Event Date</label
            >
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
            <label class="mdc-floating-label" for="edit-event-time"
              >Event Time</label
            >
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
            <label class="mdc-floating-label" for="edit-event-venue"
              >Venue</label
            >
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
            <label class="mdc-floating-label" for="edit-event-address"
              >Street Address</label
            >
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input
              type="url"
              id="edit-event-link"
              class="mdc-text-field__input"
              v-model="event.link"
              placeholder=" "
            />
            <label class="mdc-floating-label" for="edit-event-link"
              >Event Link</label
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
            >Choose Event Image</label
          >
        </div>
        <div v-if="event.imageUrl" class="mb-4 mx-auto max-w-[500px]">
          <img
            :src="event.imageUrl"
            alt="Event Image"
            class="w-full h-auto rounded-lg shadow-md"
          />
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
            <label class="mdc-floating-label" for="edit-event-band"
              >Select Band</label
            >
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

<script setup>
const route = useRoute();
const router = useRouter();
const client = useStrapiClient();
const user = useStrapiUser();
const loading = ref(false);

const event = ref({
  title: "",
  description: "",
  date: "",
  time: "",
  state: "",
  city: "",
  address: "",
  venue: "",
  link: "",
  image: null,
  imageUrl: null,
  band: null,
});
const bands = ref([]);
const selectedBandId = ref(null); // Selected band ID


const fetchEvent = async () => {
  const eventId = route.params.id;
  try {
    const response = await client(`/events/${eventId}`, {
      params: {
        populate: {
          band: { populate: "*" }, // Correctly populates band relation
          image: { populate: "*" }, // Ensures image is included
        },
      },
    });

    console.log("Fetched Event Data:", response.data); // Debugging output

    const data = response.data;
    selectedBandId.value = response.data.attributes.band?.data?.id || null; // Preselect band


    event.value = {
      ...data.attributes,
      imageUrl: data.attributes.image?.data?.attributes?.url || null,
      band: data.attributes.band?.data?.id || null, // Extracts band ID
    };
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

const handleEventImageUpload = (e) => {
  const file = e.target.files[0];
  event.value.image = file;
  event.value.imageUrl = URL.createObjectURL(file);
};

const submitEditEvent = async () => {
  const eventId = route.params.id;
  try {
    loading.value = true;
    const eventForm = new FormData();
    const eventData = {
      title: event.value.title ?? undefined,
      description: event.value.description ?? undefined,
      date: event.value.date ?? undefined,
      time: event.value.time ?? undefined,
      city: event.value.city ?? undefined,
      state: event.value.state ?? undefined,
      venue: event.value.venue ?? undefined,
      address: event.value.address ?? undefined,
      link: event.value.link ?? undefined,
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
    const response = await client("/bands", {
      params: {
        filters: {
          users_permissions_user: {
            id: user.value.id,
          },
        },
        populate: ["users_permissions_user"],
      },
    });
    bands.value = response.data;
    console.log('users bands ' , response.data)
    await fetchEvent();
  } catch (error) {
    console.error("Error fetching bands:", error);
  }
});
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
