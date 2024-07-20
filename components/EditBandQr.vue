<template>
  <div class="container-mdc">
    <h1 class="title">Update Band Profile</h1>
    <form :class="{hidden: isPopUp}" @submit.prevent="submitForm">
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
      <!-- <div class="form-group">
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
      </div> -->

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
      <!-- albunm list form-group adding the border and sets width plus drop shaddow   -->
    
    <!-- work here -->
      <section v-if="albumList" class="form-group">
        <h2 class="mb-8 font-semibold">Album List</h2>
        <!-- <pre>{{ albumList }}</pre> -->
        <div v-for="(album, index) in albumList.data" :key="album.attributes.title"  class="flex gap-2 items-center w-full mb-4">
        
          <div class=" w-[60px] h-[60px]">
            <img :src="album.attributes.cover.data.attributes.url" alt="">
          </div>
          <div class="grow">{{ album.attributes.title }}</div>
          <div class="flex items-center"> <img @click="toggle(index)" src="@/assets/edit-icon.svg" alt=""></div>
        </div>
      </section>


      <button type="submit" class="mdc-button w-full">Update Band</button>
   
    </form>
      <!-- <pre>{{ albumList }}</pre> -->

      <!-- modal popup box -->
      <section :class="{ hidden: !isPopUp }" class="w-screen h-screen z-[9999999] absolute top-0 left-0 overflow-scroll bg-[#fff] p-2 ">
        <!-- top bar -->
     <!-- work here album popup -->
      <div v-if="currentAlbum" class="form-group bg-[#fff]">
        
       <div class="flex">
        <h2 class="mb-8 font-semibold">Albums</h2>
        <img class="ml-auto self-baseline" @click="toggle" src="@/assets/edit-icon.svg" alt="">
       </div>
        <div  class="album-container">
         
          <div class="mdc-text-field mb-4">
            <input type="text" :id="'album-title-'" class="mdc-text-field__input" v-model="currentAlbum.attributes.title" placeholder=" "  />
            <label class="mdc-floating-label" :for="'album-title-' ">Album </label>
            <div class="mdc-line-ripple"></div>
          </div>
          <!-- album cover -->
          <div class="mdc-text-field mb-4">
            <input type="date" :id="'release-date-' + albumIndex" class="mdc-text-field__input" v-model="currentAlbum.attributes.releaseDate" placeholder=" "  />
            <label class="mdc-floating-label" :for="'release-date-' + albumIndex">Release Date</label>
            <div class="mdc-line-ripple"></div>
          </div>
          <div class="mb-4">
            <input type="file" :id="'album-cover-' " class="styled-file-input" @change="(event) => handleAlbumCoverUploadUpdate(event)" accept="image/*" />
            <label :for="'album-cover-' " class="styled-file-label">Edit Album Cover</label>
          </div>


          <div v-if="currentAlbum.coverUrl" class="mb-4">
            <img :src="currentAlbum.coverUrl" alt="Album Cover" class="w-full h-auto rounded-lg shadow-md" />
          </div>
          <div v-if="currentAlbum.attributes.cover.data.attributes.url" class="mb-4">
            <img :src="currentAlbum.attributes.cover.data.attributes.url" alt="Album Cover" class="w-full h-auto rounded-lg shadow-md" />
          </div>


          <h3 class="mt-8 mb-4 font-semibold">Songs</h3>
           <div v-for="(song, songIndex) in currentAlbum.attributes.songs" :key="songIndex" class="song-container divide-solid">
            <div class="mdc-text-field mb-4">
              <input type="text" :id="'song-title-' + '-' + songIndex" class="mdc-text-field__input" v-model="song.title" placeholder=" "  />
              <label class="mdc-floating-label" :for="'song-title-' + '-' + songIndex">Song Title</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mb-4">
              <input type="file" :id="'song-file-'  + '-' + songIndex" class="styled-file-input" @change="(event) => handleSongFileUploadUpdate(event, songIndex)" accept="audio/*" />
              <label :for="'song-file-'  + '-' + songIndex" class="styled-file-label">Edit Song File</label>
            </div>
            <!-- <button type="button" class="mdc-button mb-12 w-full" @click="removeSong(albumIndex, songIndex)">Remove Song</button> -->
          </div>
          <!-- <button type="button" class="mdc-button mb-8 w-full" @click="addSong(albumIndex)">+ Add Song</button>  -->

          <button type="button" class="mdc-button mb-4 w-full" @click="updateAlbum">Update Album</button>
        </div>
        <button type="button" class="mdc-button mb-8 w-full" @click="addAlbum">+ Add Album</button>
      </div> 
      </section>
     </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { create, findOne } = useStrapi();
const client = useStrapiClient();

