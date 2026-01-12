<template>
  <div>
    <div v-if="loadingData" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div
      v-else-if="notFound"
      class="bg-black w-screen min-h-[60vh] mx-auto pt-[var(--header-height)] fade-in"
    >
      <div class="max-w-5xl mx-auto px-6 py-10">
        <div class="text-white text-2xl font-bold">Band not found</div>
        <div class="text-white/70 mt-2">
          Check the link and try again.
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-black w-screen h-[35vh] md:h-[60vh] mx-auto pt-[var(--header-height)] fade-in"
    >
      <div
        v-if="paymentBannerVisible"
        class="w-full px-4 md:px-8 py-3 bg-purple-900/60 text-white border-b border-purple-500/40"
      >
        <div class="max-w-5xl mx-auto flex items-start justify-between gap-4">
          <div class="text-sm md:text-base">
            <div class="font-semibold">
              {{ paymentBannerTitle }}
            </div>
            <div v-if="paymentBannerDetail" class="text-white/90 mt-1">
              {{ paymentBannerDetail }}
            </div>
          </div>
          <button
            type="button"
            class="text-white/80 hover:text-white text-lg leading-none"
            @click="dismissPaymentBanner"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="relative w-full h-[35vh] md:h-[60vh]">
        <img
          v-if="band.data.bandImg"
          :src="band.data.bandImg.url"
          :alt="`${band.data.name} image`"
          class="absolute inset-0 w-auto m-auto h-[35vh] md:h-2/3 object-cover"
        />

        <div class="absolute inset-0 bg-black/0"></div>
      </div>

      <!-- Band Name -->
      <div
        v-if="!band.data.isBandNameInLogo"
        class="text-center text-white text-4xl font-bold mt-4"
      >
        {{ band.data.name }}
      </div>

      <!-- Bio & Tagline -->
      <div class="flex justify-center mt-4">
        <div class="text-center text-white max-w-5xl">
          <p
            v-if="band.data.bio"
            class="md:text-2xl leading-tight whitespace-pre-line"
          >
            {{ band.data.bio }}
          </p>
          <p
            v-if="band.data.biotagline"
            class="md:text-2xl leading-tight whitespace-pre-line mt-2"
          >
            {{ band.data.biotagline }}
          </p>
        </div>
      </div>


      <!-- Main Content -->
      <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
        <!-- Featured Song -->
        <section v-if="hasFeaturedSong && isSectionVisible('audio')" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Featured Song
          </h2>

          <!-- Embedded Track -->
          <div
            v-if="band.data.singlesong.isEmbed && safeEmbedHtml"
            class="w-full"
          >
            <div
              class="relative w-full h-64 rounded-lg overflow-hidden"
              :class="{ 'embed-shake': embedShake }"
            >
              <div
                id="embedPlayerWrapper"
                ref="embedPlayerWrapperEl"
                class="absolute inset-0 w-full h-full"
                v-html="safeEmbedHtml"
              ></div>

              <div
                v-if="!hasTrackedEmbedClick"
                class="absolute inset-0 z-10 flex items-center justify-center bg-black/35 text-white text-sm font-semibold"
                @click.prevent.stop="onEmbedOverlayTap"
              >
                Tap to play
              </div>

              <div
                v-if="showEmbedTapAgainHint"
                class="absolute inset-x-0 bottom-2 z-20 flex justify-center pointer-events-none"
              >
                <div class="px-3 py-1 rounded-md bg-black/70 text-white text-xs">
                  Tap again to play
                </div>
              </div>
            </div>
          </div>

          <!-- Raw Audio -->
          <div v-else class="w-full">
            <AudioPlayer
              :album="formatSingleSong(band.data.singlesong)"
              :placeholderImage="'/placeholder-image.svg'"
              @play="onSongPlay"
              class="rounded-lg"
            />
          </div>
        </section>

        <!-- Featured Video -->
        <section v-if="band.data.singlevideo?.youtubeid && isSectionVisible('video')" class="w-full mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Featured Video
          </h2>

          <div
            v-if="!isVideoPlaying"
            @click="playVideo"
            class="relative w-full overflow-hidden bg-black cursor-pointer rounded-lg embed-container"
          >
            <img
              :src="singleVideoThumbnail"
              :alt="`${band.data.name} video thumbnail`"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/30"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="h-12 w-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/15"
              >
                <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div v-else class="embed-container rounded-lg overflow-hidden">
            <iframe
              :src="singleVideoEmbedUrl + '?autoplay=1'"
              allow="autoplay; encrypted-media; fullscreen"
              allowfullscreen
            ></iframe>
          </div>
        </section>

        <!-- Website Link -->
        <section v-if="band.data.websitelink && isSectionVisible('website')" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
            Website Link
          </h2>
          <a
            :href="band.data.websitelink"
            class="text-purple-500 text-xl"
            target="_blank"
            rel="noopener"
          >
            {{ band.data.websitelinktext || band.data.websitelink }}
          </a>
        </section>

        <!-- Streaming Links -->
        <section v-if="hasStreamingLinks && isSectionVisible('streaming')" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Streaming Links
          </h2>
          <template v-for="platform in orderedStreamingPlatforms" :key="platform.name">
            <span v-if="band.data[platform.name] && !isLinkHidden(platform.name)">
              <a
                :href="band.data[platform.name]"
                @click.prevent="
                  handleClick(
                    band.data.id,
                    platform.name,
                    band.data[platform.name]
                  )
                "
              >
                <button
                  class="w-full mb-6 custom-border text-white text-lg flex items-center gap-3 font-semibold px-4 py-4 shadow-lg rounded-md md:text-xl min-w-0"
                >
                  <img
                    :src="platform.img"
                    class="h-8 w-8 shrink-0"
                    :alt="platform.label"
                  />
                  <span class="min-w-0 truncate">{{ platform.label }}</span>
                </button>
              </a>
            </span>
          </template>
        </section>

        <!-- Social Media -->
        <section v-if="hasSocialLinks && isSectionVisible('social')" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Social Media
          </h2>
          <template v-for="platform in orderedSocialPlatforms" :key="platform.name">
            <span v-if="band.data[platform.name] && !isLinkHidden(platform.name)">
              <a
                :href="band.data[platform.name]"
                @click.prevent="
                  handleClick(
                    band.data.id,
                    platform.name,
                    band.data[platform.name]
                  )
                "
              >
                <button
                  class="w-full custom-border mb-6 text-white text-lg flex items-center gap-3 font-semibold px-4 py-4 shadow-lg rounded-md md:text-xl min-w-0"
                >
                  <img
                    :src="platform.img"
                    class="h-8 w-8 shrink-0"
                    :alt="platform.label"
                  />
                  <span class="min-w-0 truncate">{{ platform.label }}</span>
                </button>
              </a>
            </span>
          </template>
        </section>

        <!-- Upcoming Events -->
        <section
          v-if="upcomingEvents.length && isSectionVisible('events')"
          id="upcoming-events"
          class="mt-10"
        >
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Upcoming Events
          </h2>

          <div class="border border-white/70 bg-black/10 rounded-2xl p-4 md:p-5 hover:border-white transition motion-reduce:transition-none">
            <!-- Next Show (Featured) -->
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div class="min-w-0">
                <div class="text-white/70 text-sm font-semibold">Next Show</div>
                <div class="text-2xl md:text-3xl font-bold text-white mt-1">
                  {{ nextUpcomingEvent.city || 'TBA' }}<span v-if="nextUpcomingEvent.state">, {{ nextUpcomingEvent.state }}</span>
                </div>
                <div class="text-white/85 mt-1 font-semibold">
                  {{ nextUpcomingEvent.venue || 'Venue TBA' }}
                </div>
                <div class="text-purple-300 mt-2 font-semibold">
                  {{ formatDate(nextUpcomingEvent.date) }}
                </div>
              </div>

              <button
                type="button"
                class="w-full md:w-auto rounded-xl border border-white bg-transparent font-semibold text-white hover:bg-white/5 active:bg-white/10 px-4 py-3 transition duration-200 ease-out hover:-translate-y-[1px] active:translate-y-0 motion-reduce:transition-none motion-reduce:transform-none"
                @click.stop="router.push(`/${route.params.bandSlug}/event/${nextUpcomingEvent.slug}`)"
              >
                {{ nextUpcomingEvent.ticketLink ? 'Tickets' : 'View Event' }}
              </button>
            </div>

            <!-- Other Upcoming Events -->
            <div v-if="otherUpcomingEvents.length" class="mt-4 border-t border-white/15 pt-4">
              <!-- Mobile: Card list -->
              <div class="md:hidden space-y-3">
                <div
                  v-for="event in paginatedUpcomingEvents"
                  :key="event.id"
                  class="rounded-xl border border-white/10 bg-black/20 px-4 py-3 cursor-pointer hover:bg-white/5 transition motion-reduce:transition-none"
                  @click.stop="router.push(`/${route.params.bandSlug}/event/${event.slug}`)"
                >
                  <div class="text-purple-300 font-semibold">{{ formatDate(event.date) }}</div>
                  <div class="text-white font-semibold mt-1">
                    {{ event.city || 'TBA' }}<span v-if="event.state">, {{ event.state }}</span>
                  </div>
                  <div class="text-white/80">{{ event.venue || 'Venue TBA' }}</div>
                  <button
                    type="button"
                    class="mt-3 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 font-semibold text-white shadow-sm transition duration-200 ease-out hover:bg-white/10 active:scale-[0.98] motion-reduce:transition-none"
                    @click.stop="router.push(`/${route.params.bandSlug}/event/${event.slug}`)"
                  >
                    View Event
                  </button>
                </div>
              </div>

              <!-- Desktop: Table -->
              <div class="hidden md:block relative overflow-x-auto">
                <table class="w-full table-fixed bg-transparent text-white rounded-md">
                  <thead>
                    <tr class="border-b border-purple-500 border-opacity-30">
                      <th class="px-2 py-2 text-left w-[7.5rem]">Date</th>
                      <th class="px-2 py-2 text-left">City</th>
                      <th class="px-2 py-2 text-left">Venue</th>
                      <th class="px-2 py-2 text-left w-[6rem]">Tickets</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="event in paginatedUpcomingEvents"
                      :key="event.id"
                      class="border-b border-purple-500 border-opacity-20 hover:bg-purple-900/30 cursor-pointer transition motion-reduce:transition-none"
                      @click.stop="router.push(`/${route.params.bandSlug}/event/${event.slug}`)"
                    >
                      <td class="px-2 py-2 text-purple-400">
                        {{ formatDate(event.date) }}
                      </td>
                      <td class="px-2 py-2 text-purple-400 break-words">
                        {{ event.city || 'TBA' }}<span v-if="event.state">, {{ event.state }}</span>
                      </td>
                      <td class="px-2 py-2 text-purple-400 break-words">
                        {{ event.venue || 'Venue TBA' }}
                      </td>
                      <td class="px-2 py-2 text-purple-400">
                        <button type="button" class="text-purple-400 hover:text-white transition">
                          View Event
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination for Upcoming Events -->
              <div v-if="totalUpcomingPages > 1" class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                <button
                  @click="upcomingEventsPage = Math.max(1, upcomingEventsPage - 1)"
                  :disabled="upcomingEventsPage === 1"
                  class="px-3 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  :class="upcomingEventsPage === 1 ? 'border-white/10 text-white/40' : 'border-white/20 text-white hover:bg-white/5'"
                >
                  ← Prev
                </button>
                <span class="text-sm text-white/60">
                  {{ upcomingEventsPage }} of {{ totalUpcomingPages }}
                </span>
                <button
                  @click="upcomingEventsPage = Math.min(totalUpcomingPages, upcomingEventsPage + 1)"
                  :disabled="upcomingEventsPage === totalUpcomingPages"
                  class="px-3 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  :class="upcomingEventsPage === totalUpcomingPages ? 'border-white/10 text-white/40' : 'border-white/20 text-white hover:bg-white/5'"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Past Events -->
        <section v-if="pastEvents.length && isSectionVisible('events')" class="mt-10">
          <div class="flex items-end justify-between gap-4 mb-4">
            <h2 class="text-2xl md:text-3xl font-bold text-white">
              Past Events
            </h2>
            <div class="text-white/50 text-sm">{{ pastEvents.length }} total</div>
          </div>

          <!-- Mobile: Simple list -->
          <div class="md:hidden space-y-2">
            <div
              v-for="event in paginatedPastEvents"
              :key="event.id"
              class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 cursor-pointer hover:bg-white/5 transition motion-reduce:transition-none"
              @click.stop="router.push(`/${route.params.bandSlug}/event/${event.slug}`)"
            >
              <div class="min-w-0">
                <div class="text-white/60 text-sm">{{ formatDate(event.date) }}</div>
                <div class="text-white font-semibold truncate">
                  {{ event.city || 'TBA' }}<span v-if="event.state">, {{ event.state }}</span>
                </div>
                <div class="text-white/70 text-sm truncate">{{ event.venue || 'Venue' }}</div>
              </div>
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-white/40 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>

          <!-- Desktop: Table -->
          <div class="hidden md:block relative overflow-x-auto rounded-xl border border-white/10 bg-black/20">
            <table class="w-full table-fixed bg-transparent text-white">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="px-4 py-3 text-left text-sm font-semibold text-white/70 w-[8rem]">Date</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-white/70">City</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-white/70">Venue</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-white/70 w-[5rem]"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="event in paginatedPastEvents"
                  :key="event.id"
                  class="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition motion-reduce:transition-none"
                  @click.stop="router.push(`/${route.params.bandSlug}/event/${event.slug}`)"
                >
                  <td class="px-4 py-3 text-white/60 text-sm">
                    {{ formatDate(event.date) }}
                  </td>
                  <td class="px-4 py-3 text-white break-words">
                    {{ event.city || 'TBA' }}<span v-if="event.state">, {{ event.state }}</span>
                  </td>
                  <td class="px-4 py-3 text-white/80 break-words">
                    {{ event.venue || 'Venue' }}
                  </td>
                  <td class="px-4 py-3">
                    <svg viewBox="0 0 24 24" class="h-4 w-4 text-white/40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination for Past Events -->
          <div v-if="totalPastPages > 1" class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
            <button
              @click="pastEventsPage = Math.max(1, pastEventsPage - 1)"
              :disabled="pastEventsPage === 1"
              class="px-3 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              :class="pastEventsPage === 1 ? 'border-white/10 text-white/40' : 'border-white/20 text-white hover:bg-white/5'"
            >
              ← Prev
            </button>
            <span class="text-sm text-white/60">
              {{ pastEventsPage }} of {{ totalPastPages }}
            </span>
            <button
              @click="pastEventsPage = Math.min(totalPastPages, pastEventsPage + 1)"
              :disabled="pastEventsPage === totalPastPages"
              class="px-3 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              :class="pastEventsPage === totalPastPages ? 'border-white/10 text-white/40' : 'border-white/20 text-white hover:bg-white/5'"
            >
              Next →
            </button>
          </div>
        </section>

        <section v-if="canShowMerchConcierge && isSectionVisible('merch')" class="mt-10">
          <div class="border border-violet-500/40 bg-gradient-to-br from-violet-900/40 to-black/40 rounded-2xl p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-2xl md:text-3xl font-bold text-white">Skip the merch line</div>
                <div class="text-white/80 mt-1">Show-only merch • Pick up after the set</div>
                <div v-if="merchPickupLine" class="text-violet-200 mt-2">
                  Pickup: <span class="text-white">{{ merchPickupLine }}</span>
                </div>
              </div>
            </div>

            <div v-if="merchError" class="text-red-300 mt-3">{{ merchError }}</div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                v-for="(item, i) in merchItems"
                :key="i"
                class="border border-white/10 bg-black/30 rounded-xl overflow-hidden"
              >
                <div class="w-full h-44 bg-white/5">
                  <img
                    v-if="item.imageUrl"
                    :src="item.imageUrl"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div class="p-4">
                  <div class="text-white font-semibold text-lg">{{ item.title }}</div>
                  <div v-if="item.description" class="text-white/70 text-sm mt-1">
                    {{ item.description }}
                  </div>
                  <div class="text-white mt-3 font-semibold">
                    {{ formatUsd(item.priceCents) }}
                  </div>

                  <div v-if="item.sizesEnabled" class="mt-3">
                    <div class="text-white/70 text-sm mb-2">Select a size</div>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="sz in item.availableSizes"
                        :key="sz"
                        type="button"
                        class="px-3 py-2 rounded-md border border-white/20 text-white disabled:opacity-50"
                        :class="
                          selectedMerchSizeByIndex?.[i] === sz
                            ? 'bg-violet-900/60 hover:bg-violet-900/60 focus:bg-violet-900/60'
                            : 'hover:bg-white/5 focus:bg-white/5'
                        "
                        :disabled="Number(item.sizeStock?.[sz] || 0) <= 0"
                        @click="selectMerchSize(i, sz)"
                      >
                        {{ sz }}
                      </button>
                    </div>
                  </div>

                  <div v-else class="mt-3 text-white/70 text-sm">
                    <span v-if="item.availableQty > 0">Remaining: {{ item.availableQty }}</span>
                    <span v-else>Sold out</span>
                  </div>

                  <button
                    type="button"
                    class="w-full mt-4 px-4 py-3 rounded-lg font-semibold text-white border border-violet-400/40 bg-violet-700/40 hover:bg-violet-700/55 disabled:opacity-60"
                    :disabled="!canBuyMerchItem(i) || merchCheckoutLoadingIndex === i"
                    @click="startMerchCheckout(i)"
                  >
                    <span v-if="merchCheckoutLoadingIndex === i">Loading…</span>
                    <span v-else>{{ isMerchSoldOut(i) ? "Sold out" : "Reserve & Pay" }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="canShowPayments && isSectionVisible('payments')" class="mt-10">
          <div v-if="paymentError" class="text-red-400 mb-3">
            {{ paymentError }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div
              v-for="btn in enabledPaymentButtons"
              :key="btn.key"
              class="border border-white/20 rounded-lg p-4 bg-black/40"
            >
              <div class="text-white font-semibold text-lg">
                {{ btn.title }}
              </div>
              <div v-if="btn.description" class="text-white/80 mt-1">
                {{ btn.description }}
              </div>

              <div class="mt-3">
                <div v-if="btn.pricingMode === 'min'">
                  <div class="text-white/70 text-sm mb-2">Enter an amount</div>
                  <div class="flex items-center gap-2">
                    <span class="text-white/80">$</span>
                    <input
                      v-model.number="paymentAmountByKey[btn.key]"
                      type="number"
                      step="1"
                      min="0"
                      class="w-32 px-3 py-2 rounded-md bg-black border border-white/20 text-white"
                    />
                    <span v-if="btn.minAmount" class="text-white/60">
                      Minimum ${{ btn.minAmount }}
                    </span>
                  </div>
                </div>

                <div v-else-if="btn.pricingMode === 'presets'">
                  <div class="text-white/70 text-sm mb-2">Select an amount</div>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="amt in (btn.presetAmounts || [])"
                      :key="amt"
                      type="button"
                      class="px-3 py-2 rounded-md border border-white/20 text-white hover:bg-purple-900/40"
                      :class="{
                        'bg-purple-900/60': Number(paymentAmountByKey[btn.key]) === Number(amt),
                      }"
                      @click="paymentAmountByKey[btn.key] = Number(amt)"
                    >
                      ${{ amt }}
                    </button>
                  </div>
                </div>

                <div v-else-if="btn.pricingMode === 'fixed'">
                  <div class="text-white/70 text-sm mb-1">Fixed price</div>
                  <div class="text-white text-xl font-semibold">
                    ${{ btn.fixedAmount }}
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="w-full mt-4 custom-border text-white text-lg flex justify-center font-semibold px-4 py-3 items-center relative shadow-lg rounded-md md:text-xl disabled:opacity-60"
                :disabled="paymentLoadingKey === btn.key"
                @click="startCheckout(btn)"
              >
                <span v-if="paymentLoadingKey === btn.key">Loading…</span>
                <span v-else>Continue to Payment</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Follow & Save Band Section -->
      <div class="w-full px-6 mt-16 mb-8 md:max-w-[80vw] md:mx-auto">
        <!-- Follow Band Button -->
        <button
          v-if="followablePlatforms.length > 0 && isSectionVisible('follow')"
          type="button"
          class="w-full mb-4 flex items-center justify-center gap-3 rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-900/50 to-violet-900/50 px-4 py-4 text-white text-lg md:text-xl font-semibold shadow-lg transition hover:from-purple-900/70 hover:to-violet-900/70 hover:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          @click="openFollowModal"
        >
          <svg class="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <span>Follow {{ band.data.name }}</span>
        </button>

        <!-- Save Band Button -->
        <client-only>
          <button
            v-if="band?.data"
            type="button"
            class="w-full mb-4 flex items-center justify-center gap-3 rounded-2xl px-4 py-4 text-white text-lg md:text-xl font-semibold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            :class="isCurrentBandSaved 
              ? 'border border-amber-500/50 bg-gradient-to-r from-amber-900/40 to-yellow-900/40 hover:from-amber-900/60 hover:to-yellow-900/60 hover:border-amber-400/70' 
              : 'border border-white/20 bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-slate-800/80 hover:to-slate-700/80 hover:border-white/30'"
            @click="onToggleSaveBand"
          >
            <svg v-if="isCurrentBandSaved" class="h-6 w-6 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-6 w-6 shrink-0 text-white/70" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <span>{{ isCurrentBandSaved ? "Saved to My Bands" : "Save to My Bands" }}</span>
          </button>
          
          <!-- Saved Confirmation -->
          <Transition name="fade">
            <div 
              v-if="showSavedConfirmation" 
              class="flex items-center justify-center gap-2 text-amber-300/90 text-sm py-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
              </svg>
              <span>Saved — find it anytime in the menu</span>
            </div>
          </Transition>
        </client-only>

        <!-- Share Band Button (styled to match Follow/Save) -->
        <ShareBandStrip
          v-if="band?.data?.id"
          :band-id="band.data.id"
          :band-slug="currentBandSlug"
          :band-name="band.data.name || 'This Artist'"
          :band-image-url="band.data.bandImg?.url || null"
          :is-band-name-in-logo="band.data.isBandNameInLogo || false"
          placement="FOOTER"
          full-width
        />
      </div>

      <!-- Fan Moment Section (shows only when moment is earned) -->
      <client-only>
        <FanMomentSection
          v-if="band?.data?.id"
          ref="fanMomentRef"
          :band-id="band.data.id"
          :band-slug="currentBandSlug"
          :band-name="band.data.name || 'This Artist'"
          :band-image-url="band.data.bandImg?.url || null"
          :is-band-name-in-logo="band.data.isBandNameInLogo || false"
          :pulse-data="pulseData"
        />
      </client-only>

      <footer class="h-40 flex justify-center items-center">
        <img src="@/assets/musicbizlogo.png" alt="MusicBiz Logo" class="h-12" />
      </footer>
    </div>

    <!-- Follow Band Modal -->
    <client-only>
      <FollowBandModal
        :is-open="followModalOpen"
        :band-name="band?.data?.name || ''"
        :band-id="band?.data?.id"
        :band-slug="currentBandSlug"
        :platforms="followablePlatforms"
        @close="followModalOpen = false"
        @confirm="handleFollowConfirm"
        @track="handleFollowTrack"
      />
    </client-only>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from "vue";
import { useRuntimeConfig } from "#imports";
import { useBeacon } from "@/composables/useBeacon";
import { useSavedBands } from "@/composables/useSavedBands";
import { useRoute, useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import AudioPlayer from "@/components/AudioPlayer.vue";
import FollowBandModal from "@/components/band/FollowBandModal.vue";
import FanMomentSection from "@/components/FanMomentSection.vue";
import ShareBandStrip from "@/components/ShareBandStrip.vue";
import {
  normalizeLayoutConfig,
  isSectionEnabled,
} from "@/utils/bandLayout";

import facebookIcon from "@/assets/facebookfree.png";
import instagramIcon from "@/assets/instagramfree.png";
import twitchIcon from "@/assets/twitchfree.png";
import appleMusicIcon from "@/assets/apple.svg";
import soundcloudIcon from "@/assets/soundcloudlast.png";
import deezerIcon from "@/assets/dezzer.svg";
import youtubeIcon from "@/assets/youtube-icon.svg";
import bandcampIcon from "@/assets/bandcamp.svg";
import reverbnationIcon from "@/assets/reverbnation.png";
import spotifyIcon from "@/assets/spotify.svg";
import youtubeMusicIcon from "@/assets/youtube-icon.svg";
import tiktokIcon from "@/assets/tiktok.png";
import twitterIcon from "@/assets/twitter.png";

const hasTrackedEmbedClick = ref(false);
const embedPlayerWrapperEl = ref(null);
const embedIframeEl = ref(null);
const showEmbedTapAgainHint = ref(false);
const embedShake = ref(false);
let embedTapAgainTimeout = null;
let embedShakeTimeout = null;
let onEmbedWrapperPointerDown = null;
let onEmbedWrapperMouseDown = null;
let onEmbedWrapperTouchStart = null;
let onEmbedWrapperPointerEnter = null;
let onEmbedIframeFocus = null;
let onEmbedIframePointerDown = null;
let onEmbedIframeTouchStart = null;
let onEmbedIframeMouseEnter = null;
let onEmbedIframeMouseLeave = null;
let onWindowBlur = null;
let onDocumentVisibilityChange = null;
let embedActivePollInterval = null;
let embedActivePollTimeout = null;
let embedHovering = false;
let lastEmbedHoverAt = 0;
const nuxtApp = useNuxtApp();

const { trackClick, trackMediaPlay } = useBeacon();
const { isSaved, toggleSaveBand } = useSavedBands();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const showSavedConfirmation = ref(false);
let savedConfirmationTimeout = null;

const paymentBannerVisible = ref(false);
const paymentBannerTitle = ref("");
const paymentBannerDetail = ref("");

const paymentError = ref("");
const paymentLoadingKey = ref(null);
const paymentAmountByKey = ref({});

const merchError = ref("");
const merchCheckoutLoadingIndex = ref(null);
const selectedMerchSizeByIndex = ref({});

function selectMerchSize(index, size) {
  const next = { ...(selectedMerchSizeByIndex.value || {}) };
  next[index] = size;
  selectedMerchSizeByIndex.value = next;
}

const merchConfig = computed(() => {
  const mc = band.value?.data?.merchConcierge;
  if (!mc || typeof mc !== "object") return null;
  return mc;
});

const merchPickupLine = computed(() => {
  const v = merchConfig.value?.pickupInstructions;
  return v ? String(v) : "";
});

const merchItems = computed(() => {
  const items = Array.isArray(merchConfig.value?.merchItems)
    ? merchConfig.value.merchItems
    : [];

  return items
    .slice(0, 3)
    .map((raw) => {
      const sizesEnabled = raw?.sizesEnabled === true;
      const sizeStock = raw?.sizeStock && typeof raw.sizeStock === "object" ? raw.sizeStock : {};
      const availableSizes = sizesEnabled
        ? Object.keys(sizeStock)
            .filter((k) => Number(sizeStock?.[k] || 0) > 0)
            .map(String)
        : [];

      return {
        title: String(raw?.title || ""),
        description: String(raw?.description || ""),
        imageUrl: raw?.imageUrl ? String(raw.imageUrl) : null,
        priceCents: Number(raw?.priceCents || 0),
        sizesEnabled,
        availableQty: Number(raw?.availableQty || 0),
        sizeStock,
        availableSizes,
      };
    })
    .filter((x) => !!x.title && Number(x.priceCents || 0) > 0);
});

const canShowMerchConcierge = computed(() => {
  const mc = merchConfig.value;
  if (!mc) return false;
  if (mc.enabled !== true) return false;
  if (mc.staffReadyConfirmed !== true) return false;
  if (!merchPickupLine.value.trim()) return false;

  // Require Stripe connect to be ready (same as payments)
  const enabled = band.value?.data?.paymentsEnabled;
  const onboarded = band.value?.data?.stripeOnboardingComplete;
  if (enabled === false || onboarded === false) return false;

  return merchItems.value.length > 0;
});

const enabledPaymentButtons = computed(() => {
  const btns = band.value?.data?.paymentButtons;
  if (!Array.isArray(btns)) return [];
  return btns.filter((b) => b && b.enabled === true);
});

const canShowPayments = computed(() => {
  // Payments are only meaningful if the band has connect enabled.
  // If these fields are absent from the public response, we still show the buttons.
  const enabled = band.value?.data?.paymentsEnabled;
  const onboarded = band.value?.data?.stripeOnboardingComplete;
  if (enabled === false || onboarded === false) return false;
  return enabledPaymentButtons.value.length > 0;
});

function initPaymentDefaults() {
  const next = { ...(paymentAmountByKey.value || {}) };
  for (const btn of enabledPaymentButtons.value) {
    if (next[btn.key] != null) continue;
    if (btn.pricingMode === "min") {
      next[btn.key] = Number(btn.minAmount || 5);
    } else if (btn.pricingMode === "presets") {
      const first = Array.isArray(btn.presetAmounts) ? btn.presetAmounts[0] : null;
      next[btn.key] = first != null ? Number(first) : 5;
    } else if (btn.pricingMode === "fixed") {
      next[btn.key] = Number(btn.fixedAmount || 0);
    }
  }
  paymentAmountByKey.value = next;
}

function formatUsd(cents) {
  const n = Number(cents || 0);
  return `$${(n / 100).toFixed(2)}`;
}

function isMerchSoldOut(index) {
  const item = merchItems.value?.[index];
  if (!item) return true;
  if (item.sizesEnabled) {
    return item.availableSizes.length === 0;
  }
  return Number(item.availableQty || 0) <= 0;
}

function canBuyMerchItem(index) {
  const item = merchItems.value?.[index];
  if (!item) return false;
  if (isMerchSoldOut(index)) return false;

  if (item.sizesEnabled) {
    const sz = selectedMerchSizeByIndex.value?.[index] || null;
    if (!sz) return false;
    return Number(item.sizeStock?.[sz] || 0) > 0;
  }

  return Number(item.availableQty || 0) > 0;
}

async function startMerchCheckout(index) {
  merchError.value = "";
  merchCheckoutLoadingIndex.value = index;

  try {
    const item = merchItems.value?.[index];
    if (!item) throw new Error("Item not found");

    const bandSlug = currentBandSlug.value;
    if (!bandSlug) throw new Error("Band not loaded");

    const body = {
      bandSlug,
      itemSlotIndex: index + 1,
      selectedSize: item.sizesEnabled
        ? (selectedMerchSizeByIndex.value?.[index] || null)
        : null,
    };

    const res = await $fetch("/api/merch-concierge/create-checkout", {
      method: "POST",
      body,
    });

    const url = res?.checkoutUrl;
    if (!url) throw new Error("Checkout URL missing");

    window.location.href = url;
  } catch (e) {
    merchError.value = e?.data?.message || e?.message || String(e);
  } finally {
    merchCheckoutLoadingIndex.value = null;
  }
}

async function startCheckout(btn) {
  paymentError.value = "";
  paymentLoadingKey.value = btn.key;

  try {
    const api = config.public.strapiUrl;
    const bandId = band.value?.data?.id;
    if (!bandId) throw new Error("Band not loaded yet");

    const body = { buttonKey: btn.key };

    if (btn.pricingMode === "min") {
      const a = Number(paymentAmountByKey.value?.[btn.key]);
      if (!a || a <= 0) throw new Error("Enter an amount");
      if (btn.minAmount && a < Number(btn.minAmount)) {
        throw new Error(`Minimum is $${btn.minAmount}`);
      }
      body.amount = a;
    }

    if (btn.pricingMode === "presets") {
      const a = Number(paymentAmountByKey.value?.[btn.key]);
      if (!a || a <= 0) throw new Error("Select an amount");
      body.amount = a;
    }

    const res = await fetch(`${api}/api/bands/${bandId}/payments/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    const url = json?.url || json?.data?.url;
    if (!res.ok) {
      const msg = json?.error?.message || "Unable to start checkout";
      throw new Error(msg);
    }

    if (!url) throw new Error("Checkout URL missing");

    window.location.href = url;
  } catch (e) {
    paymentError.value = e?.message || String(e);
  } finally {
    paymentLoadingKey.value = null;
  }
}

async function handlePaymentQuery() {
  const paid = String(route.query?.paid || "");
  const canceled = String(route.query?.canceled || "");
  const sm = route.query?.sm ? String(route.query.sm) : null;

  if (paid === "1") {
    paymentBannerVisible.value = true;
    paymentBannerTitle.value = "Payment successful";
    paymentBannerDetail.value = sm ? `Support moment #${sm}` : "";
    
    // Trigger fan moment for payment
    triggerFanMomentForPayment();

    if (sm) {
      try {
        const api = config.public.strapiUrl;
        const url =
          `${api}/api/support-moments/${encodeURIComponent(sm)}/summary`;

        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const attrs = data?.data || null;
          const amount = attrs?.amount;
          const currency = (attrs?.currency || "usd").toUpperCase();
          const label = attrs?.supportLabel;

          if (amount != null && label) {
            paymentBannerDetail.value = `${label} — ${currency} ${amount}`;
          } else if (amount != null) {
            paymentBannerDetail.value = `${currency} ${amount}`;
          }
        }
      } catch (e) {
        // ignore
      }
    }
  } else if (canceled === "1") {
    paymentBannerVisible.value = true;
    paymentBannerTitle.value = "Payment canceled";
    paymentBannerDetail.value = "You can try again anytime.";
  }
}

function dismissPaymentBanner() {
  paymentBannerVisible.value = false;
  const nextQuery = { ...(route.query || {}) };
  delete nextQuery.paid;
  delete nextQuery.canceled;
  delete nextQuery.sm;
  router.replace({ query: nextQuery });
}

// replace: const loading = ref(true);
const loadingData = ref(true);
const heroReady = ref(false);
const notFound = ref(false);

const showPage = computed(() => {
  const url = band.value?.data?.bandImg?.url;
  // show when data is fetched AND either no hero or hero preloaded
  return !loadingData.value && (!url || heroReady.value);
});
const band = ref(null);
const events = ref([]);

const layoutConfig = computed(() => {
  return normalizeLayoutConfig(band.value?.data?.layoutConfig);
});

const isSectionVisible = (sectionId) => {
  return isSectionEnabled(layoutConfig.value, sectionId);
};

const currentBandSlug = computed(() => {
  return (
    band.value?.data?.slug ||
    String(route.params.bandSlug || "").toLowerCase() ||
    ""
  );
});

const isCurrentBandSaved = computed(() => {
  const slug = currentBandSlug.value;
  if (!slug) return false;
  return isSaved(slug);
});

function onToggleSaveBand() {
  const slug = currentBandSlug.value;
  if (!slug) return;

  const payload = {
    bandSlug: slug,
    bandName: band.value?.data?.name || slug,
    bandImageUrl: band.value?.data?.bandImg?.url || null,
  };

  const didSave = toggleSaveBand(payload);
  if (didSave) {
    showSavedConfirmation.value = true;
    if (savedConfirmationTimeout) clearTimeout(savedConfirmationTimeout);
    savedConfirmationTimeout = setTimeout(() => {
      showSavedConfirmation.value = false;
      savedConfirmationTimeout = null;
    }, 2500);
  } else {
    showSavedConfirmation.value = false;
    if (savedConfirmationTimeout) {
      clearTimeout(savedConfirmationTimeout);
      savedConfirmationTimeout = null;
    }
  }
}

// ⬇️ add this small helper near the top of <script setup>
function readQrStampFromCookie() {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith('mbq_qr_src='))
  if (!raw) return null
  try {
    const json = decodeURIComponent(raw.split('=')[1] || '')
    return JSON.parse(json)
  } catch {
    return null
  }
}

function clearQrStampCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `mbq_qr_src=; path=/; max-age=0; sameSite=lax`
}


