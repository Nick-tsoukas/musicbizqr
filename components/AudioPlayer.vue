<template>
  <div class="player-container">
    <!-- Now Playing Section -->
    <div class="now-playing">
      <img
        v-if="albumCoverUrl !== props.placeholderImage"
        :src="albumCoverUrl"
        alt="Album Cover"
        class="album-cover"
      />
      <div class="song-info">
        <h3 class="song-title">{{ currentSongTitle }}</h3>
        <p class="artist-name">{{ artistName }}</p>
      </div>
    </div>

  

    <!-- Progress Bar -->
    <div class="progress-bar-container">
      <span class="current-time">{{ formatTime(currentTime) }}</span>
      <input
        type="range"
        min="0"
        :max="duration"
        step="0.1"
        v-model="currentTime"
        @input="seekAudio"
        class="progress-bar"
      />
      <span class="total-time">{{ formatTime(duration) }}</span>
    </div>

      <!-- Playback Controls -->
      <div class="controls">
      <!-- Shuffle Button -->
      <!-- <button @click="toggleShuffle" class="control-button">
        <img
          :src="shuffle ? shuffleActiveIcon : shuffleIcon"
          alt="Shuffle"
        />
      </button> -->

      <!-- Previous Button -->
      <button @click="previousSong" class="control-button">
        <img src="@/assets/previous-icon.svg" alt="Previous" />
      </button>

      <!-- Play/Pause Button -->
      <button @click="togglePlay" class="control-button play-pause">
        <img v-if="!playing" src="@/assets/play-icon.svg" alt="Play" />
        <img v-else src="@/assets/pause-icon.svg" alt="Pause" />
      </button>

      <!-- Next Button -->
      <button @click="nextSong" class="control-button">
        <img src="@/assets/next-icon.svg" alt="Next" />
      </button>

      <!-- Repeat Button -->
      <!-- <button @click="toggleRepeat" class="control-button">
        <img
          :src="repeat ? repeatActiveIcon : repeatIcon"
          alt="Repeat"
        />
      </button> -->
    </div>

    <!-- Volume Control -->
    <!-- <div class="volume-control">
      <button @click="toggleMute" class="volume-button">
        <img :src="volumeIcon" alt="Volume" />
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
        @input="changeVolume"
        class="volume-slider"
      />
    </div> -->

    <!-- Song List -->
    <ul class="song-list" v-if="songs.length > 0">
      <li
        v-for="(song, index) in songs"
        :key="song.id || index"
        :class="{ 'active-song': isCurrentSong(song) }"
        @click="playSong(song)"
      >
        <div class="song-index">{{ index + 1 }}</div>
        <div class="song-details">
          <p class="song-title">{{ song.title }}</p>
          <p class="artist-name">{{ artistName }}</p>
        </div>
        <div class="song-duration">{{ formatTime(song.duration) }}</div>
      </li>
    </ul>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioPlayer"
      @timeupdate="updateTime"
      @loadedmetadata="onAudioLoaded"
      @ended="onSongEnded"
    ></audio>
  </div>
</template>


<script setup>


const props = defineProps({
  album: {
    type: Object,
    required: true,
  },
  placeholderImage: {
    type: String,
    default: '@/assets/placeholder-image.svg', // Provide a default placeholder image
  },
});

const playing = ref(false);
const currentSong = ref(null);
const audioPlayer = ref(null);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const isMuted = ref(false);
const shuffle = ref(false);
const repeat = ref(false);

// Computed property for album cover URL
const albumCoverUrl = computed(() => {
  try {
    if (
      currentSong.value?.cover?.data?.attributes?.url
    ) {
      return currentSong.value.cover.data.attributes.url;
    } else if (
      props.album?.attributes?.cover?.data?.attributes?.url
    ) {
      return props.album.attributes.cover.data.attributes.url;
    }
    return props.placeholderImage;
  } catch (error) {
    console.error('Error getting album cover:', error);
    return props.placeholderImage;
  }
});

// Computed property for current song title
const currentSongTitle = computed(() => {
  return currentSong.value && currentSong.value.title
    ? currentSong.value.title
    : 'Select a song';
});

// Computed property for artist name
const artistName = computed(() => {
  return props.album.attributes.artist || 'Unknown Artist';
});

// Method to check if a song is the current song
const isCurrentSong = (song) => {
  return currentSong.value && currentSong.value.id === song.id;
};

// Icons for volume control
const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) {
    return '@/assets/volume-mute-icon.svg';
  } else if (volume.value < 0.5) {
    return '@/assets/volume-low-icon.svg';
  } else {
    return '@/assets/volume-high-icon.svg';
  }
});

// Icons for shuffle and repeat
const shuffleIcon = '@/assets/shuffle-icon.svg';
const shuffleActiveIcon = '@/assets/shuffle-active-icon.svg';
const repeatIcon = '@/assets/repeat-icon.svg';
const repeatActiveIcon = '@/assets/repeat-active-icon.svg';

// Initialize the audio player
onMounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value;
  }
  
  // Preselect the first song if available
  if (songs.value.length > 0) {
    currentSong.value = songs.value[0];
  }
});

