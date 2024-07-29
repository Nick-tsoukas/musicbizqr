<template>
  <div class="list-container w-full">
    <!-- Album img and band title -->
    <div class="min-h-36 bg-black w-full flex p-6 gap-5" @click="playFirstSong">
      <div class="h-24 w-24 rounded-lg bg-black">
        <img :src="album.attributes.cover.data.attributes.url" alt="Album Cover" class="h-full w-full rounded-lg object-cover" />
      </div>
      <div>
        <p class="text-white font-semibold text-xl">{{ album.attributes.title }}</p>
        <p class="text-white text-lg">By Band Name</p> <!-- Adjust if band name is available -->
      </div>
    </div>
    <!-- Play bar -->
    <div class="flex bg-black items-center justify-end w-full min-h-10 px-6 gap-5 pb-4">
      <img src="@/assets/back-icon.svg" alt="Previous" @click="previousSong">
      <img src="@/assets/skip-icon.svg" alt="Next" @click="nextSong">
      <img v-if="!playing" @click="togglePlay" src="@/assets/play-icon.svg" alt="Play">
      <img v-if="playing" @click="togglePlay" src="@/assets/pause-icon.svg" alt="Pause">
    </div>
    <!-- List of songs -->
    <ul class="list w-full">
      <li v-for="song in album.attributes.songs" :key="song.id" class="flex w-full py-6 px-6 gap-2">
        <div>
          <img v-if="!playingSong(song)" @click="playSong(song)" src="@/assets/play-black.svg" alt="Play">
          <img v-if="playingSong(song)" @click="pauseSong" src="@/assets/pause-black.svg" alt="Pause">
        </div>
        <div class="grow">{{ song.title }}</div>
        <div>5:00</div> <!-- Adjust if duration is available -->
      </li>
    </ul>
    <!-- Audio element -->
    <audio ref="audioPlayer" @ended="nextSong" @loadeddata="onAudioLoaded" controls class="w-full"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// Define props
const props = defineProps({
  album: {
    type: Object,
    required: true
  }
})

const playing = ref(false)
const currentSong = ref(null)
const audioPlayer = ref(null)

// Initialize the audio player on mount
onMounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.addEventListener('play', () => {
      console.log('Audio playing')
      playing.value = true
    })
    audioPlayer.value.addEventListener('pause', () => {
      console.log('Audio paused')
      playing.value = false
    })
    audioPlayer.value.addEventListener('ended', () => {
      console.log('Audio ended')
      nextSong()
    })
  }
})

// Handle the loadeddata event
const onAudioLoaded = () => {
  console.log('Audio loaded')
  if (playing.value) {
    audioPlayer.value.play()
  }
}

// Play or pause the current song
const togglePlay = () => {
  if (playing.value) {
    audioPlayer.value.pause()
  } else {
    audioPlayer.value.play()
  }
}

const playSong = (song) => {
  if (currentSong.value && currentSong.value.id === song.id) {
    togglePlay()
  } else {
    currentSong.value = song
    audioPlayer.value.src = song.file.data.attributes.url
    playing.value = true
  }
}

const pauseSong = () => {
  audioPlayer.value.pause()
}

const playingSong = (song) => {
  return currentSong.value && currentSong.value.id === song.id && playing.value
}

const nextSong = () => {
  const currentIndex = album.attributes.songs.findIndex(s => s.id === currentSong.value.id)
  const nextIndex = (currentIndex + 1) % album.attributes.songs.length
  playSong(album.attributes.songs[nextIndex])
}

const previousSong = () => {
  const currentIndex = album.attributes.songs.findIndex(s => s.id === currentSong.value.id)
  const prevIndex = (currentIndex - 1 + album.attributes.songs.length) % album.attributes.songs.length
  playSong(album.attributes.songs[prevIndex])
}

// Watch for changes in currentSong and update the audio player source
watch(currentSong, (newSong) => {
  if (newSong) {
    audioPlayer.value.src = newSong.file.data.attributes.url
    if (playing.value) {
      audioPlayer.value.play()
    }
  }
})

// Play the first song of the album when the album is clicked
const playFirstSong = () => {
  if (album.attributes.songs.length > 0) {
    playSong(album.attributes.songs[0])
  }
}
</script>

<style scoped>
.list-container {
  @apply mx-auto my-4 bg-white shadow-md rounded-lg;
}

.list {
  @apply divide-y divide-gray-200;
}
</style>