console.log(route.params)
// const { data: band } = findOne('bands', params.bandProfile.id)
const isPopUp = ref(false)
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
const bandId = ref(null);
const qr = ref (null);
const albumList = ref([{ title: '', releaseDate: '', cover: null, coverUrl: null, songs: [{ title: '', file: null, fileUrl: null }] }]);
const albumIndex = ref(null);
const currentAlbum = ref(null);

const toggle = (index) => {
 if(isPopUp){
  albumIndex.value = index
  console.log(albumList.value)
  currentAlbum.value = albumList.value.data[index]
  console.log(currentAlbum.value, 'the current album')
  isPopUp.value = !isPopUp.value
 }  else {
  isPopUp.value = !isPopUp.value
 }
 
}


try {
  const qr = await findOne('qrs', route.params.id,{
    populate: {
          "*": true,
          band: {
            populate: {
              "*": true,
              bandImg: true,
              members: {
                populate: {
                  image: true
                }
              },
              albums: {
                populate: {
                  cover: true,
                  songs: {
                    populate: {
                      file: true
                    }
                  }
                }
              }
            }
          }
        }
  })

  albumList.value = qr.data[0].attributes.band.data.attributes.albums
  console.log(qr.data[0].attributes.band.data.attributes.albums.data[0].attributes.cover.data.attributes.url,'this is the band album log i need now ')
  bandImgUrl.value = qr.data[0].attributes.band.data.attributes.bandImg.data.attributes.url
    bandId.value =  await qr.data[0].attributes.band.data.id
    bandName.value = qr.data[0].attributes.band.data.attributes.name;
    genre.value = qr.data[0].attributes.band.data.attributes.genre;
    bio.value = qr.data[0].attributes.band.data.attributes.bio;
    facebook.value = qr.data[0].attributes.band.data.attributes.facebook;
    instagram.value = qr.data[0].attributes.band.data.attributes.instagram;
    twitch.value = qr.data[0].attributes.band.data.attributes.twitch;
    appleMusic.value = qr.data[0].attributes.band.data.attributes.appleMusic;
    spotify.value = qr.data[0].attributes.band.data.attributes.spotify;
    soundcloud.value = qr.data[0].attributes.band.data.attributes.soundcloud;
    qr.data[0].attributes.band.data.attributes.members.forEach(member => {
      console.log(member)
    })
    members.value = qr.data[0].attributes.band.data.attributes.members.map(member => ({
      id: member.id,
  name: member.name,
  instrument: member.instrument,
  imageUrl: member.image ? member.image.data.attributes.url : null,
  imageId: member.image ? member.image.data.id : null, // Include image ID
  image: null // This will be updated if a new image is uploaded
  
    }));

    // qr.data[0].attributes.band.data.attributes.albums.data.forEach((album) => {
    //   console.log(album.attributes, 'this is the forEach')
    // })
   // imageUrl: member.image ? member.image.data.attributes.url : null
//     albums.value = qr.data[0].attributes.band.data.attributes.albums.data.map(album => ({
//   id: album.id,
//   title: album.attributes.title,
//   releaseDate: album.attributes.releaseDate,
//   coverUrl: album.attributes.cover ? album.attributes.cover.data.attributes.url : null,
//   cover: null, // This will be updated if a new cover is uploaded
//   songs: album.attributes.songs.map(song => ({
//     id: song.id,
//     title: song.title,
//     fileUrl: song.file ? song.file.data.attributes.url : null,
//     // file: null // This will be updated if a new file is uploaded
//   }))
// }));

// [
//     {
//         "id": 24,
//         "name": "fsdfsdfsdfsdfsdf",
//         "instrument": "sdfsdfsdffsdfsdfsdfsfsdf",
//         "image": {
//             "data": {
//                 "id": 232,
//                 "attributes": {
//                     "name": "qrcode_eea6e1bd8d.png",
//                     "alternativeText": null,
//                     "caption": null,
//                     "width": 300,
//                     "height": 300,
//                     "formats": {
//                         "thumbnail": {
//                             "name": "thumbnail_qrcode_eea6e1bd8d.png",
//                             "hash": "thumbnail_qrcode_eea6e1bd8d_f78add8df9",
//                             "ext": ".png",
//                             "mime": "image/png",
//                             "path": null,
//                             "width": 156,
//                             "height": 156,
//                             "size": 24.71,
//                             "sizeInBytes": 24713,
//                             "url": "https://qrcode101.s3.us-east-1.amazonaws.com/thumbnail_qrcode_eea6e1bd8d_f78add8df9.png"
//                         }
//                     },
//                     "hash": "qrcode_eea6e1bd8d_f78add8df9",
//                     "ext": ".png",
//                     "mime": "image/png",
//                     "size": 6.1,
//                     "url": "https://qrcode101.s3.us-east-1.amazonaws.com/qrcode_eea6e1bd8d_f78add8df9.png",
//                     "previewUrl": null,
//                     "provider": "aws-s3",
//                     "provider_metadata": null,
//                     "createdAt": "2024-07-17T01:19:06.673Z",
//                     "updatedAt": "2024-07-17T01:19:06.673Z"
//                 }
//             }
//         }
//     }
// ]
} catch (error) {
  console.log(error , 'this is the error in the bind form funciton and call to get data')
}

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
const handleAlbumCoverUpload = (event)=> {
  const file = event.target.files[0];

  currentAlbum.value.cover = file;
  currentAlbum.value.coverUrl = URL.createObjectURL(file);
  console.log(currentAlbum, ' update file for album')
};
// update 
const handleAlbumCoverUploadUpdate = (event, index) => {
  const file = event.target.files[0];
  console.log(file)
  currentAlbum.value.cover = file;
  currentAlbum.value.coverUrl = URL.createObjectURL(file);
  console.log(currentAlbum.value, ' update file for album')
};

