<template>
  <div class="bg-[#000] w-[90vw] mx-auto z-0">

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div class="container-mdc bg-black max-w-5xl ">
    <h1 class="title text-white ">Create Band Profile</h1>
 
    <form class="form-group"  @submit.prevent="submitForm">
      <!-- Band Details Section -->
      <div class="bg-[#fff]  rounded-md" >
        <div>
        <div class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="font-semibold text-white text-2xl">Band Details</h2>
        </div>
        <!-- Band Name -->
        <div class="p-4" >  
        <div class="mdc-text-field">
          <input type="text" id="band-name" class="mdc-text-field__input" v-model="bandName" placeholder=" " />
          <label class="mdc-floating-label" for="band-name">Band Name</label>
          <div class="mdc-line-ripple"></div>
        </div>

        <!-- Genre -->
        <div class="mdc-text-field">
          <input type="text" id="genre" class="mdc-text-field__input" v-model="genre" placeholder=" " />
          <label class="mdc-floating-label" for="genre">Genre</label>
          <div class="mdc-line-ripple"></div>
        </div>

        <!-- Bio -->
        <div class="mdc-text-field">
          <textarea id="bio" class="mdc-text-field__input" v-model="bio" placeholder=" "></textarea>
          <label class="mdc-floating-label" for="bio">Bio</label>
          <div class="mdc-line-ripple"></div>
        </div>
      </div>
    </div>
       
      </div>

       <!-- Band Image -->
       <div class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">
      <h3 class=" font-semibold text-white text-2xl">Upload Image</h3>
</div>
<div class="mb-4 py-10 bg-white p-4">
  <input type="file" id="band-img" class="styled-file-input" @change="handleImageUpload" accept="image/*" />
  <label for="band-img" class="styled-file-label w-full text-center">Choose Band Image</label>
  <div v-if="bandImgUrl" class="mb-4">
  <img :src="bandImgUrl" alt="Band Image" class="w-full h-auto rounded-lg shadow-md" />
</div>
</div>


      <!-- Band Members Section -->
      <div class="bg-white rounded-md">
    
          <div class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">

        <h2 class=" font-semibold text-white text-2xl">Band Members</h2>
        </div>
        <div>
          <div class="p-4" >
            <div v-for="(member, index) in members" :key="index" class="member-container">
          <div class="mdc-text-field mb-4">
            <input type="text" :id="'member-name-' + index" class="mdc-text-field__input" v-model="member.name" placeholder=" " />
            <label class="mdc-floating-label" :for="'member-name-' + index">Member Name</label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input type="text" :id="'instrument-' + index" class="mdc-text-field__input" v-model="member.instrument" placeholder=" " />
            <label class="mdc-floating-label" :for="'instrument-' + index">Instrument</label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mb-4">
            <input type="file" :id="'member-img-' + index" class="styled-file-input" @change="(event) => handleMemberImageUpload(event, index)" accept="image/*" />
            <label :for="'member-img-' + index" class="styled-file-label w-full text-center">Choose Member Image</label>
          </div>
          <div v-if="member.imageUrl" class="mb-4">
            <img :src="member.imageUrl" alt="Member Image" class="w-full h-auto rounded-lg shadow-md" />
          </div>
          <button type="button" class="mdc-button mb-4 w-full" @click="removeMember(index)">Remove Member</button>
        </div>
        <button type="button" class="mdc-button mb-8 w-full" @click="addMember">+ Add Member</button>
     
          </div>
        </div>
      </div>

      <!-- Social Media Links Section -->
      <div class="bg-[#fff] rounded-md">
        <div class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="font-semibold text-white text-2xl">Social Media Links</h2>
        </div>
  <div class="p-4" >
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
  </div>
      </div>

      <!-- Streaming Links Section -->
      <div class="bg-[#fff]  rounded-md">
        <div class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">

        <h2 class=" font-semibold text-2xl text-white">Streaming Links</h2>

        </div>

       <div class="p-4" >
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
       </div>
      </div>

      <button type="submit" class="mdc-button w-full mt-10">Create Profile</button>
    </form>
  </div>
  </div>
</template>

<script setup>


const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
const { update } = useStrapi();
const user = useStrapiUser();

const loading = ref(false)
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

const submitForm = async () => {
  try {
    loading.value = true
    console.log('Submitting form with values:');
    console.log('Band Name:', bandName.value);
    console.log('Genre:', genre.value);
    console.log('Bio:', bio.value);

    // Create a form object with the necessary fields
    const form = {
      name: bandName.value || null,
      genre: genre.value || null,
      bio: bio.value || null,
      facebook: facebook.value || null,
      instagram: instagram.value || null,
      twitch: twitch.value || null,
      appleMusic: appleMusic.value || null,
      spotify: spotify.value || null,
      soundcloud: soundcloud.value || null,
      users_permissions_user: user.value.id, // Add the current user's ID
      members: members.value.map((member) => ({
        name: member.name || null,
        instrument: member.instrument || null,
      })),
    };

    // Remove null or empty values from the form object
    for (const key in form) {
      if (form[key] === null || form[key] === '' || (Array.isArray(form[key]) && form[key].length === 0)) {
        delete form[key];
      }
    }

    // Log the form object
    console.log('Form Data:', form);

    // Initialize FormData
    const formData = new FormData();
    formData.append('data', JSON.stringify(form));

    // Append band image file if it exists
    if (bandImg.value) {
      formData.append('files.bandImg', bandImg.value);
    }

    // Append member images if they exist
    members.value.forEach((member, index) => {
      if (member.image) {
        formData.append(`files.members[${index}].image`, member.image);
      }
    });

    // Log the FormData entries
    console.log('FormData:', Array.from(formData.entries()));

    // Use Strapi client to create the band
    const { data: bandData } = await client('/bands', {
      method: 'POST',
      body: formData
    });

    // Update the QR entry with the band ID
   if(route.query.qrId){
    await update('qrs', route.query.qrId, {
      band: bandData.id
    });
   }

    console.log('Band profile created successfully:', bandData);
    router.push('/dashboard'); // Redirect to dashboard
  } catch (error) {
    loading.value = false
    console.error('Error creating band profile:', error);
  }
};
</script>

<style >
@tailwind base;
@tailwind components;
@tailwind utilities;

.btn {
  @apply bg-neon-green hover:bg-neon-purple text-black font-bold py-2 px-4 rounded shadow-lg;
}

.container-mdc {
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;

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
  background: white ;
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
