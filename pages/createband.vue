<template>
  <div class="container-mdc">
    <h1 class="title">Create Band Profile</h1>
    <form @submit.prevent="submitForm">
      <!-- Band Details Section -->
      <div class="form-group">
        <h2 class="mb-8 font-semibold">Band Details</h2>

        <!-- Band Name -->
        <div class="mdc-text-field">
          <input type="text" id="band-name" class="mdc-text-field__input" v-model="bandName" placeholder=" "  />
          <label class="mdc-floating-label" for="band-name">Band Name</label>
          <div class="mdc-line-ripple"></div>
        </div>

        <!-- Genre -->
        <div class="mdc-text-field">
          <input type="text" id="genre" class="mdc-text-field__input" v-model="genre" placeholder=" "  />
          <label class="mdc-floating-label" for="genre">Genre</label>
          <div class="mdc-line-ripple"></div>
        </div>

        <!-- Bio -->
        <div class="mdc-text-field">
          <textarea id="bio" class="mdc-text-field__input" v-model="bio" placeholder=" " ></textarea>
          <label class="mdc-floating-label" for="bio">Bio</label>
          <div class="mdc-line-ripple"></div>
        </div>

        <!-- Band Image -->
        <h3 class="mt-8 mb-4 font-semibold">Upload Image</h3>
        <div class="mb-4">
          <input type="file" id="band-img" class="styled-file-input" @change="handleImageUpload" accept="image/*" />
          <label for="band-img" class="styled-file-label">Choose Band Image</label>
        </div>
        <div v-if="bandImgUrl" class="mb-4">
          <img :src="bandImgUrl" alt="Band Image" class="w-full h-auto rounded-lg shadow-md" />
        </div>
      </div>

      <!-- Band Members Section -->
      <div class="form-group">
        <h2 class="mb-8 font-semibold">Band Members</h2>
        <div v-for="(member, index) in members" :key="index" class="member-container">
          <div class="mdc-text-field mb-4">
            <input type="text" :id="'member-name-' + index" class="mdc-text-field__input" v-model="member.name" placeholder=" "  />
            <label class="mdc-floating-label" :for="'member-name-' + index">Member Name</label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input type="text" :id="'instrument-' + index" class="mdc-text-field__input" v-model="member.instrument" placeholder=" "  />
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
      </div>

      <!-- Albums Section -->
      <div class="form-group">
        <h2 class="mb-8 font-semibold">Albums</h2>
        <div v-for="(album, albumIndex) in albums" :key="albumIndex" class="album-container">
          <div class="mdc-text-field mb-4">
            <input type="text" :id="'album-title-' + albumIndex" class="mdc-text-field__input" v-model="album.title" placeholder=" "  />
            <label class="mdc-floating-label" :for="'album-title-' + albumIndex">Album Title</label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mdc-text-field mb-4">
            <input type="date" :id="'release-date-' + albumIndex" class="mdc-text-field__input" v-model="album.releaseDate" placeholder=" "  />
            <label class="mdc-floating-label" :for="'release-date-' + albumIndex">Release Date</label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mb-4">
            <input type="file" :id="'album-cover-' + albumIndex" class="styled-file-input" @change="(event) => handleAlbumCoverUpload(event, albumIndex)" accept="image/*" />
            <label :for="'album-cover-' + albumIndex" class="styled-file-label">Choose Album Cover</label>
          </div>
          <div v-if="album.coverUrl" class="mb-4">
            <img :src="album.coverUrl" alt="Album Cover" class="w-full h-auto rounded-lg shadow-md" />
          </div>

          <h3 class="mt-8 mb-4 font-semibold">Songs</h3>
          <div v-for="(song, songIndex) in album.songs" :key="songIndex" class="song-container">
            <div class="mdc-text-field mb-4">
              <input type="text" :id="'song-title-' + albumIndex + '-' + songIndex" class="mdc-text-field__input" v-model="song.title" placeholder=" "  />
              <label class="mdc-floating-label" :for="'song-title-' + albumIndex + '-' + songIndex">Song Title</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mb-4">
              <input type="file" :id="'song-file-' + albumIndex + '-' + songIndex" class="styled-file-input" @change="(event) => handleSongFileUpload(event, albumIndex, songIndex)" accept="audio/*" />
              <label :for="'song-file-' + albumIndex + '-' + songIndex" class="styled-file-label">Choose Song File</label>
            </div>
            <button type="button" class="mdc-button mb-4 w-full" @click="removeSong(albumIndex, songIndex)">Remove Song</button>
          </div>
          <button type="button" class="mdc-button mb-8 w-full" @click="addSong(albumIndex)">+ Add Song</button>

          <button type="button" class="mdc-button mb-4 w-full" @click="removeAlbum(albumIndex)">Remove Album</button>
        </div>
        <button type="button" class="mdc-button mb-8 w-full" @click="addAlbum">+ Add Album</button>
      </div>

      <!-- Social Media Links Section -->
      <div class="form-group">
        <h2 class="mb-8 font-semibold">Social Media Links</h2>
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

      <!-- Streaming Links Section -->
      <div class="form-group">
        <h2 class="mb-8 font-semibold">Streaming Links</h2>
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

      <button type="submit" class="mdc-button w-full">Create Profile</button>
    </form>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { create } = useStrapi();
