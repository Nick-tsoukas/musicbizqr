<template>
  <div>
    <div v-if="band" class="hero">
      <img :src="band.data.attributes.bandImg.data.attributes.url" alt="Band Image" class="hero__image" />
      <div class="hero__content">
        <div class="hero__social">
          <ul>
            <li v-if="band.data.attributes.instagram">
              <a :href="band.data.attributes.instagram" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />              </a>
            </li>
            <li v-if="band.data.attributes.facebook">
              <a :href="band.data.attributes.facebook" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />
              </a>
            </li>
            <li v-if="band.data.attributes.twitch">
              <a :href="band.data.attributes.twitch" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />              </a>
            </li>
            <li v-if="band.data.attributes.appleMusic">
              <a :href="band.data.attributes.appleMusic" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />              </a>
            </li>
            <li v-if="band.data.attributes.soundcloud">
              <a :href="band.data.attributes.soundcloud" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <section>
      <pre>{{ band.data.attributes.albums.data }}</pre>
    </section>
  </div>
</template>

<script setup>


const route = useRoute();
const { data: band } = useFetch(`http://localhost:1337/api/bands/${route.params.id}?populate=*`);
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: calc(100vh - 75px);
  overflow: hidden;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__content {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 0;
  text-align: center;
}

.hero__social ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  margin: 0;
}

.hero__social li {
  margin: 0 10px;
}

.social-icon {
  width: 30px;
  height: 30px;
}
</style>
