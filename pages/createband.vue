<template>
  <div class="container-mdc">
    <h1 class="title">Create Band Profile</h1>
    <form @submit.prevent="submitForm">
      <h2 class="mb-8 font-semibold">Band Details</h2>
      
      <!-- Band Name -->
      <div class="mdc-text-field">
        <input type="text" id="band-name" class="mdc-text-field__input" v-model="bandName" placeholder=" " required />
        <label class="mdc-floating-label" for="band-name">Band Name</label>
        <div class="mdc-line-ripple"></div>
      </div>

      <!-- Genre -->
      <div class="mdc-text-field">
        <input type="text" id="genre" class="mdc-text-field__input" v-model="genre" placeholder=" " required />
        <label class="mdc-floating-label" for="genre">Genre</label>
        <div class="mdc-line-ripple"></div>
      </div>

      <!-- Bio -->
      <div class="mdc-text-field">
        <textarea id="bio" class="mdc-text-field__input" v-model="bio" placeholder=" " required></textarea>
        <label class="mdc-floating-label" for="bio">Bio</label>
        <div class="mdc-line-ripple"></div>
      </div>

      <h2 class="mb-8 font-semibold">Upload Image</h2>
      <!-- Band Image -->
      <div class="mb-4">
        <input type="file" id="band-img" class="styled-file-input" @change="handleImageUpload" accept="image/*" />
        <label for="band-img" class="styled-file-label">Choose Band Image</label>
      </div>
      <div v-if="bandImgUrl" class="mb-4">
        <img :src="bandImgUrl" alt="Band Image" class="w-full h-auto rounded-lg shadow-md" />
      </div>

      <h2 class="mb-8 font-semibold">Band Members</h2>
      <!-- Members -->
      <div v-for="(member, index) in members" :key="index" class="member-container">
        <div class="mdc-text-field mb-4">
          <input type="text" :id="'member-name-' + index" class="mdc-text-field__input" v-model="member.name" placeholder=" " required />
          <label class="mdc-floating-label" :for="'member-name-' + index">Member Name</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" :id="'instrument-' + index" class="mdc-text-field__input" v-model="member.instrument" placeholder=" " required />
          <label class="mdc-floating-label" :for="'instrument-' + index">Instrument</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mb-4">
          <input type="file" :id="'member-img-' + index" class="styled-file-input" @change="(event) => handleMemberImageUpload(event, index)" accept="image/*" />
          <label :for="'member-img-' + index" class="styled-file-label">Choose Member Image</label>
        </div>
        <div v-if="member.imageUrl" class="mb-4">
          <img :src="member.imageUrl" alt="Member Image" class="w-full h-auto rounded-lg shadow-md" />
        </div>
        <button type="button" class="mdc-button mb-4 w-full" @click="removeMember(index)">Remove Member</button>
      </div>
      <button type="button" class="mdc-button mb-8 w-full" @click="addMember">+ Add Member</button>

      <h2 class="mb-8 font-semibold">Social Media Links</h2>
      <!-- Social Media Links -->
      <div class="mdc-text-field mb-4">
        <input type="url" id="facebook" class="mdc-text-field__input" v-model="facebook" placeholder=" " />
        <label class="mdc-floating-label" for="facebook">Facebook</label>
        <div class="mdc-line-ripple"></div>
      </div>
      <div class="mdc-text-field mb-4">
        <input type="url" id="instagram" class="mdc-text-field__input" v-model="instagram" placeholder=" " />
        <label class="mdc-floating-label" for="instagram">Instagram</label>
        <div class="mdc-line-ripple"></div>
      </div>
      <div class="mdc-text-field mb-4">
        <input type="url" id="twitch" class="mdc-text-field__input" v-model="twitch" placeholder=" " />
        <label class="mdc-floating-label" for="twitch">Twitch</label>
        <div class="mdc-line-ripple"></div>
      </div>

      <h2 class="mb-8 font-semibold">Streaming Links</h2>
      <!-- Streaming Links -->
      <div class="mdc-text-field mb-4">
        <input type="url" id="appleMusic" class="mdc-text-field__input" v-model="appleMusic" placeholder=" " />
        <label class="mdc-floating-label" for="appleMusic">Apple Music</label>
        <div class="mdc-line-ripple"></div>
      </div>
      <div class="mdc-text-field mb-4">
        <input type="url" id="spotify" class="mdc-text-field__input" v-model="spotify" placeholder=" " />
        <label class="mdc-floating-label" for="spotify">Spotify</label>
        <div class="mdc-line-ripple"></div>
      </div>
      <div class="mdc-text-field mb-4">
        <input type="url" id="soundcloud" class="mdc-text-field__input" v-model="soundcloud" placeholder=" " />
        <label class="mdc-floating-label" for="soundcloud">SoundCloud</label>
        <div class="mdc-line-ripple"></div>
      </div>

      <button type="submit" class="mdc-button w-full">Create Profile</button>
    </form>
  </div>
</template>

<script setup>
const route = useRoute();
const bandName = ref('');
const genre = ref('');
const bio = ref('');
const bandImg = ref(null);
const bandImgUrl = ref(null);
const members = ref([{ name: '', instrument: '', image: null, imageUrl: null }]);
const facebook = ref('');
const instagram = ref('');
const twitch = ref('');
const appleMusic = ref('');
const spotify = ref('');
const soundcloud = ref('');
const qrId = route.query.qrId || null;

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  bandImg.value = file;
  bandImgUrl.value = URL.createObjectURL(file);
};

const handleMemberImageUpload = (event, index) => {
  const file = event.target.files[0];
  members.value[index].image = file;
  members.value[index].imageUrl = URL.createObjectURL(file);
};

const addMember = () => {
  members.value.push({ name: '', instrument: '', image: null, imageUrl: null });
};

const removeMember = (index) => {
  members.value.splice(index, 1);
};

const submitForm = () => {
  const formData = new FormData();
  formData.append('bandName', bandName.value);
  formData.append('genre', genre.value);
  formData.append('bio', bio.value);
  formData.append('bandImg', bandImg.value);
  formData.append('facebook', facebook.value);
  formData.append('instagram', instagram.value);
  formData.append('twitch', twitch.value);
  formData.append('appleMusic', appleMusic.value);
  formData.append('spotify', spotify.value);
  formData.append('soundcloud', soundcloud.value);
  formData.append('qrId', qrId);

  members.value.forEach((member, index) => {
    formData.append(`members[${index}][name]`, member.name);
    formData.append(`members[${index}][instrument]`, member.instrument);
    formData.append(`members[${index}][image]`, member.image);
  });

  // Use fetch or axios to submit the formData to the server
  console.log('Form data:', formData);
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.btn {
  @apply bg-neon-green hover:bg-neon-purple text-black font-bold py-2 px-4 rounded shadow-lg;
}

.container-mdc {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
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

.member-container {
  margin: 0;
}

.mdc-text-field.mb-4 {
  margin-bottom: 1rem;
}
</style>