// Watchers
watch(currentSong, (newSong) => {
  if (newSong) {
    try {
      let fileUrl = '';
      if (newSong.file?.data?.attributes?.url) {
        fileUrl = newSong.file.data.attributes.url;
      } else if (newSong.song?.data?.attributes?.url) {
        fileUrl = newSong.song.data.attributes.url;
      } else if (typeof newSong.file === 'string') {
        fileUrl = newSong.file;
      }

      console.log('File URL:', fileUrl);

      if (!fileUrl) {
        console.error('No valid file URL found:', newSong);
        return;
      }

      audioPlayer.value.src = fileUrl;
      // Remove the automatic play
      playing.value = false;
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  }
});

watch(volume, (newVolume) => {
  audioPlayer.value.volume = newVolume;
  isMuted.value = newVolume === 0;
});

watch(isMuted, (muted) => {
  audioPlayer.value.muted = muted;
});

// Methods
const playSong = (song) => {
  if (currentSong.value && currentSong.value.id === song.id) {
    togglePlay();
  } else {
    currentSong.value = song;
  }
};

const pauseSong = () => {
  audioPlayer.value.pause();
  playing.value = false;
};

const togglePlay = () => {
  if (playing.value) {
    pauseSong();
  } else {
    if (currentSong.value) {
      audioPlayer.value.play().catch(error => {
        console.error('Error playing audio:', error);
        playing.value = false;
      });
      playing.value = true;
    } else if (songs.value.length > 0) {
      playSong(songs.value[0]);
    }
  }
};

const nextSong = () => {
  if (shuffle.value) {
    playRandomSong();
  } else {
    const currentIndex = songs.value.findIndex(
      (s) => s.id === currentSong.value.id
    );
    let nextIndex = currentIndex + 1;
    if (nextIndex >= songs.value.length) {
      nextIndex = 0; // Loop back to the first song
    }
    playSong(songs.value[nextIndex]);
  }
};

const previousSong = () => {
  const currentIndex = songs.value.findIndex(
    (s) => s.id === currentSong.value.id
  );
  let prevIndex = currentIndex - 1;
  if (prevIndex < 0) {
    prevIndex = songs.value.length - 1; // Loop back to the last song
  }
  playSong(songs.value[prevIndex]);
};

const playRandomSong = () => {
  const randomIndex = Math.floor(
    Math.random() * songs.value.length
  );
  playSong(songs.value[randomIndex]);
};

const toggleShuffle = () => {
  shuffle.value = !shuffle.value;
};

const toggleRepeat = () => {
  repeat.value = !repeat.value;
};

const onSongEnded = () => {
  if (repeat.value) {
    audioPlayer.value.currentTime = 0;
    audioPlayer.value.play();
  } else {
    nextSong();
  }
};

const onAudioLoaded = () => {
  duration.value = audioPlayer.value.duration;
};

const updateTime = () => {
  currentTime.value = audioPlayer.value.currentTime;
};

const seekAudio = () => {
  audioPlayer.value.currentTime = currentTime.value;
};

const changeVolume = () => {
  isMuted.value = volume.value === 0;
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (isMuted.value) {
    volume.value = 0;
  } else {
    volume.value = audioPlayer.value.volume || 1;
  }
};

// Format time in mm:ss
const formatTime = (time) => {
  if (!time && time !== 0) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// Update the computed property to handle different data structures
const songs = computed(() => {
  console.log('Album prop:', props.album); // Debug log
  
  try {
    // Handle case where songs is directly in album.attributes
    if (props.album?.attributes?.songs) {
      const songsList = props.album.attributes.songs;
      return Array.isArray(songsList) ? songsList : [songsList];
    }
    
    // Handle case where the album itself is a single song
    if (props.album?.attributes) {
      return [{
        id: props.album.id || Date.now(),
        title: props.album.attributes.title || 'Unknown Title',
        file: props.album.attributes.file,
        song: props.album.attributes.song,
        duration: props.album.attributes.duration || 0,
        cover: props.album.attributes.cover
      }];
    }
    
    console.warn('No valid song data found in album:', props.album);
    return [];
  } catch (error) {
    console.error('Error processing songs:', error);
    return [];
  }
});
</script>

<style scoped>
.player-container {
  display: flex;
  flex-direction: column;
  background-color: black;
  color: #fff;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 0.5rem;
  max-width: auto;
  margin: auto;
}

/* Now Playing Section */
.now-playing {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.album-cover {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.25rem;
  margin-right: 1rem;
}

.song-info {
  flex-grow: 1;
}

.song-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.artist-name {
  font-size: 1rem;
  color: #b3b3b3;
  margin: 0;
}

/* Controls */
.controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.control-button {
  background: none;
  border: none;
  margin: 0 0.5rem;
  cursor: pointer;
}

.control-button img {
  width: 24px;
  height: 24px;
}

.play-pause img {
  width: 32px;
  height: 32px;
}

/* Progress Bar */
.progress-bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.current-time,
.total-time {
  width: 40px;
  text-align: center;
  font-size: 0.75rem;
}

.progress-bar {
  flex-grow: 1;
  margin: 0 0.5rem;
  appearance: none;
  height: 4px;
  background: #404040;
  border-radius: 2px;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
}

.progress-bar::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
}

/* Volume Control */
.volume-control {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.volume-button {
  background: none;
  border: none;
  cursor: pointer;
}

.volume-button img {
  width: 24px;
  height: 24px;
}

.volume-slider {
  width: 100px;
  margin-left: 0.5rem;
  appearance: none;
  height: 4px;
  background: #404040;
  border-radius: 2px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
}

/* Song List */
.song-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-list li {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
}

.song-list li:hover,
.song-list li.active-song {
  background-color: #282828;
}

.song-index {
  width: 24px;
  text-align: center;
}

.song-details {
  flex-grow: 1;
  padding-left: 0.5rem;
}

.song-duration {
  width: 50px;
  text-align: right;
  font-size: 0.75rem;
  color: #b3b3b3;
}
</style>