const client = useStrapiClient()


const bandName = ref('');
const genre = ref('');
const bio = ref('');
const bandImg = ref(null);
const bandImgUrl = ref(null);
const members = ref([{ name: '', instrument: '', image: null, imageUrl: null }]);
const albums = ref([{ title: '', releaseDate: '', cover: null, coverUrl: null, songs: [{ title: '', file: null, fileUrl: null }] }]);
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

const handleAlbumCoverUpload = (event, index) => {
  const file = event.target.files[0];
  albums.value[index].cover = file;
  albums.value[index].coverUrl = URL.createObjectURL(file);
};

const handleSongFileUpload = (event, albumIndex, songIndex) => {
  const file = event.target.files[0];
  albums.value[albumIndex].songs[songIndex].file = file;
  albums.value[albumIndex].songs[songIndex].fileUrl = URL.createObjectURL(file);
};

const addMember = () => {
  members.value.push({ name: '', instrument: '', image: null, imageUrl: null });
};

const removeMember = (index) => {
  members.value.splice(index, 1);
};

const addAlbum = () => {
  albums.value.push({ title: '', releaseDate: '', cover: null, coverUrl: null, songs: [{ title: '', file: null, fileUrl: null }] });
};

const removeAlbum = (index) => {
  albums.value.splice(index, 1);
};

const addSong = (albumIndex) => {
  albums.value[albumIndex].songs.push({ title: '', file: null, fileUrl: null });
};

const removeSong = (albumIndex, songIndex) => {
  albums.value[albumIndex].songs.splice(songIndex, 1);
};


const submitForm = async () => {
  try {
    console.log('Submitting form with values:');
    console.log('Band Name:', bandName.value);
    console.log('Genre:', genre.value);
    console.log('Bio:', bio.value);

    // Create a form object with the necessary fields
    const form = {
      name: bandName.value || null,
      genre: genre.value || null,
      bio: bio.value || null,
      instagram: instagram.value || null,
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
    const client = useStrapiClient();
    const { data: bandData } = await client('/bands', {
      method: 'POST',
      body: formData
    });

    console.log('Band profile created successfully:', bandData);

    // Create albums and associate them with the created band
    for (const album of albums.value) {
      const albumForm = new FormData();
      const albumData = {
        title: album.title,
        releaseDate: album.releaseDate,
        band: bandData.id, // Associate the album with the created band
        songs: album.songs.map((song) => ({
          title: song.title,
        })),
      };

      albumForm.append('data', JSON.stringify(albumData));

      if (album.cover) {
        albumForm.append('files.cover', album.cover);
      }

      album.songs.forEach((song, songIndex) => {
        if (song.file) {
          albumForm.append(`files.songs[${songIndex}].file`, song.file);
        }
      });

      const { data: albumResponse } = await client('/albums', {
        method: 'POST',
        body: albumForm,
      });

      console.log('Album created successfully:', albumResponse);
    }

    router.push('/dashboard'); // Redirect to dashboard
  } catch (error) {
    console.error('Error creating band profile:', error);
  }
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

.member-container, .album-container, .song-container {
  margin: 0;
}

.mdc-text-field.mb-4 {
  margin-bottom: 1rem;
}
</style>