function preloadHero(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(true); // nothing to wait on
    const img = new Image();
    // ask browser to prioritize this
    img.loading = "eager";
    img.decoding = "sync";
    // if you serve from a different origin and need it later on canvas, uncomment:
    // img.crossOrigin = 'anonymous'
    const done = () => resolve(true);
    img.onload = done;
    img.onerror = done; // don’t hang the UI if it fails
    img.src = src;
    if (img.complete) return resolve(true); // cached path
    // final guard so we never spin forever (network weirdness)
    setTimeout(done, 3000);
  });
}

const isVideoPlaying = ref(false);

/* ---------- helpers ---------- */
function extractYouTubeId(url) {
  const m = url?.match(/[?&]v=([^&]+)/) || url?.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : "";
}

function sanitizeEmbed(html) {
  if (!html) return "";
  // must contain an iframe; strip scripts
  if (!/<iframe[\s\S]*<\/iframe>/i.test(html)) return "";
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

/* ---------- embed & featured song ---------- */
const rawEmbedHtml = computed(
  () => band.value?.data?.singlesong?.embedHtml || ""
);
const safeEmbedHtml = computed(() => sanitizeEmbed(rawEmbedHtml.value));

const hasFeaturedSong = computed(() => {
  const s = band.value?.data?.singlesong;
  if (!s) return false;

  if (s.isEmbed) {
    // Only render if we truly have a valid iframe after sanitization
    return !!safeEmbedHtml.value;
  }

  // Raw audio mode: require a real file URL
  const nestedUrl = s?.song?.data?.attributes?.url;
  const directUrl = s?.song?.url;
  return !!(nestedUrl || directUrl);
});

function handleFirstClick() {
  // Track the first interaction with the embed without blocking it
  if (!hasTrackedEmbedClick.value) {
    try {
      const bandId = band.value?.data?.id;
      const title = band.value?.data?.singlesong?.title || "song";
      trackMediaPlay(bandId, "song", title);
    } catch (e) {
      console.error("trackMediaPlay (embed) error:", e);
    } finally {
      hasTrackedEmbedClick.value = true;
      // Once we have recorded the first engagement, remove listeners to keep it lightweight.
      detachEmbedIframeListeners();
    }
  }
}

function onEmbedOverlayTap() {
  if (hasTrackedEmbedClick.value) return;

  embedShake.value = true;
  if (embedShakeTimeout) clearTimeout(embedShakeTimeout);
  embedShakeTimeout = setTimeout(() => {
    embedShake.value = false;
    embedShakeTimeout = null;
  }, 400);

  handleFirstClick();

  showEmbedTapAgainHint.value = true;
  if (embedTapAgainTimeout) clearTimeout(embedTapAgainTimeout);
  embedTapAgainTimeout = setTimeout(() => {
    showEmbedTapAgainHint.value = false;
    embedTapAgainTimeout = null;
  }, 2000);
}

function detachEmbedIframeListeners() {
  if (embedPlayerWrapperEl.value && onEmbedWrapperPointerDown) {
    embedPlayerWrapperEl.value.removeEventListener(
      "pointerdown",
      onEmbedWrapperPointerDown,
      true
    );
  }
  if (embedPlayerWrapperEl.value && onEmbedWrapperMouseDown) {
    embedPlayerWrapperEl.value.removeEventListener(
      "mousedown",
      onEmbedWrapperMouseDown,
      true
    );
  }
  if (embedPlayerWrapperEl.value && onEmbedWrapperTouchStart) {
    embedPlayerWrapperEl.value.removeEventListener(
      "touchstart",
      onEmbedWrapperTouchStart,
      true
    );
  }
  if (embedPlayerWrapperEl.value && onEmbedWrapperPointerEnter) {
    embedPlayerWrapperEl.value.removeEventListener(
      "pointerenter",
      onEmbedWrapperPointerEnter,
      true
    );
  }

  if (embedIframeEl.value && onEmbedIframeFocus) {
    embedIframeEl.value.removeEventListener("focus", onEmbedIframeFocus, true);
  }
  if (embedIframeEl.value && onEmbedIframePointerDown) {
    embedIframeEl.value.removeEventListener(
      "pointerdown",
      onEmbedIframePointerDown,
      true
    );
  }
  if (embedIframeEl.value && onEmbedIframeTouchStart) {
    embedIframeEl.value.removeEventListener(
      "touchstart",
      onEmbedIframeTouchStart,
      true
    );
  }
  if (embedIframeEl.value && onEmbedIframeMouseEnter) {
    embedIframeEl.value.removeEventListener(
      "mouseenter",
      onEmbedIframeMouseEnter,
      true
    );
  }
  if (embedIframeEl.value && onEmbedIframeMouseLeave) {
    embedIframeEl.value.removeEventListener(
      "mouseleave",
      onEmbedIframeMouseLeave,
      true
    );
  }

  if (typeof window !== "undefined" && onWindowBlur) {
    window.removeEventListener("blur", onWindowBlur, true);
  }

  if (typeof document !== "undefined" && onDocumentVisibilityChange) {
    document.removeEventListener(
      "visibilitychange",
      onDocumentVisibilityChange,
      true
    );
  }

  if (embedActivePollInterval) {
    clearInterval(embedActivePollInterval);
    embedActivePollInterval = null;
  }
  if (embedActivePollTimeout) {
    clearTimeout(embedActivePollTimeout);
    embedActivePollTimeout = null;
  }
  embedIframeEl.value = null;
  onEmbedWrapperPointerDown = null;
  onEmbedWrapperMouseDown = null;
  onEmbedWrapperTouchStart = null;
  onEmbedWrapperPointerEnter = null;
  onEmbedIframeFocus = null;
  onEmbedIframePointerDown = null;
  onEmbedIframeTouchStart = null;
  onEmbedIframeMouseEnter = null;
  onEmbedIframeMouseLeave = null;
  onWindowBlur = null;
  onDocumentVisibilityChange = null;
  embedHovering = false;
  lastEmbedHoverAt = 0;
}

async function attachEmbedIframeListeners() {
  if (typeof window === "undefined") return;

  await nextTick();

  const wrapper = embedPlayerWrapperEl.value;
  if (!wrapper) return;

  const iframe = wrapper.querySelector("iframe");
  if (!iframe) return;

  // Always detach first to avoid stale handlers if Nuxt re-renders.
  detachEmbedIframeListeners();

  // Wrapper-level listeners (more reliable across cross-origin iframe providers)
  onEmbedWrapperPointerDown = () => handleFirstClick();
  onEmbedWrapperMouseDown = () => handleFirstClick();
  onEmbedWrapperTouchStart = () => handleFirstClick();
  onEmbedWrapperPointerEnter = () => {
    embedHovering = true;
    lastEmbedHoverAt = Date.now();
  };

  wrapper.addEventListener("pointerdown", onEmbedWrapperPointerDown, true);
  wrapper.addEventListener("mousedown", onEmbedWrapperMouseDown, true);
  wrapper.addEventListener("touchstart", onEmbedWrapperTouchStart, true);
  wrapper.addEventListener("pointerenter", onEmbedWrapperPointerEnter, true);

  embedIframeEl.value = iframe;
  // Some providers/UA combos won't focus the iframe unless it is explicitly focusable.
  try {
    iframe.setAttribute("tabindex", "0");
  } catch {
    // ignore
  }

  onEmbedIframeFocus = () => handleFirstClick();
  onEmbedIframePointerDown = () => handleFirstClick();
  onEmbedIframeTouchStart = () => handleFirstClick();
  onEmbedIframeMouseEnter = () => {
    embedHovering = true;
    lastEmbedHoverAt = Date.now();
  };
  onEmbedIframeMouseLeave = () => {
    embedHovering = false;
  };

  // Hacky-but-good-UX: when a user clicks into a cross-origin iframe,
  // some browsers won't fire parent click/pointer events, but they often:
  // - focus the iframe element, or
  // - cause the top window to blur while the mouse is hovering over the iframe.
  onWindowBlur = () => {
    if (hasTrackedEmbedClick.value) return;
    if (!embedHovering) return;
    if (Date.now() - lastEmbedHoverAt > 2000) return;
    handleFirstClick();
  };

  // On some mobile browsers, a tap into an iframe can sometimes trigger visibility transitions.
  // This is a weak signal, so we only treat it as engagement if the iframe is currently focused.
  onDocumentVisibilityChange = () => {
    if (hasTrackedEmbedClick.value) return;
    if (document.visibilityState !== "hidden") return;
    if (document.activeElement === iframe) {
      handleFirstClick();
    }
  };

  // When the user clicks/taps inside the embed, the iframe element becomes focused.
  iframe.addEventListener("focus", onEmbedIframeFocus, true);
  iframe.addEventListener("pointerdown", onEmbedIframePointerDown, true);
  iframe.addEventListener("touchstart", onEmbedIframeTouchStart, true);
  iframe.addEventListener("mouseenter", onEmbedIframeMouseEnter, true);
  iframe.addEventListener("mouseleave", onEmbedIframeMouseLeave, true);
  window.addEventListener("blur", onWindowBlur, true);
  document.addEventListener("visibilitychange", onDocumentVisibilityChange, true);

  // Poll fallback: if the provider focuses the iframe without firing focus listeners reliably,
  // we still detect it (lightweight, short lived).
  embedActivePollInterval = setInterval(() => {
    if (hasTrackedEmbedClick.value) return;
    if (!embedIframeEl.value) return;
    if (document.activeElement === embedIframeEl.value) {
      handleFirstClick();
    }
  }, 500);

  // Don't poll forever; if the user never interacts, stop after a short window.
  embedActivePollTimeout = setTimeout(() => {
    if (embedActivePollInterval) {
      clearInterval(embedActivePollInterval);
      embedActivePollInterval = null;
    }
    if (embedActivePollTimeout) {
      clearTimeout(embedActivePollTimeout);
      embedActivePollTimeout = null;
    }
  }, 120000);
}

watch(
  () => safeEmbedHtml.value,
  async () => {
    await attachEmbedIframeListeners();
  }
);

onMounted(async () => {
  await attachEmbedIframeListeners();
});

onBeforeUnmount(() => {
  detachEmbedIframeListeners();
  if (savedConfirmationTimeout) {
    clearTimeout(savedConfirmationTimeout);
    savedConfirmationTimeout = null;
  }

  if (embedTapAgainTimeout) {
    clearTimeout(embedTapAgainTimeout);
    embedTapAgainTimeout = null;
  }
  if (embedShakeTimeout) {
    clearTimeout(embedShakeTimeout);
    embedShakeTimeout = null;
  }
});

/* ---------- streaming & social sections ---------- */
const hiddenLinkKeys = computed(() => {
  const v = band.value?.data?.hiddenLinks;
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (v && typeof v === 'object') return Object.keys(v).filter((k) => v[k]);
  return [];
});

function isLinkHidden(key) {
  return hiddenLinkKeys.value.includes(key);
}

const hasStreamingLinks = computed(() =>
  streamingPlatforms.some((p) => !!band.value?.data?.[p.name] && !isLinkHidden(p.name))
);
const hasSocialLinks = computed(() =>
  socialPlatforms.some((p) => !!band.value?.data?.[p.name] && !isLinkHidden(p.name))
);

/* ---------- video ---------- */
const singleVideoThumbnail = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
});
const singleVideoEmbedUrl = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://www.youtube.com/embed/${id}` : "";
});

