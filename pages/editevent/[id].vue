<template>
  <div class="container-mdc">
    <h1 class="title">Edit Event</h1>
    <form @submit.prevent="submitEditEvent">
      <div class="form-group">
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-event-title" class="mdc-text-field__input" v-model="event.title" placeholder=" " />
          <label class="mdc-floating-label" for="edit-event-title">Event Title</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <textarea id="edit-event-description" class="mdc-text-field__input" v-model="event.description" placeholder=" "></textarea>
          <label class="mdc-floating-label" for="edit-event-description">Event Description</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="date" id="edit-event-date" class="mdc-text-field__input" v-model="event.date" placeholder=" " />
          <label class="mdc-floating-label" for="edit-event-date">Event Date</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-event-venue" class="mdc-text-field__input" v-model="event.venue" placeholder=" " />
          <label class="mdc-floating-label" for="edit-event-venue">Venue</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-event-city" class="mdc-text-field__input" v-model="event.city" placeholder=" " />
          <label class="mdc-floating-label" for="edit-event-city">City</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-event-state" class="mdc-text-field__input" v-model="event.state" placeholder=" " />
          <label class="mdc-floating-label" for="edit-event-state">State</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-event-address" class="mdc-text-field__input" v-model="event.address" placeholder=" " />
          <label class="mdc-floating-label" for="edit-event-address">Street Address</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="time" id="edit-event-time" class="mdc-text-field__input" v-model="event.time" placeholder=" " />
          <label class="mdc-floating-label" for="edit-event-time">Event Time</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="url" id="edit-event-link" class="mdc-text-field__input" v-model="event.link" placeholder=" " />
          <label class="mdc-floating-label" for="edit-event-link">Event Link</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mb-4">
          <input type="file" id="edit-event-image" class="styled-file-input" @change="handleEventImageUpload" accept="image/*" />
          <label for="edit-event-image" class="styled-file-label">Choose Event Image</label>
        </div>
        <div v-if="event.imageUrl" class="mb-4">
          <img :src="event.imageUrl" alt="Event Image" class="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div class="mdc-text-field mb-4">
          <select v-model="event.band" class="mdc-text-field__input">
            <option value="" disabled>Select Band (Optional)</option>
            <option v-for="band in bands" :key="band.id" :value="band.id">{{ band.attributes.name }}</option>
          </select>
          <label class="mdc-floating-label" for="edit-event-band">Select Band</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <button type="submit" class="mdc-button mb-4 w-full">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script setup>


const route = useRoute();
const router = useRouter();
const client = useStrapiClient();
const user = useStrapiUser();

const event = ref({
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
  band: null,
});
const bands = ref([]);

const fetchEvent = async () => {
  const eventId = route.params.id;
  try {
    const response = await client(`/events/${eventId}`, {
      populate: ['band', 'image'],
    });
    const data = response.data;
    event.value = {
      ...data.attributes,
      imageUrl: data.attributes.image ? data.attributes.image.url : null,
      band: data.attributes.band ? data.attributes.band.id : null,
    };
  } catch (error) {
    console.error('Error fetching event:', error);
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
    const eventForm = new FormData();
    const eventData = {
      title: event.value.title,
      description: event.value.description,
      date: event.value.date,
      time: event.value.time,
      city: event.value.city,
      state: event.value.state,
      venue: event.value.venue,
      address: event.value.address,
      link: event.value.link,
      users_permissions_user: user.value.id,
    };

    if (event.value.band) {
      eventData.band = event.value.band;
    }

    eventForm.append('data', JSON.stringify(eventData));

    if (event.value.image) {
      eventForm.append('files.image', event.value.image);
    }

    await client(`/events/${eventId}`, {
      method: 'PUT',
      body: eventForm,
    });

    router.push('/dashboard');
  } catch (error) {
    console.error('Error updating event:', error);
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
        populate: ['users_permissions_user'],
      },
    });
    bands.value = response.data;
    await fetchEvent();
  } catch (error) {
    console.error('Error fetching bands:', error);
  }
});
</script>

<style>
/* Add your styles here */
</style>
