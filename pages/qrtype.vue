
<template>
  <div>
    <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Choose Your QR Code Type</h1>
    <p class="mb-6"> Choose your preferred functionality below and start connecting with your audience like never before.</p>

    <div class="mb-4">
      <h3 class="text-xl font-bold mb-4">Custom Web Template</h3>
      <p class="mb-8">Generate a QR code that leads to a beautifully designed web template, tailored for musicians and bands. Engage your audience with a personalized digital experience.</p>
      
      <div class="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        
        <!-- Band Profiles Card -->
        <div class="bg-white shadow-lg h-auto rounded-lg overflow-hidden pb-2">
          <NuxtImg src="https://qrcode101.s3.us-east-1.amazonaws.com/ts_sergey_Aw76e_FV_8h_E_unsplash_ce7b20cbbc.jpg" alt="Band Profiles" class="w-full h-32 sm:h-48 object-cover"/>
          <div class="p-4">
            <h3 class="text-xl font-semibold">Band Profiles</h3>
            <p class="mt-2">Showcase your band’s bio, discography, and social media links. Give your fans an in-depth look at your journey and connect with them on multiple platforms.</p>
            <ul class="list-disc list-inside mt-2">
              <li><strong>Bio</strong>: Share your story and background.</li>
              <li><strong>Discography</strong>: Display your albums, singles, and EPs.</li>
              <li><strong>Social Media Links</strong>: Connect with fans on social media.</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <NuxtLink :to="{ path: '/createqr', query: { type: 'bandProfile' } }" class="btn text-center">
             Create Band Profile
            </NuxtLink>
            <button class="btn">
              Preview
            </button>
          </div>
        </div>

        <!-- Event Pages Card -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <NuxtImg src="https://qrcode101.s3.us-east-1.amazonaws.com/ts_sergey_Aw76e_FV_8h_E_unsplash_ce7b20cbbc.jpg" alt="Event Pages" class="w-full h-32 sm:h-48 object-cover"/>
          <div class="p-4">
            <h3 class="text-xl font-semibold">Event Pages</h3>
            <p class="mt-2">Create dedicated pages for upcoming events, complete with dates, locations, and ticketing information. Ensure your fans never miss a show.</p>
            <ul class="list-disc list-inside mt-2">
              <li><strong>Event Details</strong>: Provide comprehensive information about your events.</li>
              <li><strong>Locations</strong>: Share venue details and maps.</li>
              <li><strong>Ticketing</strong>: Offer links to purchase tickets.</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <NuxtLink :to="{ path: '/createqr', query: { type: 'events' } }" class="btn text-center">
             Create Events Page
            </NuxtLink>
            <button class="btn">
              Preview
            </button>
          </div>
        </div>

        <!-- Tip Jars Card -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <NuxtImg src="https://qrcode101.s3.us-east-1.amazonaws.com/ts_sergey_Aw76e_FV_8h_E_unsplash_ce7b20cbbc.jpg" alt="Tip Jars" class="w-full h-32 sm:h-48 object-cover"/>
          <div class="p-4">
            <h3 class="text-xl font-semibold">Tip Jars</h3>
            <p class="mt-2">Enable fans to support you directly through integrated tip jars. Make it easy for your audience to show their appreciation and contribute to your success.</p>
            <ul class="list-disc list-inside mt-2">
              <li><strong>Support</strong>: Allow fans to tip you directly.</li>
              <li><strong>Integration</strong>: Seamlessly integrate with popular payment platforms.</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <NuxtLink :to="{ path: '/createqr', query: { type: 'tipJar' } }" class="btn text-center">
             Tip Jar Page
            </NuxtLink>
            <button class="btn">
              Preview
            </button>
          </div>
        </div>

        <!-- Custom Audio Players Card -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <NuxtImg src="https://qrcode101.s3.us-east-1.amazonaws.com/ts_sergey_Aw76e_FV_8h_E_unsplash_ce7b20cbbc.jpg" alt="Custom Audio Players" class="w-full h-32 sm:h-48 object-cover"/>
          <div class="p-4">
            <h3 class="text-xl font-semibold">Custom Audio Players</h3>
            <p class="mt-2">Share your tracks or playlists seamlessly with embedded audio players. Let your music be heard instantly, right from the web template.</p>
            <ul class="list-disc list-inside mt-2">
              <li><strong>Track Sharing</strong>: Embed individual tracks.</li>
              <li><strong>Playlists</strong>: Create and share custom playlists.</li>
              <li><strong>Playback Controls</strong>: Provide intuitive controls for listeners.</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <NuxtLink :to="{ path: '/createqr', query: { type: 'audioPlayer' } }" class="btn text-center">
             Create Audio Page
            </NuxtLink>
            <button class="btn">
              Preview
            </button>
          </div>
        </div>
      </div>

      <div class="my-4">
      <h3 class="text-xl font-semibold">External Link QR Code</h3>
      <p class="mb-2">Create a QR code that directs users to any external link of your choice. Perfect for sharing your website, social media profiles, streaming links, or any other URL.</p>
      <ul class="list-disc list-inside mb-4">
        <li><strong>Instant Access</strong>: Provide fans with quick access to your latest releases, tour dates, or merchandise.</li>
        <li><strong>Versatile Use</strong>: Perfect for posters, flyers, business cards, and more.</li>
      </ul>
      <NuxtLink :to="{ path: 'createqr', query: { type: 'externalURL' } }" class="btn text-center">
            Create External Link
      </NuxtLink>
    </div>
    </div>

  </div>
  </div>
</template>

