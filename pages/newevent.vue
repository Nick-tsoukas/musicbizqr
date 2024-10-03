<template>
  <div class="bg-[#000] container mx-auto max-w-5xl px-6">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div class=" bg-black ">
      <h1 class="title text-white">Create New Event</h1>
      
      <form class="form-group" @submit.prevent="submitNewEvent">
        
        <!-- Event Details Section -->
        <div class="bg-white rounded-md">
          <div class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <h2 class="font-semibold text-white text-2xl">Event Details</h2>
          </div>
          <div class="p-6">
            <div class="mdc-text-field mb-4">
              <input type="text" id="new-event-title" class="mdc-text-field__input" v-model="newEvent.title" placeholder=" " />
              <label class="mdc-floating-label" for="new-event-title">Event Title</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mdc-text-field mb-4">
              <textarea id="new-event-description" class="mdc-text-field__input" v-model="newEvent.description" placeholder=" "></textarea>
              <label class="mdc-floating-label" for="new-event-description">Event Description</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mdc-text-field mb-4">
              <input type="date" id="new-event-date" class="mdc-text-field__input" v-model="newEvent.date" placeholder=" " />
              <label class="mdc-floating-label" for="new-event-date">Event Date</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mdc-text-field mb-4">
              <input type="time" id="new-event-time" class="mdc-text-field__input" v-model="newEvent.time" placeholder=" " />
              <label class="mdc-floating-label" for="new-event-time">Event Time</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mdc-text-field mb-4">
              <input type="text" id="new-event-venue" class="mdc-text-field__input" v-model="newEvent.venue" placeholder=" " />
              <label class="mdc-floating-label" for="new-event-venue">Venue</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mdc-text-field mb-4">
              <input type="text" id="new-event-city" class="mdc-text-field__input" v-model="newEvent.city" placeholder=" " />
              <label class="mdc-floating-label" for="new-event-city">City</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mdc-text-field mb-4">
              <input type="text" id="new-event-state" class="mdc-text-field__input" v-model="newEvent.state" placeholder=" " />
              <label class="mdc-floating-label" for="new-event-state">State</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mdc-text-field mb-4">
              <input type="text" id="new-event-address" class="mdc-text-field__input" v-model="newEvent.address" placeholder=" " />
              <label class="mdc-floating-label" for="new-event-address">Street Address</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Event Image Section -->
        <div class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
          <h3 class="font-semibold text-white text-2xl">Upload Event Image</h3>
        </div>
        <div class="mb-4 py-10 bg-white p-6">
          <input type="file" id="new-event-image" class="styled-file-input" @change="handleNewEventImageUpload" accept="image/*" />
          <label for="new-event-image" class="styled-file-label w-full text-center">Choose Event Image</label>
          <div v-if="newEvent.imageUrl" class="mb-4">
            <img :src="newEvent.imageUrl" alt="Event Image" class="w-full h-auto rounded-lg shadow-md" />
          </div>
        </div>

        <!-- Event Link Section -->
        <div class="bg-white rounded-md">
          <div class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <h2 class="font-semibold text-white text-2xl">Event Link</h2>
          </div>
          <div class="p-6">
            <div class="mdc-text-field mb-4">
              <input type="url" id="new-event-link" class="mdc-text-field__input" v-model="newEvent.link" placeholder=" " />
              <label class="mdc-floating-label" for="new-event-link">Event Link</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Band Selection Section (Optional) -->
        <div class="bg-white rounded-md">
          <div class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <h2 class="font-semibold text-white text-2xl">Select Band</h2>
          </div>
          <div class="p-6">
            <div class="mdc-text-field mb-4">
              <select v-model="newEvent.band" class="mdc-text-field__input">
                <option value="" disabled>Select Band (Optional)</option>
                <option v-for="band in bands" :key="band.id" :value="band.id">{{ band.attributes.name }}</option>
              </select>
              <label class="mdc-floating-label" for="new-event-band">Select Band</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <button type="submit" class="mdc-button w-full mt-10">Create Event</button>
      </form>
    </div>
  </div>
</template>

<script setup>


const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
const user = useStrapiUser();
const { update } = useStrapi();
const loading = ref(false)
const newEvent = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  state: '',
  city: '',
  address: '',
  venue: '',
  link: '',
  image: null,
  imageUrl: null,
  band: null,  // Optional association with band
});

const bands = ref([]);

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}:00.000`;
};

const handleNewEventImageUpload = (event) => {
  const file = event.target.files[0];
  newEvent.value.image = file;
  newEvent.value.imageUrl = URL.createObjectURL(file);
};

const submitNewEvent = async () => {
  try {
    loading.value = true;
    const eventForm = new FormData();
    const eventData = {
      title: newEvent.value.title,
      description: newEvent.value.description,
      date: newEvent.value.date,
      city: newEvent.value.city,
      state: newEvent.value.state,
      venue: newEvent.value.venue,
      address: newEvent.value.address,
      time: formatTime(newEvent.value.time),
      link: newEvent.value.link,
      users_permissions_user: user.value.id,
    };

    if (newEvent.value.band) {
      eventData.band = newEvent.value.band;
    }

    eventForm.append('data', JSON.stringify(eventData));

    if (newEvent.value.image) {
      eventForm.append('files.image', newEvent.value.image);
    }

    const { data: event } = await client('/events', {
      method: 'POST',
      body: eventForm,
    });

    if (route.query.qrId) {
      await update('qrs', route.query.qrId, {
        event: event.id,
      });
    }

    router.push('/dashboard');
  } catch (error) {
    loading.value = false
    console.error('Error creating new event:', error);
  }
};

onMounted(async () => {
  try {
    const response = await client('/bands', {
      params: {
        filters: {
          users_permissions_user: {
            id: user.value.id,
          },
        },
      },
    });
    bands.value = response.data;
  } catch (error) {
    console.error('Error fetching bands:', error);
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
  padding-left: .2em;
  padding-right: .2em;
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
  background-color: #2C2C2C;
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
  background-color: #2C2C2C;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.styled-file-label:hover {
  background-color: #3700b3;
}
</style>