/* ---------- formatting ---------- */
function formatDate(dateStr) {
  // Always English (US)
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSingleSong(single) {
  if (!single) return null;
  const nestedUrl = single?.song?.data?.attributes?.url;
  const directUrl = single?.song?.url;
  const fileUrl = nestedUrl || directUrl || null;

  return {
    id: single?.id,
    attributes: {
      title: single?.title || "Untitled",
      song: { data: { attributes: { url: fileUrl } } },
      duration: single?.duration || 0,
      cover: single?.cover || null,
      artist: band.value?.data?.name || "Artist",
    },
  };
}

/* ---------- tracking ---------- */
async function onSongPlay() {
  if (!band.value?.data?.singlesong) return;
  const bandId = band.value.data.id;
  const title = band.value.data.singlesong.title || "song";
  try {
    await trackMediaPlay(bandId, "song", title);
  } catch (err) {
    console.error("❌ trackMediaPlay error:", err);
  }
}

async function playVideo() {
  isVideoPlaying.value = true;
  const bandId = band.value?.data?.id;
  const title =
    band.value?.data?.singlevideo?.title ||
    band.value?.data?.singlesong?.title ||
    "video";
  try {
    await trackMediaPlay(bandId, "video", title);
  } catch (err) {
    console.error("❌ video track error:", err);
  }
}

function handleClick(bandId, platform, url) {
  // Trigger fan moment for link click
  triggerFanMomentForLinkClick();
  trackClick(bandId, platform, url);
}

/* ---------- data fetch ---------- */
async function fetchBandData() {
  notFound.value = false;
  loadingData.value = true;

  const incomingSlug = String(route.params.bandSlug || "").toLowerCase();
  const canonicalSlug = incomingSlug
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "");
  const slug = incomingSlug;
  const api = config.public.strapiUrl;

  // Ask ONLY for fields used on the page
  const buildUrl = (s) =>
    `${api}/api/bands/slug/${encodeURIComponent(s)}` +
    `?fields[0]=slug&fields[1]=name&fields[2]=isBandNameInLogo&fields[3]=bio&fields[4]=biotagline` +
    `&fields[5]=websitelink&fields[6]=websitelinktext` +
    `&fields[7]=youtube&fields[8]=youtubeMusic&fields[9]=spotify&fields[10]=appleMusic` + // streaming
    `&fields[11]=reverbnation&fields[12]=soundcloud&fields[13]=bandcamp&fields[14]=twitch&fields[15]=deezer` +
    `&fields[16]=facebook&fields[17]=instagram&fields[18]=twitter&fields[19]=tiktok` + // social
    `&fields[20]=paymentsEnabled&fields[21]=stripeOnboardingComplete&fields[22]=paymentButtons&fields[23]=hiddenLinks&fields[24]=merchConcierge` +
    `&populate[bandImg][fields][0]=url` +
    `&populate[singlevideo][fields][0]=youtubeid&populate[singlevideo][fields][1]=title` +
    `&populate[singlesong][fields][0]=title&populate[singlesong][fields][1]=isEmbed&populate[singlesong][fields][2]=embedHtml` +
    `&populate[singlesong][populate][song][fields][0]=url&populate[singlesong][populate][cover][fields][0]=url` +
    `&populate[events][fields][0]=date&populate[events][fields][1]=slug&populate[events][fields][2]=city&populate[events][fields][3]=state&populate[events][fields][4]=venue`;

  try {
    let res = await fetch(buildUrl(slug), { cache: "no-store" });

    // If someone hits an old hyphenated URL, retry with canonical no-hyphen slug.
    if (res.status === 404 && canonicalSlug && canonicalSlug !== slug) {
      res = await fetch(buildUrl(canonicalSlug), { cache: "no-store" });
      if (res.ok) {
        // Redirect to canonical, no-hyphen URL.
        router.replace({ path: `/${canonicalSlug}`, query: route.query });
      }
    }

    if (res.status === 404) {
      band.value = null;
      notFound.value = true;
      heroReady.value = true;
      return;
    }

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    band.value = data;

    // Peek at shape so we know how to unwrap
console.log('[BAND PAYLOAD]', band.value);


// Support BOTH shapes (flattened via custom slug route, or Strapi default)
let evts = [];
const maybeFlat = band.value?.data?.events;                // e.g. [{ id, date, city, ... }]
const maybeStrapi = band.value?.data?.events?.data;        // e.g. [{ id, attributes: {...}}]

if (Array.isArray(maybeFlat)) {
  evts = maybeFlat.filter(Boolean);
} else if (Array.isArray(maybeStrapi)) {
  evts = maybeStrapi
    .filter(Boolean)
    .map(({ id, attributes }) => ({ id, ...(attributes || {}) }));
} else {
  evts = [];
}

// Normalize minimal fields the template expects
events.value = evts.map(e => ({
  id: e.id,
  date: e.date || e.eventDate || e.startDate || null,
  city: e.city ?? null,
  state: e.state ?? null,
  venue: e.venue ?? null,
  slug: e.slug ?? null,
})).filter(e => !!e.date);

    initPaymentDefaults();


    // build the exact URL you’ll render for the hero
    const raw = band.value?.data?.bandImg?.url || null;

    // If you want to be 100% identical to <NuxtImg>, generate the same URL:
    // const img = useImage()            // import { useImage } from '#imports'
    // const heroUrl = raw ? img(raw, { format:'webp', modifiers:{ fit:'cover', quality:60 } }) : null
    // await preloadHero(heroUrl)

    await preloadHero(raw); // (works fine — the transformed NuxtImg URL will use the cache)

    heroReady.value = true;
    // ✅ Fire exactly once when the page is actually ready
    await sendPageView();
  } catch (e) {
    console.error("Fetch band error:", e);
    heroReady.value = true; // don’t hang the page on errors
    band.value = null;
    notFound.value = true;
  } finally {
    console.log(events.value, band.value , 'bandpayload')
    loadingData.value = false;
  }
}

