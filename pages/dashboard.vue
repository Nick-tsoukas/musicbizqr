<template>
  <div class="min-h-screen bg-black pt-[var(--header-height)]">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <!-- Header -->
      <div class="mb-8 flex items-start justify-between">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
          <p class="text-white/60 mt-2">Manage your QR codes, artist pages, and events</p>
        </div>
        <NotificationBell />
      </div>

      <!-- Banners -->
      <PastDueBanner
        :status="subscriptionStatus"
        :days-left="daysLeft"
        :has-payment-method="billingInfo?.hasPaymentMethod ?? null"
      />

      <TrialBanner
        v-if="
          !loadingTrial &&
          daysLeft !== null &&
          daysLeft > 0 &&
          billingInfo?.hasPaymentMethod === false
        "
        :days-left="daysLeft"
        :disabled="loadingPortal"
        @add-payment="goToBillingPortal"
      />

      <!-- MBQ Pulse Section -->
      <section v-if="hasBand && !loading" class="dashboard-section mb-8">
        <div class="section-header bg-gradient-to-r from-violet-600 to-purple-600">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">MBQ Pulse</h2>
              <p class="text-white/70 text-sm">Your fan momentum at a glance</p>
            </div>
          </div>
          <!-- Range Selector -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(label, days) in pulseRangeOptions"
              :key="days"
              @click="pulseRange = Number(days)"
              :class="[
                'px-3 py-1 text-xs rounded-full border transition-colors',
                pulseRange === Number(days)
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-transparent text-white/70 border-white/20 hover:bg-white/10',
              ]"
            >
              {{ label }}
            </button>
          </div>
        </div>
        <div class="section-content">
          <MbqPulseCard
            :pulse="pulseData"
            :loading="pulseLoading"
            :range-label="`Last ${pulseRange} days`"
            :show-opt-in="true"
            :band-id="bandItems[0]?.id"
          />
          
          <!-- Shareables Section (unified 10 card types) -->
          <ShareablesSection
            v-if="bandItems[0]?.id"
            :band-id="bandItems[0].id"
            :band-slug="bandItems[0].slug || ''"
            :band-name="bandItems[0].name || 'This Artist'"
            :band-image-url="bandItems[0].bandImg?.url || null"
            :is-band-name-in-logo="bandItems[0].isBandNameInLogo || false"
            class="mt-4"
          />
          
          <!-- System Status Card (commented out - not needed for now)
          <SystemStatusCard
            v-if="bandItems[0]?.id"
            :band-id="bandItems[0].id"
            @refresh="refreshPanels"
          />
          -->
        </div>
      </section>

      <!-- Demo Controls (only for whitelisted users) -->
      <DemoControlsCard />

      <!-- QR Codes Section -->
      <div v-if="loading" class="mb-8">
        <SkeletonLoader />
      </div>

      <section v-else class="dashboard-section mb-8">
        <div class="section-header bg-gradient-to-r from-purple-600 to-violet-600">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">QR Codes</h2>
              <p class="text-white/70 text-sm">{{ qrItems.length }} code{{ qrItems.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <NuxtLink
            v-if="canCreateMoreQrs"
            to="/createqr"
            class="create-button"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create QR</span>
          </NuxtLink>
          <button
            v-else
            class="create-button opacity-50 cursor-not-allowed"
            disabled
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Limit reached</span>
          </button>
        </div>

        <div class="section-content">
          <div v-if="qrItems.length" class="space-y-4">
            <div
              v-for="(qr, idx) in qrItems"
              :key="qr.id"
              class="item-card"
            >
              <!-- Image with skeleton loading -->
              <div class="item-image-wrapper">
                <div class="item-image-skeleton"></div>
                <NuxtImg
                  provider="ipx"
                  format="webp"
                  :src="normalizeImg(qr.imageUrl)"
                  class="item-image"
                  width="80"
                  height="80"
                  :loading="idx === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                  :fetchpriority="idx === 0 ? 'high' : 'auto'"
                  :modifiers="{ fit: 'cover' }"
                  @load="(e) => e.target.classList.add('loaded')"
                />
              </div>

              <div class="item-info">
                <h3 class="item-title">{{ qr.title }}</h3>
                <p class="item-subtitle">QR Code</p>
              </div>

              <div class="item-actions">
                <button @click="openDownloadForQr(qr.id)" class="action-btn-labeled">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </button>

                <button
                  v-if="!qr.isShared"
                  @click="editItem(qr.id, 'editqr')"
                  class="action-btn-labeled"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>

                <button
                  @click="router.push(`/analyticsqr/${qr.id}`)"
                  class="action-btn-labeled text-emerald-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </button>

                <button
                  v-if="!qr.isShared"
                  @click="deleteItem(qr.id, 'qr')"
                  class="action-btn-labeled text-red-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon bg-purple-500/20">
              <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 class="text-white font-semibold mt-4">No QR codes yet</h3>
            <p class="text-white/50 text-sm mt-1">Create your first QR code to get started</p>
          </div>
        </div>
      </section>

      <!-- Bands Section -->
      <div v-if="loading" class="mb-8">
        <SkeletonLoader />
      </div>

      <section v-else class="dashboard-section mb-8">
        <div class="section-header bg-gradient-to-r from-emerald-600 to-teal-600">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Artist Pages</h2>
              <p class="text-white/70 text-sm">{{ bandItems.length }} page{{ bandItems.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <NuxtLink
            v-if="!hasBand || isSpecialUser"
            to="/createband"
            class="create-button"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Artist Page</span>
          </NuxtLink>
          <button
            v-else
            class="create-button opacity-50 cursor-not-allowed"
            disabled
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Limit reached</span>
          </button>
        </div>

        <div class="section-content">
          <div v-if="bandItems.length" class="space-y-4">
            <div
              v-for="(band, idx) in bandItems"
              :key="band.id"
              class="item-card"
            >
              <!-- Image with skeleton loading -->
              <div class="item-image-wrapper">
                <div class="item-image-skeleton"></div>
                <NuxtImg
                  provider="ipx"
                  format="webp"
                  :src="normalizeImg(band.imageUrl)"
                  class="item-image"
                  width="80"
                  height="80"
                  :loading="idx === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                  :fetchpriority="idx === 0 ? 'high' : 'auto'"
                  :modifiers="{ fit: 'cover' }"
                  @load="(e) => e.target.classList.add('loaded')"
                />
              </div>

              <div class="item-info">
                <h3 class="item-title">{{ band.title }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span 
                    class="status-badge"
                    :class="band.paymentsEnabled && band.stripeOnboardingComplete ? 'status-success' : band.stripeAccountId ? 'status-warning' : 'status-neutral'"
                  >
                    <span class="status-dot"></span>
                    {{ band.paymentsEnabled && band.stripeOnboardingComplete ? 'Payouts enabled' : band.stripeAccountId ? 'Setup required' : 'No payouts' }}
                  </span>
                </div>
              </div>

              <div class="item-actions">
                <button
                  @click="router.push(`/${band.slug}`)"
                  class="action-btn-labeled"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View</span>
                </button>

                <button
                  @click="router.push(`/editband/${band.id}`)"
                  class="action-btn-labeled"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>

                <button
                  @click="router.push(`/analytics/${band.id}`)"
                  class="action-btn-labeled text-emerald-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </button>

                <button
                  @click="openShareDrawer(band)"
                  class="action-btn-labeled text-amber-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>

                <button
                  @click="startPayoutOnboarding(band.id)"
                  class="action-btn-labeled text-purple-400"
                  :disabled="payoutLoadingId === band.id"
                >
                  <svg v-if="payoutLoadingId !== band.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Payouts</span>
                </button>

                <button
                  @click="deleteItem(band.id, 'band')"
                  class="action-btn-labeled text-red-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon bg-emerald-500/20">
              <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 class="text-white font-semibold mt-4">No artist pages yet</h3>
            <p class="text-white/50 text-sm mt-1">Create your artist page to showcase your music</p>
          </div>
        </div>
      </section>

      <!-- Events Section -->
      <div v-if="loading" class="mb-8">
        <SkeletonLoader />
      </div>

      <section v-else class="dashboard-section mb-8">
        <div class="section-header bg-gradient-to-r from-blue-600 to-indigo-600">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Events</h2>
              <p class="text-white/70 text-sm">{{ eventItems.length }} event{{ eventItems.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <NuxtLink
            to="/newevent"
            class="create-button"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Event</span>
          </NuxtLink>
        </div>

        <div class="section-content">
          <div v-if="eventItems.length" class="space-y-4">
            <div
              v-for="(ev, idx) in eventItems"
              :key="ev.id"
              class="item-card"
            >
              <!-- Image with skeleton loading -->
              <div class="item-image-wrapper">
                <div class="item-image-skeleton"></div>
                <NuxtImg
                  provider="ipx"
                  format="webp"
                  :src="normalizeImg(ev.imageUrl)"
                  class="item-image"
                  width="80"
                  height="80"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  :modifiers="{ fit: 'cover' }"
                  @load="(e) => e.target.classList.add('loaded')"
                />
              </div>

              <div class="item-info">
                <h3 class="item-title">{{ ev.title }}</h3>
                <p class="item-subtitle">Event</p>
              </div>

              <div class="item-actions">
                <button
                  @click="router.push(`/${ev.bandSlug}/event/${ev.slug}`)"
                  class="action-btn-labeled"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View</span>
                </button>

                <button
                  @click="router.push(`/editevent/${ev.id}`)"
                  class="action-btn-labeled"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>

                <button
                  @click="copyToClipboard(`${config.public.baseUrl}/${ev.bandSlug}/event/${ev.slug}`)"
                  class="action-btn-labeled text-amber-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>

                <button
                  @click="router.push(`/event-analytics/${ev.id}`)"
                  class="action-btn-labeled text-emerald-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </button>

                <button
                  @click="deleteItem(ev.id, 'event')"
                  class="action-btn-labeled text-red-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon bg-blue-500/20">
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-white font-semibold mt-4">No events yet</h3>
            <p class="text-white/50 text-sm mt-1">Create your first event to promote your shows</p>
          </div>
        </div>
      </section>
      <!-- Download modal (client-only component) -->

      <ClientOnly>
        <LazyDownloadQr
          v-model="showDownload"
          :qr-options="activeQrOptions"
          :default-name="activeQrName"
          :key="showDownload ? activeQrName : 'closed'"
        />
      </ClientOnly>

      <!-- Delete Confirmation Modal -->
      <DeleteConfirmModal
        v-model="showDeleteModal"
        :item-id="deleteTarget.id"
        :item-name="deleteTarget.name"
        :item-type="deleteTarget.type"
        :item-image="deleteTarget.image"
        ref="deleteModalRef"
        @confirm="confirmDelete"
      />
      <!-- VIEW QR Popup -->
      <!-- <div
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

          <button
            @click="viewQr"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close popup
          </button>
        </div>
      
      </div> -->
    </div>
    <transition name="fade-slide">
      <div
        v-if="showToast"
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm font-medium px-6 py-3 rounded shadow-lg z-50"
      >
        {{ toastMessage }}
      </div>
    </transition>

    <ShareDrawer
      v-if="activeShareBand"
      :is-open="shareDrawerOpen"
      :band-id="Number(activeShareBand.id)"
      :band-slug="activeShareBand.slug"
      :band-name="activeShareBand.name"
      :band-image-url="activeShareBand.bandImg?.url || activeShareBand.imageUrl || null"
      :is-band-name-in-logo="activeShareBand.isBandNameInLogo || false"
      @close="closeShareDrawer"
    />
  </div>
</template>

<script setup>
import { useNuxtApp } from "#app";
import {
  ref,
  onMounted,
  computed,
  inject,
  watch,
  defineAsyncComponent,
} from "vue";
import { differenceInCalendarDays } from "date-fns";
import { useRuntimeConfig } from "#imports";
import ShareablesSection from '~/components/dashboard/ShareablesSection.vue';
import DemoControlsCard from '~/components/dashboard/DemoControlsCard.vue';
import ShareDrawer from '~/components/band/ShareDrawer.vue';

// rebuild

// special user override
// with this:
const specialEmails = [
  "mjc773@gmail.com",
  "nick.tsoukas101@gmail.com",
  "info@rocksnaps.com",
  "novamusic@aol.com",
  "partner@musicbizqr.com",
];
const isSpecialUser = computed(() => {
  const e = String(user.value?.email || "").toLowerCase().trim();
  return specialEmails.includes(e);
});

const sharedViewEmails = ["info@rocksnaps.com", "novamusic@aol.com"];
const sharedQrIds = computed(() => {
  const e = String(user.value?.email || "").toLowerCase().trim();
  if (!sharedViewEmails.includes(e)) return [];
  return [46];
});

const maxQrAllowed = computed(() => (isSpecialUser.value ? 10 : 1));

const ownedQrCount = computed(() => qrItems.value.filter((q) => !q.isShared).length);

const canCreateMoreQrs = computed(
  () => ownedQrCount.value < maxQrAllowed.value
);

const token = useStrapiToken();
const loadingPortal = ref(false);

const config = useRuntimeConfig();

const user = useStrapiUser();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
import { useStrapi } from "#imports";
const { find, findOne  } = useStrapi();
const strapi = useStrapi();

const { setToken, fetchUser } = useStrapiAuth();

// reactive state
const daysLeft = ref(null);
const loadingTrial = ref(false);
const trialError = ref("");
const billingInfo = ref(null);
const subscriptionStatus = ref(null); // new

const nuxtApp = useNuxtApp();
const historyStack = nuxtApp.$historyStack; // ← grab the real one
const previousRoute = computed(() =>
  historyStack.value.length
    ? historyStack.value[historyStack.value.length - 1]
    : null
);

const loading = ref(true);
const qrs = ref([]);
const scans = ref([]);
const bands = ref([]);
const events = ref([]);

// MBQ Pulse state
const pulseData = ref(null);
const pulseLoading = ref(false);
const pulseRange = ref(30);
const pulseRangeOptions = {
  7: '7 Days',
  30: '30 Days',
  90: '90 Days',
  365: '1 Year',
};

const payoutLoadingId = ref(null);

const hasQr = computed(() => qrItems.value.length > 0);
const hasBand = computed(() => bandItems.value.length > 0);

const showToast = ref(false);
const toastMessage = ref("");
let toastTimeout = null;
const showDownload = ref(false);
const activeQrOptions = ref(null);
const activeQrName = ref("qr-code");

const shareDrawerOpen = ref(false);
const activeShareBand = ref(null);

function openShareDrawer(band) {
  activeShareBand.value = band;
  shareDrawerOpen.value = true;
}

function closeShareDrawer() {
  shareDrawerOpen.value = false;
}

// Delete modal state
const showDeleteModal = ref(false);
const deleteModalRef = ref(null);
const deleteTarget = ref({
  id: null,
  name: '',
  type: '',
  image: '',
});

const normalizeImg = (u) => {
  if (!u) return "";
  // Your bucket is S3; if Strapi gives relative paths, prefix with alias (optional).
  // For fully-qualified S3 URLs, just return as-is.
  if (u.startsWith("http")) return u;
  return `s3:${u}`; // only if you ever store relative keys like /qrcode_abc.png
};

async function openDownloadForQr(rawOrId) {
  try {
    const id = typeof rawOrId === 'object' ? rawOrId.id : rawOrId

    // Show the modal immediately with a lightweight "loading" state
    activeQrOptions.value = null
    activeQrName.value = 'Loading…'
    showDownload.value = true

    // Fetch detailed row with options (cached)
    const full = await fetchQrOptionsById(id)
    const row = full?.data || rawOrId // fallback to existing if something odd

    // Build the QR options for the component
    const built = buildQrOptionsFromStrapi(row)
    activeQrOptions.value = built
    activeQrName.value = row?.attributes?.name || `qr-${id}`
  } catch (e) {
    console.error('[Download] failed to load options', e)
    showDownload.value = false
    alert('Could not load QR options. Please try again.')
  }
}


function buildQrOptionsFromStrapi(raw) {
  const node = raw?.data ? raw.data : raw     // normalize
  const a = node?.attributes || {}
  const saved = a.options || {}               // ✅ you were missing this

  // prefer the exact string you saved in options.data
  let encoded =
    (saved.data && String(saved.data).trim()) ||
    (a.url && String(a.url).trim()) ||
    (a.qrValue && String(a.qrValue).trim()) ||
    (a.link && String(a.link).trim()) ||
    (a.data && String(a.data).trim()) ||
    ''

  const isOriginOnly = (s) => /^https?:\/\/[^/]+\/?$/i.test(s || '')
  const toAbsHttps = (s) => (!s ? '' : /^https?:\/\//i.test(s) ? s : `https://${s}`)
  const base = (useRuntimeConfig().public?.baseUrl || 'https://musicbizqr.com').replace(/\/+$/, '')
  const buildDirect = (id) => `${base}/directqr?id=${id}`

  if (isOriginOnly(encoded)) {
    if (a.url && /\bid=/.test(a.url)) {
      encoded = toAbsHttps(a.url.trim())
    } else if (node?.id) {                   // ✅ use node.id (not raw.id)
      encoded = buildDirect(node.id)
    }
  }

  encoded = toAbsHttps(encoded)

  const logo =
    saved.image ||
    saved.imageOptions?.src ||
    a.logo?.url ||
    null

  const dotColor =
    saved.dotsOptions?.color ||
    a.qrColor ||
    a.colorDark ||
    saved.colorDark ||
    '#000000'

  const cornersSqColor =
    saved.cornersSquareOptions?.color || a.cornersSquareColor || dotColor

  const cornersDotColor =
    saved.cornersDotOptions?.color || a.cornersDotColor || dotColor

  const bg = saved.backgroundOptions?.color || a.backgroundColor || '#FFFFFF'

  const opts = {
    data: encoded || base,
    width: Number(saved.size || saved.width || 300),
    height: Number(saved.size || saved.height || 300),
    backgroundOptions: { color: bg },
    dotsOptions: {
      type: saved.dotsOptions?.type || 'square',
      color: dotColor,
      gradient: saved.dotsOptions?.gradient ?? null,
    },
    cornersSquareOptions: {
      color: cornersSqColor,
      type: saved.cornersSquareOptions?.type || 'square',
    },
    cornersDotOptions: {
      color: cornersDotColor,
      type: saved.cornersDotOptions?.type || 'square',
    },
    imageOptions: {
      src: logo || '',
      imageSize: saved.imageOptions?.imageSize ?? 0.4,
      margin: saved.imageOptions?.margin ?? 0,
      crossOrigin: 'anonymous',
    },
  }

  if (logo) opts.image = logo
  return opts
}


function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toastMessage.value = "✅ Link copied to clipboard!";
      showToast.value = true;

      // Clear any previous timeout
      if (toastTimeout) clearTimeout(toastTimeout);

      // Auto-hide after 3 seconds
      toastTimeout = setTimeout(() => {
        showToast.value = false;
      }, 3000);
    })
    .catch(() => {
      toastMessage.value = "❌ Failed to copy link.";
      showToast.value = true;
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        showToast.value = false;
      }, 3000);
    });
}

async function fetchBillingInfo() {
  try {
    const result = await client("/stripe/billing", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    billingInfo.value = result;
  } catch (err) {
    console.warn("[Dashboard] Failed to fetch billing info:", err);
  }
}

async function fetchTrialInfo() {
  loadingTrial.value = true;
  try {
    const subscription = await client("/stripe/subscription-status", {
      method: "GET",
      headers: { Authorization: `Bearer ${useStrapiToken().value}` },
    });

    subscriptionStatus.value =
      subscription && subscription.status ? subscription.status : null;

    const rawEnds = subscription.trialEndsAt;
    const isTrialing = subscriptionStatus.value === 'trialing';
    if (isTrialing && rawEnds) {
      const endDate =
        typeof rawEnds === "number"
          ? new Date(rawEnds * 1000)
          : new Date(rawEnds);
      const diff = differenceInCalendarDays(endDate, new Date());
      daysLeft.value = diff > 0 ? diff : 0;
    } else {
      daysLeft.value = null;
    }
  } catch (err) {
    trialError.value = err.message || "Unknown error fetching trial info";
  } finally {
    loadingTrial.value = false;
  }
}

// refresh everything after billing portal return
watch(
  () => route.query.portal,
  async (flag) => {
    if (flag === "returned") {
      await Promise.all([fetchTrialInfo(), fetchBillingInfo(), fetchUser()]);
      router.replace({ path: route.path, query: {} });
    }
  }
);

const fetchData = async () => {
  console.log('[Dashboard] fetchData called, user:', user.value?.id, user.value?.email);
  if (!user.value?.id) {
    console.log('[Dashboard] No user ID, skipping fetch');
    loading.value = false;
    return;
  }
  loading.value = true;

  try {
    // Stage 1: run independent queries in parallel
    const [qrsArr, bandsArr, eventsArr] = await Promise.all([
      fetchQrsLite(),
      fetchBandsLite(),
      fetchEventsLite(),
    ]);

    console.log('[Dashboard] Fetched data:', { qrs: qrsArr.length, bands: bandsArr.length, events: eventsArr.length });
    console.log('[Dashboard] Raw bands:', JSON.stringify(bandsArr.slice(0, 2), null, 2));

    const mergedQrs = [...qrsArr];

    const extraIds = sharedQrIds.value || [];
    if (extraIds.length) {
      const sharedRows = await Promise.all(
        extraIds.map((id) =>
          findOne('qrs', id, {
            fields: ['name'],
            populate: { q_image: { fields: ['url'] } },
          }).catch((e) => {
            console.warn('[Dashboard] Could not fetch shared QR', id, e)
            return null
          })
        )
      );

      for (const resp of sharedRows) {
        const row = resp?.data;
        if (!row) continue;
        if (mergedQrs.some((q) => String(q.id) === String(row.id))) continue;
        row.__shared = true;
        mergedQrs.push(row);
      }
    }

    // Set state in one go (minimize reactive churn)
    qrs.value = mergedQrs;
    bands.value = bandsArr;
    events.value = eventsArr;

    // Stage 2: scans depend on QR IDs
    const qrIds = qrsArr.map((q) => q.id);
    // const scansArr = await fetchScansForQrIds(qrIds);
    // scans.value = scansArr;
  } catch (e) {
    console.error('[Dashboard] fetchData error:', e);
  } finally {
    loading.value = false;
  }
};

// Fetch MBQ Pulse for user's band
async function fetchPulse() {
  const bandId = bandItems.value[0]?.id;
  if (!bandId) {
    pulseData.value = null;
    pulseLoading.value = false;
    return;
  }
  pulseLoading.value = true;
  try {
    const data = await client('/analytics/pulse', {
      params: { entityType: 'band', entityId: bandId, range: `${pulseRange.value}d` }
    });
    pulseData.value = data?.pulse || null;
  } catch (err) {
    console.error('[Dashboard] Failed to fetch pulse:', err);
    pulseData.value = null;
  } finally {
    pulseLoading.value = false;
  }
}

// Refresh all moment panels (called after running evaluators)
function refreshPanels() {
  // This triggers a re-fetch in child components by updating a key
  // Components will re-fetch on mount, so we just need to trigger re-render
  fetchPulse();
}

const qrDetailCache = new Map() // id -> full row with options



async function fetchQrOptionsById(id) {
  if (qrDetailCache.has(id)) return qrDetailCache.get(id)

  // ask ONLY for fields your builder reads, and that exist in your CT
  const row = await findOne('qrs', id, {
    fields: ['name','url','link','template','arEnabled','options'],
    populate: {
      // only if you really store a media relation named "logo"
      logo: { fields: ['url'] },
      // if your preview image is called q_image and you want it too:
      // q_image: { fields: ['url'] }
    },
    // publicationState: 'live', // add if you use draft/publish
  })

  qrDetailCache.set(id, row)
  return row
}

// Return-only helpers (no state mutation)
async function fetchQrsLite() {
  console.log('[Dashboard] fetchQrsLite starting... user.id:', user.value?.id);
  console.log('[Dashboard] token present:', !!token.value);
  try {
    const resp = await find("qrs", {
      filters: { users_permissions_user: { id: { $eq: user.value.id } } },
      fields: ["name", "id", ],
      populate: { q_image: { fields: ["url"] } },
      sort: ["updatedAt:desc"],
      pagination: { pageSize: 50 },
    });
    console.log('[Dashboard] fetchQrsLite response:', resp);
    console.log('[Dashboard] fetchQrsLite success:', resp?.data?.length);
    return Array.isArray(resp.data) ? resp.data : [];
  } catch (e) {
    console.error('[Dashboard] fetchQrsLite ERROR:', e);
    console.error('[Dashboard] fetchQrsLite ERROR details:', e?.response?.status, e?.response?.data);
    return [];
  }
}

async function fetchBandsLite() {
  console.log('[Dashboard] fetchBandsLite starting...');
  try {
    const resp = await find("bands", {
      filters: { users_permissions_user: { id: { $eq: user.value.id } } },
      fields: ["name", "slug", "stripeAccountId", "paymentsEnabled", "stripeOnboardingComplete", "isBandNameInLogo"],
      populate: { bandImg: { fields: ["url", "formats"] } },
      sort: ["updatedAt:desc"],
      pagination: { pageSize: 50 },
    });
    console.log('[Dashboard] fetchBandsLite success:', resp?.data?.length);
    return Array.isArray(resp.data) ? resp.data : [];
  } catch (e) {
    console.error('[Dashboard] fetchBandsLite ERROR:', e);
    return [];
  }
}

async function fetchEventsLite() {
  console.log('[Dashboard] fetchEventsLite starting...');
  try {
    const resp = await find("events", {
      filters: { users_permissions_user: { id: { $eq: user.value.id } } },
      fields: ["title", "slug"],
      populate: {
        image: { fields: ["url", "formats"] },
        band: { fields: ["slug"] },
      },
      sort: ["updatedAt:desc"],
      pagination: { pageSize: 50 },
    });
    console.log('[Dashboard] fetchEventsLite success:', resp?.data?.length);
    return Array.isArray(resp.data) ? resp.data : [];
  } catch (e) {
    console.error('[Dashboard] fetchEventsLite ERROR:', e);
    return [];
  }
}

// Keep your existing scans fetch (ideally replace with a /scans/count route)
async function fetchScansForQrIds(qrIds) {
  if (!qrIds.length) return [];
  const resp = await find("scans", {
    filters: { qr: { id: { $in: qrIds } } },
    pagination: { pageSize: 250 }, // reduce from 1000 for now
    populate: [], // no deep populate
  });
  return Array.isArray(resp.data) ? resp.data : [];
}

// Open delete confirmation modal
const deleteItem = (id, type) => {
  // Find the item to get its name and image
  let item = null;
  if (type === 'qr') {
    item = qrItems.value.find(q => q.id === id);
  } else if (type === 'band') {
    item = bandItems.value.find(b => b.id === id);
  } else if (type === 'event') {
    item = eventItems.value.find(e => e.id === id);
  }

  deleteTarget.value = {
    id,
    type,
    name: item?.title || 'Untitled',
    image: item?.imageUrl || '',
  };
  showDeleteModal.value = true;
};

// Actually perform the delete after confirmation
const confirmDelete = async ({ id, type }) => {
  try {
    await client(`/${type}s/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${useStrapiToken().value}` },
    });
    
    // Reset modal state and close it
    if (deleteModalRef.value) {
      deleteModalRef.value.resetDeleting();
    }
    showDeleteModal.value = false;
    
    // Refresh the data
    await fetchData();
    
    // Show success toast
    const typeLabels = { qr: 'QR Code', band: 'Artist Page', event: 'Event' };
    toastMessage.value = `✅ ${typeLabels[type] || type} deleted successfully`;
    showToast.value = true;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      showToast.value = false;
    }, 3000);
  } catch (e) {
    console.error(e);
    // Reset the modal's deleting state
    if (deleteModalRef.value) {
      deleteModalRef.value.resetDeleting();
    }
    toastMessage.value = `❌ Failed to delete. Please try again.`;
    showToast.value = true;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
};

const qrItems = computed(() =>
  qrs.value.map((qr) => {
    // Handle both Strapi v4 (nested attributes) and v5 (flat) response formats
    const attrs = qr.attributes || qr;
    const qImage = attrs.q_image?.data?.attributes || attrs.q_image || null;
    return {
      id: qr.id,
      title: attrs.name,
      imageUrl: qImage?.url || "",
      raw: qr,
      isShared: !!qr.__shared,
    };
  })
);

const bandItems = computed(() =>
  Array.isArray(bands.value)
    ? bands.value.map((b) => {
        // Handle both Strapi v4 (nested attributes) and v5 (flat) response formats
        const attrs = b.attributes || b;
        const bandImg = attrs.bandImg?.data?.attributes || attrs.bandImg || null;
        return {
          id: b.id,
          title: attrs.name,
          name: attrs.name,
          slug: attrs.slug,
          imageUrl: bandImg?.formats?.medium?.url || bandImg?.url || "",
          bandImg: bandImg ? { url: bandImg.url } : null,
          isBandNameInLogo: attrs.isBandNameInLogo ?? false,
          stripeAccountId: attrs.stripeAccountId ?? null,
          paymentsEnabled: attrs.paymentsEnabled ?? null,
          stripeOnboardingComplete: attrs.stripeOnboardingComplete ?? null,
        };
      })
    : []
);

async function startPayoutOnboarding(bandId) {
  if (!token.value) {
    alert("You must be logged in.");
    return;
  }
  payoutLoadingId.value = bandId;
  try {
    const res = await fetch(`${config.public.strapiUrl}/api/bands/${bandId}/payments/onboard`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error?.message || "Unable to start Stripe onboarding");
    }
    if (!json?.url) throw new Error("Stripe onboarding URL missing");
    window.location.href = json.url;
  } catch (e) {
    alert(e?.message || "Unable to start payouts setup");
  } finally {
    payoutLoadingId.value = null;
  }
}

