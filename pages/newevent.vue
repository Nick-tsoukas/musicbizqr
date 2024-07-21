<template>
  <div class="container-mdc">
    <h1 class="title">Create New Event </h1>
    <form @submit.prevent="submitNewEvent">
      <div class="form-group">
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
        <div class="mdc-text-field mb-4">
          <input type="time" id="new-event-time" class="mdc-text-field__input" v-model="newEvent.time" placeholder=" " />
          <label class="mdc-floating-label" for="new-event-time">Event Time</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="url" id="new-event-link" class="mdc-text-field__input" v-model="newEvent.link" placeholder=" " />
          <label class="mdc-floating-label" for="new-event-link">Event Link</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mb-4">
          <input type="file" id="new-event-image" class="styled-file-input" @change="handleNewEventImageUpload" accept="image/*" />
          <label for="new-event-image" class="styled-file-label">Choose Event Image</label>
        </div>
        <div v-if="newEvent.imageUrl" class="mb-4">
          <img :src="newEvent.imageUrl" alt="Event Image" class="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div class="mdc-text-field mb-4">
          <select v-model="newEvent.band" class="mdc-text-field__input">
            <option value="" disabled>Select Band (Optional)</option>
            <option v-for="band in bands" :key="band.id" :value="band.id">{{ band.attributes.name }}</option>
          </select>
          <label class="mdc-floating-label" for="new-event-band">Select Band</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <button type="submit" class="mdc-button mb-4 w-full">Create Event</button>
      </div>
    </form>
    <pre>{{ bands }} this is band </pre>
  </div>
</template>

<script setup>


const router = useRouter();
const client = useStrapiClient();
const user = useStrapiUser()

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
console.log(user.value.id, ' this is user')
const formatTime = (time) => {
  // Ensure time is in HH:mm:ss.SSS format
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
      users_permissions_user: user.value.id, // Associate the event with the current user
    };

    // Add band only if selected
    if (newEvent.value.band) {
      eventData.band = newEvent.value.band;
    }

    eventForm.append('data', JSON.stringify(eventData));

    if (newEvent.value.image) {
      eventForm.append('files.image', newEvent.value.image);
    }

    await client('/events', {
      method: 'POST',
      body: eventForm,
    });

    // router.push('/events'); // Redirect to events page or any other page after successful creation
  } catch (error) {
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
        populate: ['users_permissions_user'], // Populate the user relation if needed
      },
    });
    console.log(bands.value, 'this is bands')
    bands.value = response.data;
  } catch (error) {
    console.error('Error fetching bands associated with the user:', error);
  }
});
</script>

