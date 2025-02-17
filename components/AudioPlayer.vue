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
      <!-- Previous Button -->
      <button @click="previousSong" class="control-button">
        <img src="@/assets/previous-icon.svg" alt="Previous" />
      </button>

      <!-- Play/Pause Button -->
      <button @click="togglePlay" class="control-button play-pause">
        <img v-if="!playing" src="@/assets/play-icon.svg" alt="Play" />
        <img v-else src="@/assets/pause-icon.svg" alt="Pause" />
      </button>

      <!-- Next Button (Hidden if only one song) -->
      <button
        v-if="songs.length > 1"
        @click="nextSong"
        class="control-button"
      >
        <img src="@/assets/next-icon.svg" alt="Next" />
      </button>
    </div>

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
import { ref, computed, onMounted, nextTick } from 'vue';

// Props
const props = defineProps({
  album: {
    type: Object,
    required: true,
  },
  placeholderImage: {
    type: String,
    default: '@/assets/placeholder-image.svg',
  },
});

// Reactive State
const playing = ref(false);
const currentSong = ref(null);
const audioPlayer = ref(null);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const isMuted = ref(false);
const shuffle = ref(false);
const repeat = ref(false);

// Computed: Song Data
const songs = computed(() => {
 
  try {
    console.log('why ', props.album)
    // If album has multiple songs
    if (props.album?.attributes?.songs) {
      const songsList = props.album.attributes.songs;
      return Array.isArray(songsList) ? songsList : [songsList];
    }
    // If album is just a single song
    if (props.album?.attributes) {
      console.log('ffffffffffff', props.album)
      return [
      {
      id: props.album.id || Date.now(),
      title: props.album.attributes.title || 'Unknown Title',
      file: props.album.attributes.file,
      song: props.album.attributes.song,
      embedUrl: props.album.attributes.embedUrl || "",
      isEmbeded: false,
      duration: props.album.attributes.duration || 0,
      cover: props.album.attributes.cover,
    },
      ];
    }
    // Otherwise, no valid songs
    console.warn('No valid song data found in album:', props.album);
    return [];
  } catch (error) {
    console.error('Error processing songs:', error);
    return [];
  }
});

// Computed: UI for album cover & song title
const albumCoverUrl = computed(() => {
  try {
    if (currentSong.value?.cover?.data?.attributes?.url) {
      return currentSong.value.cover.data.attributes.url;
    } else if (props.album?.attributes?.cover?.data?.attributes?.url) {
      return props.album.attributes.cover.data.attributes.url;
    }
    return props.placeholderImage;
  } catch (error) {
    console.error('Error getting album cover:', error);
    return props.placeholderImage;
  }
});
const currentSongTitle = computed(() =>
  currentSong.value?.title || 'Select a song'
);
const artistName = computed(() =>
  props.album.attributes?.artist || 'Unknown Artist'
);

// onMounted: Init volume
onMounted(async () => {
  await nextTick();
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value;
  }
});

// Always reset time to zero on click
// Single-click loads the file and plays from 0
const playSong = async (song) => {
  if (!audioPlayer.value) return;

  // Set the new or same currentSong
  currentSong.value = song;

  try {
    let fileUrl = '';
    if (song.file?.data?.attributes?.url) {
      fileUrl = song.file.data.attributes.url;
    } else if (song.song?.data?.attributes?.url) {
      fileUrl = song.song.data.attributes.url;
    } else if (typeof song.file === 'string') {
      fileUrl = song.file;
    }

    if (!fileUrl) {
      console.error('No valid file URL found:', song);
      return;
    }

    // Load the new URL
    audioPlayer.value.src = fileUrl;
    audioPlayer.value.load();

    // Wait for metadata
    await new Promise((resolve) => {
      audioPlayer.value.onloadedmetadata = resolve;
    });

    // **Reset time to 0** and play
    audioPlayer.value.currentTime = 0;
    await audioPlayer.value.play();
    playing.value = true;
  } catch (error) {
    console.error('Error playing audio:', error);
    playing.value = false;
  }
};

// Is this the current song?
const isCurrentSong = (song) =>
  currentSong.value && currentSong.value.id === song.id;

// Play/Pause toggle
const togglePlay = async () => {
  if (!audioPlayer.value) return;
  if (!currentSong.value) {
    // If no song is selected, pick the first one
    if (songs.value.length) {
      await playSong(songs.value[0]);
    }
    return;
  }

  if (playing.value) {
    audioPlayer.value.pause();
    playing.value = false;
  } else {
    try {
      await audioPlayer.value.play();
      playing.value = true;
    } catch (error) {
      console.error('Error playing audio:', error);
      playing.value = false;
    }
  }
};

// Next/Previous
const nextSong = async () => {
  if (shuffle.value) {
    playRandomSong();
  } else {
    const idx = songs.value.findIndex((s) => s.id === currentSong.value?.id);
    let nextIndex = idx + 1;
    if (nextIndex >= songs.value.length) nextIndex = 0;
    await playSong(songs.value[nextIndex]);
  }
};

const previousSong = async () => {
  // If only one song => reset same track
  if (songs.value.length === 1) {
    if (audioPlayer.value) {
      audioPlayer.value.currentTime = 0;
    }
    return;
  }
  // Otherwise normal logic
  const idx = songs.value.findIndex((s) => s.id === currentSong.value?.id);
  let prevIndex = idx - 1;
  if (prevIndex < 0) prevIndex = songs.value.length - 1;
  await playSong(songs.value[prevIndex]);
};

const playRandomSong = async () => {
  const randomIndex = Math.floor(Math.random() * songs.value.length);
  await playSong(songs.value[randomIndex]);
};

// When song ends
const onSongEnded = () => {
  if (repeat.value) {
    audioPlayer.value.currentTime = 0;
    audioPlayer.value.play();
  } else {
    nextSong();
  }
};

// Metadata loaded => set duration
const onAudioLoaded = () => {
  duration.value = audioPlayer.value?.duration || 0;
};

// Update time
const updateTime = () => {
  currentTime.value = audioPlayer.value?.currentTime || 0;
};

// Seek
const seekAudio = () => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = currentTime.value;
  }
};

// Format mm:ss
const formatTime = (time) => {
  if (!time && time !== 0) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};
</script>

<style scoped>
.player-container {
  display: flex;
  flex-direction: column;
  background-color: black;
  color: #fff;
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
  font-size: 1rem;
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
