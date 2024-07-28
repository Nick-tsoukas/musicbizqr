<template>
  <div class="container-mdc">
    <h1 class="title">Edit Album</h1>
    <form @submit.prevent="submitEditAlbum">
      <div class="form-group">
        <div class="mdc-text-field mb-4">
          <input type="text" id="edit-album-title" class="mdc-text-field__input" v-model="album.title" placeholder=" " required />
          <label class="mdc-floating-label" for="edit-album-title">Album Title</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <input type="date" id="edit-album-releaseDate" class="mdc-text-field__input" v-model="album.releaseDate" placeholder=" " required />
          <label class="mdc-floating-label" for="edit-album-releaseDate">Release Date</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mb-4">
          <input type="file" id="edit-album-cover" class="styled-file-input" @change="handleAlbumCoverUpload" accept="image/*" />
          <label for="edit-album-cover" class="styled-file-label">Choose Album Cover</label>
        </div>
        <div v-if="album.imageUrl" class="mb-4">
          <img :src="album.imageUrl" alt="Album Cover" class="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div class="mdc-text-field mb-4">
          <select v-model="album.band" class="mdc-text-field__input">
            <option value="" disabled>Select Band</option>
            <option v-for="band in bands" :key="band.id" :value="band.id">{{ band.attributes.name }}</option>
          </select>
          <label class="mdc-floating-label" for="edit-album-band">Select Band</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <div class="mdc-text-field mb-4">
          <label class="mdc-floating-label">Songs</label>
          <div v-for="(song, index) in album.songs" :key="index" class="mb-4">
            <div class="mdc-text-field mb-2">
              <input type="text" :id="'song-title-' + index" class="mdc-text-field__input" v-model="song.title" placeholder=" " />
              <label class="mdc-floating-label" :for="'song-title-' + index">Song Title</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mb-2">
              <input type="file" :id="'song-file-' + index" class="styled-file-input" @change="handleSongFileUpload($event, index)" accept="audio/*" />
              <label :for="'song-file-' + index" class="styled-file-label">Choose Song File</label>
            </div>
            <button type="button" class="mdc-button mb-2 w-full" @click="removeSong(index)">Remove Song</button>
          </div>
          <button type="button" class="mdc-button mb-4 w-full" @click="addSong">Add Song</button>
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

const album = ref({
  title: '',
  releaseDate: '',
  cover: null,
  imageUrl: null,
  band: null,
  songs: [],
});
const bands = ref([]);

const fetchAlbum = async () => {
  const albumId = route.params.id;
  console.log('Getting album with ID:', albumId);
  try {
    const response = await findOne('albums', albumId, {
      populate: ['cover', 'band', 'songs'],
    });

    if (response.data) {
      const attributes = response.data.attributes;
      album.value = {
  title: attributes.title ?? '',
  releaseDate: attributes.releaseDate ?? '',
  cover: attributes.cover?.data ?? null,
  imageUrl: attributes.cover?.data?.attributes.url ?? null,
  band: attributes.band?.data?.id ?? null,
  songs: attributes.songs?.map(song => ({
    title: song.title ?? '',
    file: song.file?.data ?? null,
    fileUrl: song.file?.data?.attributes.url ?? null,
  })) ?? [],
};
      console.log('Fetched album data:', album.value);
    } else {
      console.log('No data found for album ID:', albumId);
    }
  } catch (error) {
    console.error('Error fetching album:', error);
  }
};

const fetchBands = async () => {
  try {
    const response = await findOne('bands', {
      populate: ['users_permissions_user'],
    });
    bands.value = response.data;
  } catch (error) {
    console.error('Error fetching bands:', error);
  }
};

const handleAlbumCoverUpload = (e) => {
  const file = e.target.files[0];
  album.value.cover = file;
  album.value.imageUrl = URL.createObjectURL(file);
};

const handleSongFileUpload = (e, index) => {
  const file = e.target.files[0];
  album.value.songs[index].file = file;
  album.value.songs[index].fileUrl = URL.createObjectURL(file);
};

const addSong = () => {
  album.value.songs.push({ title: '', file: null, fileUrl: null });
};

const removeSong = (index) => {
  album.value.songs.splice(index, 1);
};

const submitEditAlbum = async () => {
  const albumId = route.params.id;
  try {
    const albumForm = new FormData();
    const albumData = {
      title: album.value.title,
      releaseDate: album.value.releaseDate,
      band: album.value.band,
      songs: album.value.songs.map(song => ({
        title: song.title,
      })),
      users_permissions_user: user.value.id,
    };

    albumForm.append('data', JSON.stringify(albumData));

    if (album.value.cover) {
      albumForm.append('files.cover', album.value.cover);
    }

    album.value.songs.forEach((song, index) => {
      if (song.file) {
        albumForm.append(`files.songs.${index}.file`, song.file);
      }
    });

    await client(`/albums/${albumId}`, {
      method: 'PUT',
      body: albumForm,
    });

    router.push('/dashboard');
  } catch (error) {
    console.error('Error updating album:', error);
  }
};

onMounted(async () => {
  await fetchBands();
  await fetchAlbum();
});
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
