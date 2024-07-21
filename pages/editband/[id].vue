<template>
  <div class="container-mdc">
    <h1 class="title">Edit Band</h1>
    <form @submit.prevent="submitEditBand">
      <div class="form-group">
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-band-name" class="mdc-text-field__input" v-model="band.name" placeholder=" " required />
          <label class="mdc-floating-label" for="edit-band-name">Band Name</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-band-genre" class="mdc-text-field__input" v-model="band.genre" placeholder=" " required />
          <label class="mdc-floating-label" for="edit-band-genre">Genre</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <textarea id="edit-band-bio" class="mdc-text-field__input" v-model="band.bio" placeholder=" " required></textarea>
          <label class="mdc-floating-label" for="edit-band-bio">Bio</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mb-4">
          <input type="file" id="edit-band-image" class="styled-file-input" @change="handleBandImageUpload" accept="image/*" />
          <label for="edit-band-image" class="styled-file-label">Choose Band Image</label>
        </div>
        <div v-if="band.imageUrl" class="mb-4">
          <img :src="band.imageUrl" alt="Band Image" class="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-band-facebook" class="mdc-text-field__input" v-model="band.facebook" placeholder=" " />
          <label class="mdc-floating-label" for="edit-band-facebook">Facebook</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-band-instagram" class="mdc-text-field__input" v-model="band.instagram" placeholder=" " />
          <label class="mdc-floating-label" for="edit-band-instagram">Instagram</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-band-twitch" class="mdc-text-field__input" v-model="band.twitch" placeholder=" " />
          <label class="mdc-floating-label" for="edit-band-twitch">Twitch</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-band-appleMusic" class="mdc-text-field__input" v-model="band.appleMusic" placeholder=" " />
          <label class="mdc-floating-label" for="edit-band-appleMusic">Apple Music</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-band-soundcloud" class="mdc-text-field__input" v-model="band.soundcloud" placeholder=" " />
          <label class="mdc-floating-label" for="edit-band-soundcloud">SoundCloud</label>
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
const { findOne } = useStrapi();
const user = useStrapiUser();
const client = useStrapiClient()

const band = ref({
  name: '',
  genre: '',
  bio: '',
  bandImg: null,
  imageUrl: null,
  facebook: '',
  instagram: '',
  twitch: '',
  appleMusic: '',
  soundcloud: '',
});
const fetchBand = async () => {
  const bandId = route.params.id;
  console.log('Getting band with ID:', bandId);
  try {
    const response = await findOne('bands', bandId, {
      populate: ['bandImg'],
    });

    if (response.data) {
      const attributes = response.data.attributes;
      band.value = {
        name: attributes.name,
        genre: attributes.genre,
        bio: attributes.bio,
        bandImg: attributes.bandImg ? attributes.bandImg.data : null,
        imageUrl: attributes.bandImg ? attributes.bandImg.data.attributes.url : null,
        facebook: attributes.facebook || '',
        instagram: attributes.instagram || '',
        twitch: attributes.twitch || '',
        appleMusic: attributes.appleMusic || '',
        soundcloud: attributes.soundcloud || '',
      };
      console.log('Fetched band data:', band.value);
    } else {
      console.log('No data found for band ID:', bandId);
    }
  } catch (error) {
    console.error('Error fetching band:', error);
  }
};

const handleBandImageUpload = (e) => {
  const file = e.target.files[0];
  band.value.bandImg = file;
  band.value.imageUrl = URL.createObjectURL(file);
};

const submitEditBand = async () => {
  const bandId = route.params.id;
  try {
    const bandForm = new FormData();
    const bandData = {
      name: band.value.name,
      genre: band.value.genre,
      bio: band.value.bio,
      facebook: band.value.facebook,
      instagram: band.value.instagram,
      twitch: band.value.twitch,
      appleMusic: band.value.appleMusic,
      soundcloud: band.value.soundcloud,
      users_permissions_user: user.value.id,
    };

    bandForm.append('data', JSON.stringify(bandData));

    if (band.value.bandImg) {
      bandForm.append('files.bandImg', band.value.bandImg);
    }

    await client(`/bands/${bandId}`, {
      method: 'PUT',
      body: bandForm,
    });

    router.push('/dashboard');
  } catch (error) {
    console.error('Error updating band:', error);
  }
};

onMounted(fetchBand);
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.container-mdc {
  max-width: 500px;
  margin: 1rem auto;
  padding: 1rem;
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

.form-group {
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.styled-select {
  width: 100%;
  padding: 0.75rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  background-color: white;
  appearance: none;
  position: relative;
  background-image: none;
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 12px;
  color: #aaa;
}

.styled-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #aaa;
}
</style>
