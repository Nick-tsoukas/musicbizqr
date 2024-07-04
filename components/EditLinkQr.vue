<template>
  <div class="container-mdc">
    <h1 class="title">Edit {{props.name}}</h1>
    <div>
        <p><span class="font-semibold">Type</span> {{ props.q_type }}</p>
    </div>
    <div class="mb-6">
        <img :src="props.q_image" alt="">
    </div>
    <form @submit.prevent="updateLink">
      <div class="mdc-text-field mdc-text-field--filled">
        <input
          id="link"
          v-model="formData.name"
          type="text"
          class="mdc-text-field__input"
          placeholder="name"
        />
        <label for="link" class="mdc-floating-label">Name</label>
        <span class="mdc-line-ripple"></span>
        <img
          src="@/assets/cancel-icon.svg"
          alt="Cancel Icon"
          class="cancel-icon"
          @click="clearInputName"
        />
      </div>
      <div class="mdc-text-field mdc-text-field--filled">
        <input
          id="link"
          v-model="formData.link"
          type="text"
          class="mdc-text-field__input"
          placeholder="Link"
        />
        <label for="link" class="mdc-floating-label">Link</label>
        <span class="mdc-line-ripple"></span>
        <img
          src="@/assets/cancel-icon.svg"
          alt="Cancel Icon"
          class="cancel-icon"
          @click="clearInput"
        />
      </div>
      <button type="submit" class="mdc-button mdc-button--raised">Update Link</button>
    </form>

  </div>
</template>

<script setup>

const { update } = useStrapi()
// Initialize form data with the provided props
const props = defineProps({
  name: {
    type: String,
    default: 'Default Title'
  },
  qr: {
    type: Object
  },
  url: {
    type: String,
    default: ''
  },
  q_image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  q_type: {
    type: String
  },
  link: {
    type: String,
    default: null
  },
  qrId: {
    type: Number
  }
})



const formData = ref({
  link: props.link,
  name: props.name
})

// Function to handle form submission
const updateLink = async () => {
  try {
    const data = await update('qrs', props.qrId, {
      link: formData.value.link,
      name: formData.value.name
    })
    console.log(data)
  } catch (error) {
    console.log('There was an error:', error)
  }
}

const clearInput = () => {
  formData.value.link = ''
}
const clearInputName = () => {
  formData.value.name = ''
}

watch(() => props.link, (newLink) => {
  formData.value.link = newLink
})

watch(() => props.name, (newName) => {
  formData.value.name = newName
})
</script>

<style scoped>
/* Basic Container Styling */
.container-mdc {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Title Styling */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

/* Material Design Text Field Styling */
.mdc-text-field {
  position: relative;
  margin-bottom: 1.5rem;
  display: inline-block;
  width: 100%;
}

.mdc-text-field__input {
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.75rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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

/* Button Styling */
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
  background-color: #6200ee;
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

.cancel-icon {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>