const handleSongFileUpload = (event, albumIndex, songIndex) => {
  const file = event.target.files[0];
  albums.value[albumIndex].songs[songIndex].file = file;
  albums.value[albumIndex].songs[songIndex].fileUrl = URL.createObjectURL(file);
};
// update song

const handleSongFileUploadUpdate = (event, songIndex) => {
  const file = event.target.files[0];
  currentAlbum.value.attributes.songs[songIndex].file = file;
  currentAlbum.value.attributes.songs[songIndex].fileUrl = URL.createObjectURL(file);
  console.log('song file update ', currentAlbum.value)
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

const updateAlbum = async () => {
  console.log(albumList.value.data[0].id)
  try {
    const albumForm = new FormData();
    const albumData = {
      title: currentAlbum.value.attributes.title,
      releaseDate: currentAlbum.value.attributes.releaseDate,
      band: bandId.value,
      songs: currentAlbum.value.attributes.songs.map(song => ({
        id: song.id,
        title: song.title,
      })),
    };

    albumForm.append('data', JSON.stringify(albumData));
    console.log('cur val at cover', currentAlbum.value.attributes);
    
    if (currentAlbum.value.cover) {
      console.log('update album cover');
      albumForm.append('files.cover', currentAlbum.value.cover);
    }

    currentAlbum.value.attributes.songs.forEach((song, songIndex) => {
      if (song.file) {
        albumForm.append(`files.songs[${songIndex}].file`, song.file);
      }
    });

    await client(`/albums/${currentAlbum.value.id}`, {
      method: 'PUT',
      body: albumForm,
    });
    const updatedAlbum = {
      ...currentAlbum.value,
      coverUrl: currentAlbum.value.coverUrl,
    };

    albumList.value[0] = updatedAlbum;
    router.go(0);
    // }
  } catch (error) {
    console.log(error, 'error in update album function ')
  }
}

const submitForm = async () => {
  try {
    // Create a form object with the necessary fields
    const form = {
      name: bandName.value || null,
      genre: genre.value || null,
      bio: bio.value || null,
      instagram: instagram.value || null,
      facebook: facebook.value || null,
      twitch: twitch.value || null,
      appleMusic: appleMusic.value || null,
      spotify: spotify.value || null,
      soundcloud: soundcloud.value || null,
      members: members.value.map(member => ({
        id: member.id || null, // Include the member ID for updates
        name: member.name || null,
        instrument: member.instrument || null,
        image: member.imageId // Reference to the existing image ID
      })),
    };

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

    // Use Strapi client to update the band
    const { data: bandData } = await client(`/bands/${bandId.value}`, {
      method: 'PUT',
      body: formData
    });

    // Update albums and associate them with the band
    // for (const album of albums.value) {
    //   const albumForm = new FormData();
    //   const albumData = {
    //     title: album.title,
    //     releaseDate: album.releaseDate,
    //     band: bandId.value, // Associate the album with the band
    //     songs: album.songs.map(song => ({
    //       title: song.title,
    //     })),
    //   };

    //   albumForm.append('data', JSON.stringify(albumData));

    //   if (album.cover) {
    //     albumForm.append('files.cover', album.cover);
    //   }

    //   album.songs.forEach((song, songIndex) => {
    //     if (song.file) {
    //       albumForm.append(`files.songs[${songIndex}].file`, song.file);
    //     }
    //   });

    //   await client(`/albums/${album.id}`, {
    //     method: 'PUT',
    //     body: albumForm,
    //   });
    // }

    router.push('/dashboard'); // Redirect to dashboard
  } catch (error) {
    console.error('Error updating band profile:', error);
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
  margin: .5rem auto;
  padding: .5rem;
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