const eventItems = computed(() =>
  events.value.map((ev) => {
    // Handle both Strapi v4 (nested attributes) and v5 (flat) response formats
    const attrs = ev.attributes || ev;
    const image = attrs.image?.data?.attributes || attrs.image || null;
    const band = attrs.band?.data?.attributes || attrs.band || null;
    return {
      id: ev.id,
      title: attrs.title,
      slug: attrs.slug,
      bandSlug: band?.slug || null,
      imageUrl: image?.url || "",
    };
  })
);

const viewQr = (img) => {
  imageURL.value = img;
  qrView.value = !qrView.value;
};

const downloadImage = () => {
  const link = document.createElement("a");
  link.href = imageURL.value;
  link.download = "qr.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const imageURL = ref("");
const qrView = ref(false);

onMounted(async () => {
  console.log('[Dashboard] onMounted - user:', user.value?.id, user.value?.email);
  
  const tok = route.query.token;
  if (typeof tok === "string") {
    setToken(tok);
    await fetchUser();
    router.replace({ path: route.path, query: {} });
  }

  console.log('[Dashboard] About to call fetchData');
  await fetchData(); // show lists first
  console.log('[Dashboard] fetchData complete, bands:', bands.value?.length, 'qrs:', qrs.value?.length);
  fetchPulse(); // fetch pulse after bands are loaded

  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  idle(() => {
    fetchBillingInfo();
    fetchTrialInfo();
  });
});

// Re-fetch pulse when range changes
watch(pulseRange, () => {
  fetchPulse();
});

watch(
  [() => user.value?.id, () => user.value?.email],
  async ([id, email], oldValue) => {
    const [prevId, prevEmail] = Array.isArray(oldValue) ? oldValue : [];
    if (!id) return;
    if (id !== prevId || email !== prevEmail) {
      await fetchData();
    }
  },
  { immediate: true }
);

const editItem = (id, page) => {
  router.push(`/${page}/${id}`);
};

async function goToBillingPortal() {
  if (!token.value) {
    return alert("You must be logged in.");
  }
  loadingPortal.value = true;
  try {
    const { url } = await client("/stripe/create-billing-portal-session", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
    });
    window.location.href = url;
  } catch (err) {
    console.error("[Dashboard] billing-portal error", err);
    alert("Could not open billing portal. Please try again.");
  } finally {
    loadingPortal.value = false;
  }
}
</script>