/* ---------- events ---------- */
const today = new Date();

const upcomingEvents = computed(() =>
  events.value
    .filter((e) => new Date(e.date + "T00:00:00") >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
);

const pastEvents = computed(() =>
  events.value
    .filter((e) => new Date(e.date + "T00:00:00") < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
);

const nextUpcomingEvent = computed(() => upcomingEvents.value[0] || null);

const otherUpcomingEvents = computed(() =>
  upcomingEvents.value.length > 1 ? upcomingEvents.value.slice(1) : []
);

// Pagination for Other Upcoming Events
const upcomingEventsPage = ref(1);
const eventsPerPage = 3;
const totalUpcomingPages = computed(() => Math.ceil(otherUpcomingEvents.value.length / eventsPerPage));
const paginatedUpcomingEvents = computed(() => {
  const start = (upcomingEventsPage.value - 1) * eventsPerPage;
  return otherUpcomingEvents.value.slice(start, start + eventsPerPage);
});

// Pagination for Past Events
const pastEventsPage = ref(1);
const totalPastPages = computed(() => Math.ceil(pastEvents.value.length / eventsPerPage));
const paginatedPastEvents = computed(() => {
  const start = (pastEventsPage.value - 1) * eventsPerPage;
  return pastEvents.value.slice(start, start + eventsPerPage);
});

const streamingPlatforms = [
  { name: "youtube", img: youtubeIcon, label: "YouTube" },
  { name: "youtubeMusic", img: youtubeMusicIcon, label: "YouTube Music" },
  { name: "spotify", img: spotifyIcon, label: "Spotify" },
  { name: "appleMusic", img: appleMusicIcon, label: "Apple Music" },
  { name: "reverbnation", img: reverbnationIcon, label: "Reverbnation" },
  { name: "soundcloud", img: soundcloudIcon, label: "SoundCloud" },
  { name: "bandcamp", img: bandcampIcon, label: "Bandcamp" },
  { name: "twitch", img: twitchIcon, label: "Twitch" },
  { name: "deezer", img: deezerIcon, label: "Deezer" },
];

const socialPlatforms = [
  { name: "facebook", img: facebookIcon, label: "Facebook" },
  { name: "instagram", img: instagramIcon, label: "Instagram" },
  { name: "twitter", img: twitterIcon, label: "Twitter" },
  { name: "tiktok", img: tiktokIcon, label: "Tiktok" },
];

const streamingPlatformsMap = Object.fromEntries(
  streamingPlatforms.map((p) => [p.name, p])
);

const socialPlatformsMap = Object.fromEntries(
  socialPlatforms.map((p) => [p.name, p])
);

const orderedStreamingPlatforms = computed(() => {
  const order = layoutConfig.value.buttons.streaming;
  return order
    .map((id) => streamingPlatformsMap[id])
    .filter(Boolean);
});

const orderedSocialPlatforms = computed(() => {
  const order = layoutConfig.value.buttons.social;
  return order
    .map((id) => socialPlatformsMap[id])
    .filter(Boolean);
});

/* ---------- Fan Moment ---------- */
const fanMomentRef = ref(null);
const pulseData = ref(null);

// Trigger fan moment for link clicks
function triggerFanMomentForLinkClick() {
  if (fanMomentRef.value?.earnMoment) {
    fanMomentRef.value.earnMoment('link_click', {
      landingPath: window.location.pathname,
    });
  }
}

// Trigger fan moment for follow
function triggerFanMomentForFollow() {
  if (fanMomentRef.value?.earnMoment) {
    fanMomentRef.value.earnMoment('follow', {
      landingPath: window.location.pathname,
    });
  }
}

// Trigger fan moment for payment
function triggerFanMomentForPayment() {
  if (fanMomentRef.value?.earnMoment) {
    fanMomentRef.value.earnMoment('payment', {
      landingPath: window.location.pathname,
    });
  }
}

/* ---------- Follow the Band ---------- */
const followModalOpen = ref(false);

const followablePlatforms = computed(() => {
  const platforms = [];
  const data = band.value?.data;
  if (!data) return platforms;

  // Streaming platforms
  for (const p of streamingPlatforms) {
    const url = data[p.name];
    if (url && !isLinkHidden(p.name)) {
      platforms.push({
        id: p.name,
        name: p.label,
        url,
        category: 'streaming',
        icon: p.img,
      });
    }
  }

  // Social platforms
  for (const p of socialPlatforms) {
    const url = data[p.name];
    if (url && !isLinkHidden(p.name)) {
      platforms.push({
        id: p.name,
        name: p.label,
        url,
        category: 'social',
        icon: p.img,
      });
    }
  }

  return platforms;
});

function openFollowModal() {
  followModalOpen.value = true;
}

function handleFollowConfirm(platformIds) {
  followModalOpen.value = false;

  if (!platformIds || platformIds.length === 0) return;

  const selectedPlatforms = followablePlatforms.value.filter((p) =>
    platformIds.includes(p.id)
  );

  if (selectedPlatforms.length === 0) return;

  // Trigger fan moment for follow action
  triggerFanMomentForFollow();

  // Track redirect events before navigating
  for (const p of selectedPlatforms) {
    trackFollowRedirect(p.id, p.url);
  }

  // Safe redirect behavior to avoid popup blockers:
  // - Open first in current tab (always works)
  // - Open rest in new tabs (user gesture allows this)
  const [first, ...rest] = selectedPlatforms;

  // Open additional tabs first (while we still have user gesture context)
  for (const p of rest) {
    try {
      window.open(p.url, '_blank', 'noopener,noreferrer');
    } catch {
      // Popup blocked, fail gracefully
    }
  }

  // Navigate current tab to first platform
  if (first?.url) {
    window.location.href = first.url;
  }
}

function handleFollowTrack(trackData) {
  sendFollowTrackEvent(trackData);
}

function trackFollowRedirect(platformId, url) {
  sendFollowTrackEvent({
    event: 'follow_redirect',
    bandId: band.value?.data?.id,
    bandSlug: currentBandSlug.value,
    platformId,
    url,
    timestamp: new Date().toISOString(),
  });
}

function sendFollowTrackEvent(data) {
  const apiUrl = `${config.public.strapiUrl}/api/band-ui-events/track`;
  const payload = {
    bandId: data.bandId,
    bandSlug: data.bandSlug,
    eventName: data.event,
    payload: {
      ...data,
      event: undefined,
      bandId: undefined,
      bandSlug: undefined,
    },
  };

  // Use sendBeacon for reliability during navigation
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(apiUrl, blob);
  } else if (typeof fetch !== 'undefined') {
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }
}

// in the band page <script setup>
// onMounted(() => {
//   try {
//     const body = {
//       bandId: band.value?.data?.id,
//       path: location.pathname,
//       title: document.title
//     }
//     const blob = new Blob([JSON.stringify(body)], { type:'application/json' })
//     navigator.sendBeacon?.('/api/track/band-view', blob)
//     if (!navigator.sendBeacon) {
//       fetch('/api/track/band-view', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
//     }
//   } catch {}
// })
async function sendPageView() {
  // Don’t run on server
  if (typeof window === 'undefined') return;

  const id = band.value?.data?.id;
  if (!id) {
    console.warn("[page-view] no band id yet");
    return;
  }

  const payload = {
    bandId: id,
    path: location.pathname,
    title: document?.title || "",
    url: window.location.href, // ← NEW: full landing URL (UTMs included)
  };

  console.log("[page-view] → POST /api/track/band-view", payload);

  try {
    const res = await fetch("/api/track/band-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Note: the browser will send the Referer header automatically
    });
    const json = await res.json();
    console.log("[page-view] ←", res.status, json);
  } catch (err) {
    console.error("[page-view] ERROR", err);
  }
}


