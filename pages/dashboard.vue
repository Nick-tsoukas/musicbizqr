<template>
  <div class="bg-[#000]">
    <div class="bg-white text-black"></div>
    <div class="container bg-[#000] mx-auto p-4">
      <h1 class="text-2xl font-semibold mb-4 text-white">Dashboard</h1>
      

      <!-- QR Codes Section -->
      <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div
        v-else-if="qrItems.length"
        class="mb-6 border-2 border-white rounded-lg"
      >
        <!-- QR Codes List -->
        <div
          class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-8 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2
            class="text-2xl text-white font-extrabold self-start md:flex-grow"
          >
            QR Codes
          </h2>
          <NuxtLink
            to="/createqr"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create QR
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li
            v-for="qr in qrItems"
            :key="qr.id"
            class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row"
          >
            <img
              :src="qr.imageUrl"
              alt=""
              class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />
            <div class="flex-grow">
              <span
                class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold"
                >{{ qr.title }}</span
              >
            </div>
            <div class="flex items-center gap-4">
              <p class="text-white">Scans: {{ qr.scans.data.length ? qr.scans.data.length : 0 }}</p>
              <button
                @click="viewQr(qr.imageUrl)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/view-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="editItem(qr.id, 'editqr')"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/edit-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="deleteItem(qr.id, 'qr')"
                class="text-red-600 hover:text-red-800"
              >
                <img
                  src="@/assets/delete-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <!-- No QR Codes -->
        <div
          class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-8 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2
            class="text-2xl text-white font-extrabold self-start md:flex-grow"
          >
            QR Codes
          </h2>
          <NuxtLink
            to="/createqr"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create QR
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">
            Create Your First QR Code
          </h2>
        </div>
      </div>

      <!-- Bands Section -->
      <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div
        v-else-if="bandItems.length"
        class="mb-6 border-2 border-white rounded-lg"
      >
        <!-- Bands List -->
        <div
          class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-green-500 to-teal-500 py-8 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2
            class="text-2xl text-white font-extrabold self-start md:flex-grow"
          >
            Bands
          </h2>
          <NuxtLink
            to="/createband"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create
            Artist Page
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li
            v-for="band in bandItems"
            :key="band.id"
            class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row"
          >
            <img
              :src="band.imageUrl"
              alt=""
              class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />
            <div class="flex-grow">
              <span
                class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold"
                >{{ band.title }}</span
              >
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="router.push(`/${band.slug}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/view-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="router.push(`/editband/${band.id}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/edit-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="deleteItem(band.id, 'band')"
                class="text-red-600 hover:text-red-800"
              >
                <img
                  src="@/assets/delete-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <!-- NEW: Analytics Button -->
              <button
                @click="router.push(`/analytics/${band.id}`)"
                class="text-green-600 hover:text-green-900"
              >
                <img
                  src="@/assets/analytics-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <!-- No Bands -->
        <div
          class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-green-500 to-teal-500 py-8 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2
            class="text-2xl text-white font-extrabold self-start md:flex-grow"
          >
            Bands
          </h2>
          <NuxtLink
            to="/createband"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create
            Band
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">
            Create Your First Band
          </h2>
        </div>
      </div>

      <!-- <pre class="text-white">this is scan data {{ scans }}</pre> -->
      <!-- Scans Chart Section -->
      <div
        v-if="!loading && scansPerMonth.labels.length"
        class="mb-6 border-2 border-white rounded-lg"
      >
        <div
          class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-8"
        >
          <h2 class="text-2xl text-white font-extrabold">Scans Over Time</h2>
        </div>
        <div class="px-6 py-6">
          <ScansChart
            :labels="scansPerMonth.labels"
            :data="scansPerMonth.data"
          />
        </div>
      </div>

      <!-- Social Links Section -->
      <!-- <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div v-else-if="socialItems.length" class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-blue-500 to-indigo-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Social Links</h2>
          <NuxtLink to="/socialpage" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Social Links
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li v-for="social in socialItems" :key="social.id" class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row">
            <img :src="social.imageUrl" alt="" class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4">
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ social.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <button @click="router.push(`/social/${social.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="router.push(`/editsocial/${social.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="deleteItem(social.id, 'socialpage')" class="text-red-600 hover:text-red-800">
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-blue-500 to-indigo-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Social Links</h2>
          <NuxtLink to="/socialpage" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Social Links
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">Create Your First Social Link</h2>
        </div>
      </div> -->

      <!-- Events Section -->
      <!-- <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div v-else-if="eventItems.length" class="mb-6 border-2 border-white rounded-lg">
      
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-yellow-500 to-orange-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Events</h2>
          <NuxtLink to="/newevent" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Event
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li v-for="event in eventItems" :key="event.id" class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row">
            <img :src="event.imageUrl" alt="" class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4">
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ event.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <button @click="router.push(`/event/${event.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="router.push(`/editevent/${event.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="deleteItem(event.id, 'event')" class="text-red-600 hover:text-red-800">
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
       
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-yellow-500 to-orange-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Events</h2>
          <NuxtLink to="/newevent" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Event
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">Create Your First Event</h2>
        </div>
      </div> -->

      <!-- Tours Section -->
      <!-- <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div v-else-if="tourItems.length" class="mb-6 border-2 border-white rounded-lg">
        
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-purple-500 to-indigo-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Tours</h2>
          <NuxtLink to="/newtour" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Tour
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li v-for="tour in tourItems" :key="tour.id" class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row">
            <img :src="tour.imageUrl" alt="" class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4">
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ tour.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <button @click="router.push(`/tour/${tour.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="router.push(`/edittour/${tour.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="deleteItem(tour.id, 'tour')" class="text-red-600 hover:text-red-800">
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-purple-500 to-indigo-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Tours</h2>
          <NuxtLink to="/newtour" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Tour
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">Create Your First Tour</h2>
        </div>
      </div> -->

      <!-- Albums Section -->
      <!-- <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div v-else-if="albumItems.length" class="mb-6 border-2 border-white rounded-lg">
        
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-red-500 to-pink-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Albums</h2>
          <NuxtLink to="/newalbum" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Album
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li v-for="album in albumItems" :key="album.id" class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row">
            <img :src="album.imageUrl" alt="" class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4">
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ album.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <button @click="router.push(`/album/${album.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="router.push(`/editalbum/${album.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="deleteItem(album.id, 'album')" class="text-red-600 hover:text-red-800">
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
      
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-red-500 to-pink-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Albums</h2>
          <NuxtLink to="/newalbum" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Album
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">Create Your First Album</h2>
        </div>
      </div> -->

      <!-- Streams Section -->
      <!-- <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div v-else-if="streamItems.length" class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-teal-500 to-green-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Streams</h2>
          <NuxtLink to="/createstreamlinks" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Stream
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li v-for="stream in streamItems" :key="stream.id" class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row">
            <img :src="stream.imageUrl" alt="" class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4">
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ stream.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <button @click="router.push(`/stream/${stream.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="router.push(`/editstream/${stream.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="deleteItem(stream.id, 'stream')" class="text-red-600 hover:text-red-800">
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-teal-500 to-green-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Streams</h2>
          <NuxtLink to="/createstreamlinks" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Stream
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">Create Your First Stream</h2>
        </div>
      </div> -->

      <!-- Videos Section -->
      <!-- <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div v-else-if="videoItems.length" class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-indigo-500 to-purple-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Videos</h2>
          <NuxtLink to="/createvideogrid" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Video Grid
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li
            v-for="video in videoItems"
            :key="video.id"
            class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row"
          >
            <div class="flex items-center flex-col gap-4 md:flex-row md:gap-0">
              <img
                v-if="video.bandimgUrl"
                :src="video.bandimgUrl"
                alt="Band Image"
                class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4"
              >
              <div>
                <h3 class="text-white font-semibold">{{ video.title }} </h3>
              </div>
            </div>

          
            <div class="flex items-center gap-4">
              <button @click="router.push(`/video/${video.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="router.push(`/editvideo/${video.id}`)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="deleteItem(video.id, 'video')" class="text-red-600 hover:text-red-800">
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
       
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-indigo-500 to-purple-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Videos Pages</h2>
          <NuxtLink to="/createvideogrid" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Video Grid
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">Create Your First Video Page</h2>
        </div>
      </div> -->

      <!-- VIEW QR Popup -->
      <div
        v-if="qrView"
        class="h-screen w-screen bg-black z-50 fixed overflow-hidden top-0 right-0 flex justify-center items-center"
      >
        <div class="flex flex-col gap-4">
          <img :src="imageURL" class="max-h-[67vh]" alt="" />
          <button
            @click="downloadImage"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Download Image
          </button>
        </div>
        <div class="absolute bottom-10 right-10">
          <h2 @click="viewQr" class="text-white cursor-pointer">Close</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const user = useStrapiUser();
const router = useRouter();
const client = useStrapiClient();
const { find } = useStrapi();

const loading = ref(true);
const qrs = ref([]);
const scans = ref([]);
const bands = ref([]);
const events = ref([]);
const tours = ref([]);
const albums = ref([]);
const streams = ref([]);
const socials = ref([]);
const videos = ref([]);

const fetchData = async () => {
  if (user.value) {
    try {
      await fetchQrs(); // Fetch QR codes first
      await fetchScans(); // Then fetch scans

      // Fetch other data in parallel
      await Promise.all([
        fetchBands(),
        fetchEvents(),
        fetchTours(),
        fetchAlbums(),
        fetchStreams(),
        fetchSocials(),
        fetchVideos(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loading.value = false;
    }
  }
};

const fetchQrs = async () => {
  try {
    const response = await find("qrs", {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: "*",
    });
    qrs.value = response.data;
  } catch (error) {
    console.error("Error fetching QR codes:", error);
  }
};

const fetchScans = async () => {
  try {
    // Get the IDs of the user's QR codes
    const qrIds = qrs.value.map((qr) => qr.id);

    if (qrIds.length === 0) {
      scans.value = [];
      return;
    }

    // Fetch scans where qr.id is in qrIds
    const response = await find("scans", {
      filters: {
        qr: {
          id: {
            $in: qrIds,
          },
        },
      },
      pagination: {
        pageSize: 1000, // Adjust as needed
      },
      populate: "*",
    });
    scans.value = response.data;
  } catch (error) {
    console.error("Error fetching scans:", error);
  }
};

// Process scans to get counts per month
const scansPerMonth = computed(() => {
  const counts = {};

  scans.value.forEach((scan) => {
    const dateStr = scan.attributes.date;
    const date = new Date(dateStr);

    if (isNaN(date)) {
      console.error("Invalid date:", dateStr);
      return;
    }

    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    counts[key] = (counts[key] || 0) + 1;
  });

  const sortedKeys = Object.keys(counts).sort();
  const labels = [];
  const data = [];

  sortedKeys.forEach((key) => {
    const [year, month] = key.split("-");
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });
    labels.push(`${monthName} ${year}`);
    data.push(counts[key]);
  });

  return { labels, data };
});

// Fetch other data (Bands, Events, Tours, Albums, Streams, Social Links, Videos)
// ... (The rest of your fetch functions remain unchanged)
const fetchBands = async () => {
  try {
    const response = await find("bands", {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: "*",
    });
    console.log('this is the fetch bands ', response.data)
    if (response.data && Array.isArray(response.data)) {
      bands.value = response.data; // Assign as array
    } else {
      bands.value = []; // Fallback to an empty array
    }

    console.log("Fetched bands:", bands.value);
  } catch (error) {
    console.error("Error fetching bands:", error);
    bands.value = [];
  }
};



const fetchEvents = async () => {
  try {
    const response = await find("events", {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: "*",
    });
    events.value = response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

const fetchSocials = async () => {
  try {
    const response = await find("socialpages", {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: "*",
    });
    socials.value = response.data;
  } catch (error) {
    console.error("Error fetching social pages:", error);
  }
};

const fetchTours = async () => {
  try {
    const response = await find("tours", {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: "*",
    });
    tours.value = response.data;
  } catch (error) {
    console.error("Error fetching tours:", error);
  }
};

const fetchStreams = async () => {
  try {
    const response = await find("streams", {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: "*",
    });
    streams.value = response.data;
  } catch (error) {
    console.error("Error fetching streams:", error);
  }
};
const fetchVideos = async () => {
  try {
    const response = await find("videos", {
      filters: {
        users_permissions_users: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: {
        mediayoutube: true,
        bandImg: true,
        users_permissions_users: true,
      },
    });

    videos.value = response.data;
    console.log(response.data, "Fetched videos data");
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
};

// videoItems Computed Property

const fetchAlbums = async () => {
  try {
    const response = await find("albums", {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: "*",
    });
    albums.value = response.data;
  } catch (error) {
    console.error("Error fetching albums:", error);
  }
};
// Delete Item Function
const deleteItem = async (id, type) => {
  try {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    loading.value = true;

    await client(`/${type}s/${id}`, {
      method: "DELETE",
    });

    await fetchData();

    loading.value = false;

    alert(
      `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`
    );
  } catch (error) {
    loading.value = false;
    console.error(`Error deleting ${type}:`, error);
    alert(`Failed to delete ${type}. Please try again.`);
  }
};

const imageURL = ref("");
const qrView = ref(false);

const viewQr = (img) => {
  imageURL.value = img;
  qrView.value = !qrView.value;
};

const downloadImage = () => {
  const link = document.createElement("a");
  link.download = "downloaded-image.jpg";
  link.href = imageURL.value;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  fetchData();
});

const editItem = (id, page) => {
  router.push({ path: `/${page}/${id}` });
};

// Computed properties for items
const qrItems = computed(() =>
  qrs.value.map((qr) => ({
    id: qr.id,
    title: qr.attributes.name,
    imageUrl: qr.attributes.q_image?.data?.attributes?.url || "",
    scans: qr.attributes.scans || 0, // Assuming scans are stored here
  }))
);

// Helper function to extract YouTube Video ID from a YouTube URL or ID string
function extractYouTubeId(url) {
  const regExp =
    /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|youtube\.com\/v\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const videoItems = computed(() =>
  videos.value.map((video) => ({
    id: video.id,
    title: video.attributes.bandname || "No Band Name",
    bandlink: video.attributes.bandlink || "",

    bandimgUrl:
      video.attributes.bandImg?.data?.attributes?.formats?.medium?.url ||
      video.attributes.bandImg?.data?.attributes?.url ||
      "",

    youtubeThumbnails:
      video.attributes.mediayoutube?.map((youtubeVideo) => {
        const videoId = extractYouTubeId(youtubeVideo.videoid);
        return {
          videoId,
          thumbnailUrl: videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : "",
        };
      }) || [],
  }))
);

const bandItems = computed(() =>
  Array.isArray(bands.value)
    ? bands.value.map((band) => ({
        id: band.id,
        title: band.name || "Untitled Band", // No 'attributes' field in response
        slug: band.slug || "no-slug", // Handle missing slug
        imageUrl: band.bandImg?.formats?.medium?.url || band.bandImg?.url || "", // Safely access image URL
      }))
    : [] // Prevent errors if bands.value is not an array
);



const eventItems = computed(() =>
  events.value.map((event) => ({
    id: event.id,
    title: event.attributes.title,
    imageUrl: event.attributes.image?.data?.attributes?.url || "",
  }))
);

const tourItems = computed(() =>
  tours.value.map((tour) => ({
    id: tour.id,
    title: tour.attributes.title,
    imageUrl: tour.attributes.image?.data?.attributes?.url || "",
  }))
);

const socialItems = computed(() =>
  socials.value.map((social) => ({
    id: social.id,
    title: social.attributes.title,
    imageUrl: social.attributes.img?.data?.attributes?.url || "",
  }))
);

const albumItems = computed(() =>
  albums.value.map((album) => ({
    id: album.id,
    title: album.attributes.title,
    imageUrl: album.attributes.cover?.data?.attributes?.url || "",
  }))
);

const streamItems = computed(() =>
  streams.value.map((stream) => ({
    id: stream.id,
    title: stream.attributes.bandTitle,
    imageUrl: stream.attributes.img?.data?.attributes?.url || "",
  }))
);
</script>

<style scoped lang="css">
.mdc-button {
  border: 1px solid white;
  background: transparent;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}

.mdc-button img {
  height: 20px;
}

.mdc-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

img {
  object-fit: cover;
}

.text-white {
  color: #fff;
}

.border-white {
  border-color: #fff;
}

.bg-[#000] {
  background-color: #000;
}

.container {
  max-width: 1200px;
}
</style>