<style scoped lang="css">
/* Toast animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Dashboard Section */
.dashboard-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}

@media (min-width: 640px) {
  .section-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.section-content {
  padding: 1.5rem;
}

/* Create Button */
.create-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  text-decoration: none;
}

.create-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

/* Item Card */
.item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.item-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

@media (min-width: 640px) {
  .item-card {
    flex-direction: row;
    gap: 1.25rem;
  }
}

/* Image with skeleton */
.item-image-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.item-image-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.item-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.item-image.loaded {
  opacity: 1;
}

/* Item Info */
.item-info {
  flex: 1;
  min-width: 0;
  text-align: center;
}

@media (min-width: 640px) {
  .item-info {
    text-align: left;
  }
}

.item-title {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  word-break: break-word;
}

.item-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-success {
  background: rgba(16, 185, 129, 0.15);
  color: rgb(52, 211, 153);
}
.status-success .status-dot {
  background: rgb(52, 211, 153);
}

.status-warning {
  background: rgba(245, 158, 11, 0.15);
  color: rgb(251, 191, 36);
}
.status-warning .status-dot {
  background: rgb(251, 191, 36);
}

.status-neutral {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}
.status-neutral .status-dot {
  background: rgba(255, 255, 255, 0.4);
}

/* Item Actions */
.item-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .item-actions {
    flex-wrap: nowrap;
  }
}

.action-btn-labeled {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.action-btn-labeled:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(-1px);
}

.action-btn-labeled:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