const beaconSent = ref(false);

// watch(() => band.value?.data?.id, async (id) => {
//   if (!id || beaconSent.value) return
//   beaconSent.value = true

//   const payload = { bandId: id, path: location.pathname, title: document.title }
//   const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })

//   try {
//     if (navigator.sendBeacon) {
//       navigator.sendBeacon('/api/track/band-view', blob)
//     } else {
//       await fetch('/api/track/band-view', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })
//     }
//   } catch (err) {
//     console.error('band-view beacon error:', err)
//   }
// })

onMounted(() => {
  fetchBandData();
  handlePaymentQuery();
});

// watch([loadingData, band], ([loadingData, bandVal]) => {
//   if (loadingData) return
//   const id = bandVal?.data?.id
//   if (!id) return
//   try {
//     const payload = {
//       bandId: id,
//       path: location.pathname,
//       title: document.title
//     }
//     const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
//     if (navigator.sendBeacon) {
//       navigator.sendBeacon('/api/track/band-view', blob)
//     } else {
//       fetch('/api/track/band-view', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })
//     }
//   } catch {}
// }, { immediate: true })
</script>

<style scoped>
.embed-shake {
  animation: embedShake 0.4s ease-in-out;
}

@keyframes embedShake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}

.embed-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}

.fade-in {
  animation: fadeIn 0.25s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.embed-container iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.custom-border {
  border: 0.1px solid white;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #6200ee;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-top: 2rem;
}
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* testing */
#embedPlayerWrapper :deep(iframe) {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
