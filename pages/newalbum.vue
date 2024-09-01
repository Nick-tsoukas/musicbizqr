<template>
  <div class="container mx-auto ">
    <h1 class="text-white text-2xl font-bold p-6">Create New Album</h1>
    <form @submit.prevent="submitNewAlbum">
      <div class="form-group">
        <div class="flex flex-col p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-white font-semibold text-xl" >Album Details</h2>
        </div>

      <div class="bg-white p-4" >
        <div class="mdc-text-field mb-4">
          <input type="text" id="new-album-title" class="mdc-text-field__input" v-model="newAlbum.title" placeholder=" " />
          <label class="mdc-floating-label" for="new-album-title">Album Title</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="date" id="new-album-releaseDate" class="mdc-text-field__input" v-model="newAlbum.releaseDate" placeholder=" " />
          <label class="mdc-floating-label" for="new-album-releaseDate">Release Date</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mb-4">
          <input type="file" id="new-album-cover" class="styled-file-input" @change="handleCoverUpload" accept="image/*" />
          <label for="new-album-cover" class="styled-file-label">Choose Album Cover</label>
        </div>
        <div v-if="newAlbum.coverUrl" class="mb-4">
          <img :src="newAlbum.coverUrl" alt="Album Cover" class="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div class="mdc-text-field mb-4">
          <select v-model="newAlbum.band" class="mdc-text-field__input">
            <option value="" disabled>Select Band</option>
            <option v-for="band in bands" :key="band.id" :value="band.id">{{ band.attributes.name }}</option>
          </select>
          <label class="mdc-floating-label" for="new-album-band">Select Band</label>
          <div class="mdc-line-ripple"></div>
        </div>
      </div>
        
        <div class="mt-10">
          <div class="flex flex-col p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">

          <h2 class="text-white font-semibold text-xl ">Add Songs</h2>
          </div>
          <div class="bg-white p-4" >
            <div v-for="(song, index) in newAlbum.songs" :key="index" class="mb-4">
            <div class="mdc-text-field mb-2">
              <input type="text" :id="'song-title-' + index" class="mdc-text-field__input" v-model="song.title" placeholder=" " />
              <label class="mdc-floating-label" :for="'song-title-' + index">Song Title</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mb-2">
              <input type="file" :id="'song-file-' + index" class="styled-file-input" @change="handleSongFileUpload($event, index)" accept="audio/*" />
              <label :for="'song-file-' + index" class="styled-file-label">Choose Song File</label>
            </div>
          </div>
          <button type="button" class="mdc-button mb-4" @click="addSong">Add Another Song</button>
          </div>
        </div>

        <button type="submit" class="mdc-button mb-4 w-full mt-10">Create Album</button>
      </div>
    </form>
  </div>
</template>

<script setup>


const router = useRouter();
const client = useStrapiClient();
const user = useStrapiUser();
const route = useRoute();
const {update } = useStrapi()

const newAlbum = ref({
  title: '',
  releaseDate: '',
  cover: null,
  coverUrl: null,
  band: null,
  songs: [{ title: '', file: null }]
});

const bands = ref([]);

const handleCoverUpload = (event) => {
  const file = event.target.files[0];
  newAlbum.value.cover = file;
  newAlbum.value.coverUrl = URL.createObjectURL(file);
};

const handleSongFileUpload = (event, index) => {
  const file = event.target.files[0];
  newAlbum.value.songs[index].file = file;
};

const addSong = () => {
  newAlbum.value.songs.push({ title: '', file: null });
};

const submitNewAlbum = async () => {
  try {
    const albumForm = new FormData();
    const albumData = {
      title: newAlbum.value.title,
      releaseDate: newAlbum.value.releaseDate,
      band: newAlbum.value.band,
      users_permissions_user: user.value.id,
      songs: newAlbum.value.songs.map(song => ({ title: song.title }))
    };

    albumForm.append('data', JSON.stringify(albumData));

    if (newAlbum.value.cover) {
      albumForm.append('files.cover', newAlbum.value.cover);
    }

    newAlbum.value.songs.forEach((song, index) => {
      if (song.file) {
        albumForm.append(`files.songs.${index}.file`, song.file);
      }
    });

    const {data: album } = await client('/albums', {
      method: 'POST',
      body: albumForm,
    });

    if(route.query.qrId){
    await update('qrs', route.query.qrId, {
      album: album.id
    });
   }

    router.push('/dashboard'); // Redirect to albums page after successful creation
  } catch (error) {
    console.error('Error creating new album:', error);
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
  } catch (error) {
    console.error('Error fetching bands associated with the user:', error);
  }
});
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
