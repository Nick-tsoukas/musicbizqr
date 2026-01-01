<template>
  <div class="bg-[#000] w-[90vw] mx-auto z-0 pt-[var(--header-height)]">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div class="container-mdc bg-black max-w-5xl">
      <h1 class="title text-white">Edit Band Profile</h1>
      <form class="form-group" @submit.prevent="submitForm">
        <div class="bg-[#fff] rounded-md my-10">
          <div
            class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-green-500 to-teal-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Payouts (Get Paid)</h2>
          </div>
          <div class="p-4">
            <div class="text-black">
              <div>
                Stripe Account:
                <span class="font-semibold">
                  {{ stripeAccountId ? "Connected" : "Not connected" }}
                </span>
              </div>
              <div>
                Onboarding:
                <span class="font-semibold">
                  {{ stripeOnboardingComplete ? "Complete" : "Incomplete" }}
                </span>
              </div>
              <div>
                Payments:
                <span class="font-semibold">
                  {{ paymentsEnabled ? "Enabled" : "Disabled" }}
                </span>
              </div>
            </div>

            <button
              type="button"
              class="mdc-button w-full mt-4"
              :disabled="payoutLoading"
              @click="startPayoutOnboarding"
            >
              {{ payoutLoading ? "Loading…" : (stripeOnboardingComplete ? "Manage / Continue Payout Setup" : "Set Up Payouts") }}
            </button>
          </div>
        </div>

        <div class="bg-[#fff] rounded-md my-10">
          <div
            class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-violet-500 to-purple-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Merch Concierge (Show-only pickup)</h2>
          </div>

          <div class="p-4 space-y-4">
            <label for="mc-enabled" class="flex items-center justify-between gap-4 cursor-pointer select-none">
              <div class="text-black">
                <div class="font-semibold">Enable Merch Concierge</div>
                <div class="text-sm text-gray-700 mt-1">
                  This shows a premium merch section at the top of your band page.
                </div>
              </div>
              <input
                id="mc-enabled"
                type="checkbox"
                v-model="mcEnabled"
                class="h-5 w-5 text-purple-600 border-gray-300 rounded"
              />
            </label>

            <div class="text-sm text-gray-700 mt-2 mb-8">
              <div>Let fans buy merch during the show and pick it up later — skipping the merch line.</div>
              <div>Fans pay on their phone and show a confirmation at pickup.</div>
            </div>

            <div v-if="mcEnabled" class="space-y-4">
              <div class="mdc-text-field">
                <textarea
                  id="mc-pickup"
                  class="mdc-text-field__input"
                  v-model="mcPickupInstructions"
                  placeholder=" "
                  required
                ></textarea>
                <label class="mdc-floating-label" for="mc-pickup">
                  Pickup Instructions (required)
                </label>
                <div class="mdc-line-ripple"></div>
                <div class="text-xs text-gray-700 mt-2">
                  Example: “Pickup at the merch table after the set — show this screen to staff.”
                </div>
              </div>

              <div class="flex items-start gap-3">
                <input
                  id="mc-ready"
                  type="checkbox"
                  v-model="mcStaffReadyConfirmed"
                  class="mt-1 h-5 w-5 text-purple-600 border-gray-300 rounded"
                />
                <label for="mc-ready" class="text-black select-none">
                  <div class="font-semibold">We have reserved inventory and told staff/venue about pickup</div>
                  <div class="text-sm text-gray-700 mt-1">
                    This must be checked for the checkout button to work.
                  </div>
                </label>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <div
                  v-for="(item, idx) in mcItems"
                  :key="idx"
                  class="border border-black/10 rounded-md p-4"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="text-black font-semibold">Item {{ idx + 1 }}</div>
                    <button
                      type="button"
                      class="text-sm text-red-600"
                      @click="resetMcItem(idx)"
                    >
                      Remove item
                    </button>
                  </div>

                  <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="mdc-text-field">
                      <input
                        :id="`mc-title-${idx}`"
                        v-model="item.title"
                        type="text"
                        class="mdc-text-field__input"
                        placeholder=" "
                      />
                      <label class="mdc-floating-label" :for="`mc-title-${idx}`">Title</label>
                      <div class="mdc-line-ripple"></div>
                    </div>

                    <div class="mdc-text-field">
                      <input
                        :id="`mc-price-${idx}`"
                        type="text"
                        inputmode="decimal"
                        class="mdc-text-field__input"
                        placeholder=" "
                        v-model="mcPriceTextByIndex[idx]"
                        @blur="commitMcPrice(idx)"
                        @change="commitMcPrice(idx)"
                      />
                      <label class="mdc-floating-label" :for="`mc-price-${idx}`">Price (USD)</label>
                      <div class="mdc-line-ripple"></div>
                    </div>

                    <div class="md:col-span-2">
                      <div class="text-xs text-gray-700 mb-2">Product image (optional)</div>
                      <input
                        :id="`mc-img-${idx}`"
                        type="file"
                        accept="image/*"
                        class="w-full px-3 py-2 rounded-md bg-white border border-black/20 text-black"
                        @change="onMcImageFileChange(idx, $event)"
                      />

                      <div v-if="mcItemImagePreviewByIndex[idx] || item.imageUrl" class="mt-2">
                        <img
                          :src="mcItemImagePreviewByIndex[idx] || item.imageUrl"
                          :alt="item.title || 'Product image'"
                          class="w-full max-h-56 object-contain rounded-md border border-black/10"
                        />
                        <button
                          type="button"
                          class="mt-2 text-sm text-red-600"
                          @click="clearMcImage(idx)"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>

                    <div class="mdc-text-field md:col-span-2 mt-4">
                      <textarea
                        :id="`mc-desc-${idx}`"
                        v-model="item.description"
                        class="mdc-text-field__input"
                        placeholder=" "
                      ></textarea>
                      <label class="mdc-floating-label" :for="`mc-desc-${idx}`">Description</label>
                      <div class="mdc-line-ripple"></div>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center gap-3">
                    <input
                      :id="`mc-sizes-${idx}`"
                      type="checkbox"
                      v-model="item.sizesEnabled"
                      class="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label :for="`mc-sizes-${idx}`" class="text-black select-none">
                      Sizes enabled
                    </label>
                  </div>

                  <div v-if="!item.sizesEnabled" class="mt-3">
                    <div class="text-xs text-black/70 mb-1">Available quantity</div>
                    <input
                      v-model.number="item.availableQty"
                      type="number"
                      step="1"
                      min="0"
                      class="w-full px-3 py-2 rounded-md bg-white border border-black/20 text-black"
                    />
                  </div>

                  <div v-else class="mt-3">
                    <div class="text-xs text-black/70 mb-2">Size stock (set 0 for sold out)</div>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <div v-for="sz in mcSizes" :key="sz">
                        <div class="text-xs text-black/70 mb-1">{{ sz }}</div>
                        <input
                          v-model.number="item.sizeStock[sz]"
                          type="number"
                          step="1"
                          min="0"
                          class="w-full px-3 py-2 rounded-md bg-white border border-black/20 text-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Band Details Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Band Details</h2>
          </div>
          <div class="p-4">
            <!-- Band Name -->
            <div class="mdc-text-field">
              <input
                type="text"
                id="band-name"
                class="mdc-text-field__input"
                v-model="bandName"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="band-name"
                >Band Name</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Genre -->
            <div class="mdc-text-field">
              <input
                type="text"
                id="genre"
                class="mdc-text-field__input"
                v-model="genre"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="genre">Genre</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Bio -->
            <div class="mdc-text-field">
              <textarea
                id="bio"
                class="mdc-text-field__input"
                v-model="bio"
                placeholder=" "
                required
              ></textarea>
              <label class="mdc-floating-label" for="bio">Artist Description/Introduction</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Website Link and Text -->
        <div class="bg-[#fff] rounded-md my-10">
          <div
            class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">
              Website Link and Text
            </h2>
          </div>
          <div class="p-4">
            <div class="mdc-text-field">
              <input
                type="text"
                id="websitelink"
                class="mdc-text-field__input"
                v-model="websitelink"
                placeholder="https://yourbandsite.com"
              />
              <label class="mdc-floating-label" for="websitelink"
                >Website Link</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
          <div class="p-4">
            <div class="mdc-text-field">
              <input
                type="text"
                id="websitelinktext"
                class="mdc-text-field__input"
                v-model="websitelinktext"
                placeholder="YourBandSiteLinkText.com"
              />
              <label class="mdc-floating-label" for="websitelinktext"
                >Website Link Text To Show</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Band Image -->
        <div
          class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
        >
          <h3 class="font-semibold text-white text-2xl">Upload Image</h3>
        </div>
        <div class="mb-4 py-10 bg-white p-4">
          <div v-if="bandImgUrl" class="mb-4">
            <img
              :src="bandImgUrl"
              alt="Band Image"
              class="w-full max-h-[300px] object-contain"
            />
          </div>
          <input
            type="file"
            id="band-img"
            class="styled-file-input"
            @change="handleImageUpload"
            accept="image/*"
          />
          <label for="band-img" class="styled-file-label w-full text-center"
            >Choose Band Image</label
          >
        </div>

        <!-- Band Members Section -->
        <!-- <div class="bg-white rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Band Members</h2>
          </div>
          <div class="p-4">
            <div v-for="(member, i) in members" :key="i" class="member-container">
              <div class="mdc-text-field mb-4">
                <input
                  type="text"
                  :id="'member-name-' + i"
                  class="mdc-text-field__input"
                  v-model="member.name"
                  placeholder=" "
                />
                <label class="mdc-floating-label" :for="'member-name-' + i">Member Name</label>
                <div class="mdc-line-ripple"></div>
              </div>
              <div class="mdc-text-field mb-4">
                <input
                  type="text"
                  :id="'instrument-' + i"
                  class="mdc-text-field__input"
                  v-model="member.instrument"
                  placeholder=" "
                />
                <label class="mdc-floating-label" :for="'instrument-' + i">Instrument</label>
                <div class="mdc-line-ripple"></div>
              </div>
              <div class="mb-4">
                <input
                  type="file"
                  :id="'member-img-' + i"
                  class="styled-file-input"
                  @change="e => handleMemberImageUpload(e, i)"
                  accept="image/*"
                />
                <label :for="'member-img-' + i" class="styled-file-label w-full text-center">Choose Member Image</label>
              </div>
              <div v-if="member.imageUrl" class="mb-4">
                <img
                  :src="member.imageUrl"
                  alt="Member Image"
                  class="w-full h-auto rounded-lg shadow-md object-contain"
                />
              </div>
              <button type="button" class="mdc-button mb-4 w-full" @click="removeMember(i)">Remove Member</button>
            </div>
            <button type="button" class="mdc-button mb-8 w-full" @click="addMember">+ Add Member</button>
          </div>
        </div> -->

        <!-- Social Media Links Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">
              Social Media Links
            </h2>
          </div>
          <div class="p-4 grid grid-cols-2 gap-4">
            <div
              v-for="net in Object.keys(social)"
              :key="net"
              class="mdc-text-field"
            >
              <input
                :id="net"
                type="text"
                class="mdc-text-field__input"
                v-model="social[net]"
                placeholder=" "
              />
              <label class="mdc-floating-label" :for="net">{{
                net.charAt(0).toUpperCase() + net.slice(1)
              }}</label>
              <div class="mdc-line-ripple"></div>
              <div class="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  :id="`hide-${net}`"
                  :checked="isLinkHidden(net)"
                  @change="setLinkHidden(net, $event.target.checked)"
                />
                <label :for="`hide-${net}`" class="text-black select-none">Hide</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Streaming Links Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Streaming Links</h2>
          </div>
          <div class="p-4 grid grid-cols-2 gap-4">
            <div
              v-for="stream in Object.keys(streaming)"
              :key="stream"
              class="mdc-text-field"
            >
              <input
                :id="stream"
                type="text"
                class="mdc-text-field__input"
                v-model="streaming[stream]"
                placeholder=" "
              />
              <label class="mdc-floating-label" :for="stream">{{
                stream
              }}</label>
              <div class="mdc-line-ripple"></div>
              <div class="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  :id="`hide-${stream}`"
                  :checked="isLinkHidden(stream)"
                  @change="setLinkHidden(stream, $event.target.checked)"
                />
                <label :for="`hide-${stream}`" class="text-black select-none">Hide</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Featured Song Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Featured Song</h2>
          </div>

          <div class="p-4">
            <!-- Upload vs. Embed toggle -->
            <div class="flex space-x-4 mb-4">
              <label class="text-black">
                <input
                  type="radio"
                  value="upload"
                  v-model="singlesongType"
                  class="mr-1"
                />
                Upload File
              </label>
              <label class="text-black">
                <input
                  type="radio"
                  value="embed"
                  v-model="singlesongType"
                  class="mr-1"
                />
                Use Embed
              </label>
            </div>

            <!-- Title always -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="singlesong-title"
                class="mdc-text-field__input"
                v-model="singlesongTitle"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="singlesong-title"
                >Song Title</label
              >
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Upload mode -->
            <div v-if="singlesongType === 'upload'">
              <input
                type="file"
                id="singlesong-file"
                class="styled-file-input"
                @change="handleSingleSongUpload"
                accept="audio/*"
              />
              <label
                for="singlesong-file"
                class="styled-file-label w-full text-center"
                >Choose Song File</label
              >
              <button
                type="button"
                v-if="singlesongFileId"
                @click="deleteSong"
                class="mdc-button mdc-button--danger mt-4 w-full"
              >
                Delete Song
              </button>
            </div>

            <!-- Embed mode -->
            <!-- Embed mode: paste raw iframe code -->
            <div v-else class="space-y-4">
              <div class="mdc-text-field">
                <textarea
                  id="singlesong-embedhtml"
                  class="mdc-text-field__input"
                  v-model="singlesongEmbedHtml"
                  placeholder='<iframe src="https://open.spotify.com/embed/track/..." frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>'
                  rows="6"
                ></textarea>
                <label class="mdc-floating-label" for="singlesong-embedhtml">
                  Paste embed code (iframe)
                </label>
                <div class="mdc-line-ripple"></div>
              </div>

              <button
                type="button"
                v-if="singlesongEmbedHtml"
                @click="deleteSong"
                class="mdc-button mdc-button--danger w-full"
              >
                Delete Embed
              </button>

              <!-- Optional: keep the legacy fields hidden for now
       (remove this whole comment if you don't need them)
  <details class="text-white/70">
    <summary>Legacy platform / trackId (optional)</summary>
    <div class="mdc-text-field w-full mt-2">
      <select id="singlesong-platform" class="mdc-text-field__input" v-model="singlesongPlatform">
        <option disabled value="">Select Platform</option>
        <option value="spotify">Spotify</option>
        <option value="appleMusic">Apple Music</option>
        <option value="youtube">YouTube</option>
        <option value="deezer">Deezer</option>
        <option value="bandcamp">Bandcamp</option>
        <option value="mixcloud">Mixcloud</option>
        <option value="audiomack">Audiomack</option>
        <option value="soundcloud">SoundCloud</option>
      </select>
      <label class="mdc-floating-label" for="singlesong-platform">Platform</label>
      <div class="mdc-line-ripple"></div>
    </div>
    <div class="mdc-text-field mt-2">
      <input
        type="text"
        id="singlesong-trackid"
        class="mdc-text-field__input"
        v-model="singlesongTrackId"
        placeholder="Only if not pasting iframe"
      />
      <label class="mdc-floating-label" for="singlesong-trackid">Track ID</label>
      <div class="mdc-line-ripple"></div>
    </div>
  </details>
              -->
            </div>

          </div>

          <div class="p-4">
            <div class="mdc-text-field mb-4">
              <input
                id="singlevideo-title"
                v-model="singlevideoTitle"
                type="text"
                class="mdc-text-field__input"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="singlevideo-title">
                Video Title
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="singlevideo-youtube"
                class="mdc-text-field__input"
                v-model="singlevideoYoutubeUrl"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="singlevideo-youtube"
                >YouTube Video URL</label
              >
              <div class="mdc-line-ripple"></div>
              <button
                type="button"
                v-if="singlevideoYoutubeUrl"
                @click="deleteVideo"
                class="mdc-button mdc-button--danger mt-4 w-full"
              >
                Delete Video
              </button>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="bg-[#fff] rounded-md my-10">
          <div
            class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Support Buttons</h2>
          </div>
          <div class="p-4 space-y-4">
            <div
              v-for="btn in paymentButtons"
              :key="btn.key"
              class="border border-black/10 rounded-md p-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="font-semibold text-black">{{ btn.title }}</div>
                  <div v-if="btn.description" class="text-sm text-gray-700 mt-1">
                    {{ btn.description }}
                  </div>
                </div>
                <div class="flex items-center">
                  <input
                    :id="`paybtn-${btn.key}`"
                    type="checkbox"
                    v-model="btn.enabled"
                    class="mr-2 h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <label :for="`paybtn-${btn.key}`" class="text-black select-none">
                    Enabled
                  </label>
                </div>
              </div>

              <div class="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <div class="text-xs text-black/70 mb-1">Pricing</div>
                  <select
                    v-model="btn.pricingMode"
                    class="w-full px-3 py-2 rounded-md bg-white border border-black/20 text-black"
                  >
                    <option value="min">Minimum</option>
                    <option value="fixed">Fixed</option>
                    <option value="presets">Presets</option>
                  </select>
                </div>

                <div v-if="btn.pricingMode === 'min'">
                  <div class="text-xs text-black/70 mb-1">Minimum amount</div>
                  <div class="flex items-center gap-2">
                    <span class="text-black">$</span>
                    <input
                      v-model.number="btn.minAmount"
                      type="number"
                      step="1"
                      min="0"
                      class="w-full px-3 py-2 rounded-md bg-white border border-black/20 text-black"
                    />
                  </div>
                </div>

                <div v-else-if="btn.pricingMode === 'fixed'">
                  <div class="text-xs text-black/70 mb-1">Fixed amount</div>
                  <div class="flex items-center gap-2">
                    <span class="text-black">$</span>
                    <input
                      v-model.number="btn.fixedAmount"
                      type="number"
                      step="1"
                      min="0"
                      class="w-full px-3 py-2 rounded-md bg-white border border-black/20 text-black"
                    />
                  </div>
                </div>

                <div v-else-if="btn.pricingMode === 'presets'" class="md:col-span-2">
                  <div class="text-xs text-black/70 mb-1">Preset amounts (comma-separated)</div>
                  <input
                    v-model="btn.presetAmountsText"
                    @blur="btn.presetAmounts = parsePresetAmounts(btn.presetAmountsText)"
                    type="text"
                    placeholder="e.g. 3, 5, 10"
                    class="w-full px-3 py-2 rounded-md bg-white border border-black/20 text-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" class="mdc-button w-full mt-10">
          Save Changes
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const singlevideoTitle = ref("");
const singlesongEmbedHtml = ref("");

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const user = useStrapiUser();
const token = useStrapiToken();

const loading = ref(false);
const payoutLoading = ref(false);

const stripeAccountId = ref(null);
const stripeOnboardingComplete = ref(false);
const paymentsEnabled = ref(false);

// flags for “delete on save”
const removeSong = ref(false);
const removeVideo = ref(false);

// Band basics
const bandName = ref("");
const genre = ref("");
const bio = ref("");
const websitelink = ref("");
const websitelinktext = ref("");

// Track existing vs new image
const bandImgFile = ref(null);
const bandImgUrl = ref("");
const bandImgId = ref(null);

// Members
const members = ref([]);

// Social media links
const social = ref({
  facebook: "",
  instagram: "",
  twitch: "",
  twitter: "",
  whatsapp: "",
  tiktok: "",
  snapchat: "",
});

// Streaming links
const streaming = ref({
  appleMusic: "",
  spotify: "",
  soundcloud: "",
  youtube: "",
  deezer: "",
  bandcamp: "",
  reverbnation: "",
});

const hiddenLinks = ref([]);

// Merch Concierge config
const mcSizes = ["S", "M", "L", "XL", "2XL"];
const mcEnabled = ref(false);
const mcPickupInstructions = ref("");
const mcStaffReadyConfirmed = ref(false);
const mcPriceTextByIndex = ref(["", "", ""]);
const mcItemImageFiles = ref([null, null, null]);
const mcItemImagePreviewByIndex = ref({});
const mcItems = ref([
  {
    title: "",
    description: "",
    imageUrl: "",
    priceCents: 0,
    sizesEnabled: false,
    availableQty: 0,
    sizeStock: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  },
  {
    title: "",
    description: "",
    imageUrl: "",
    priceCents: 0,
    sizesEnabled: false,
    availableQty: 0,
    sizeStock: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  },
  {
    title: "",
    description: "",
    imageUrl: "",
    priceCents: 0,
    sizesEnabled: false,
    availableQty: 0,
    sizeStock: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  },
]);

function normalizeMerchConcierge(raw) {
  const mc = raw && typeof raw === "object" ? raw : null;
  if (!mc) return;

  mcEnabled.value = mc.enabled === true;
  mcPickupInstructions.value = mc.pickupInstructions ? String(mc.pickupInstructions) : "";
  mcStaffReadyConfirmed.value = mc.staffReadyConfirmed === true;

  const items = Array.isArray(mc.merchItems) ? mc.merchItems : [];
  const next = mcItems.value.map((d, i) => {
    const it = items[i] || {};
    const sizesEnabled = it.sizesEnabled === true;
    const sizeStock = it.sizeStock && typeof it.sizeStock === "object" ? it.sizeStock : {};

    return {
      ...d,
      title: it.title ? String(it.title) : "",
      description: it.description ? String(it.description) : "",
      imageUrl: it.imageUrl ? String(it.imageUrl) : "",
      priceCents: Number(it.priceCents || 0),
      sizesEnabled,
      availableQty: Number(it.availableQty || 0),
      sizeStock: {
        S: Number(sizeStock.S || 0),
        M: Number(sizeStock.M || 0),
        L: Number(sizeStock.L || 0),
        XL: Number(sizeStock.XL || 0),
        "2XL": Number(sizeStock["2XL"] || 0),
      },
    };
  });

  mcItems.value = next;

  mcPriceTextByIndex.value = next.map((it) => formatMcPriceDollars(it.priceCents));
}

function formatMcPriceDollars(priceCents) {
  const n = Number(priceCents || 0);
  return (n / 100).toFixed(2);
}

function parseMcPriceToCents(value) {
  const s = String(value == null ? "" : value).trim();
  if (!s) return 0;
  const num = Number(s);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100);
}

function commitMcPrice(idx) {
  const v = mcPriceTextByIndex.value?.[idx];
  const cents = parseMcPriceToCents(v);
  mcItems.value[idx].priceCents = cents;
  mcPriceTextByIndex.value[idx] = formatMcPriceDollars(cents);
}

function onMcImageFileChange(idx, e) {
  const f = e?.target?.files?.[0] || null;
  mcItemImageFiles.value[idx] = f;

  const next = { ...(mcItemImagePreviewByIndex.value || {}) };
  if (f) {
    next[idx] = URL.createObjectURL(f);
  } else {
    delete next[idx];
  }
  mcItemImagePreviewByIndex.value = next;
}

function clearMcImage(idx) {
  mcItemImageFiles.value[idx] = null;
  mcItems.value[idx].imageUrl = "";
  const next = { ...(mcItemImagePreviewByIndex.value || {}) };
  delete next[idx];
  mcItemImagePreviewByIndex.value = next;
}

function resetMcItem(idx) {
  if (!confirm("Clear this merch item?")) return;

  mcItems.value[idx] = {
    title: "",
    description: "",
    imageUrl: "",
    priceCents: 0,
    sizesEnabled: false,
    availableQty: 0,
    sizeStock: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  };

  mcItemImageFiles.value[idx] = null;
  const next = { ...(mcItemImagePreviewByIndex.value || {}) };
  delete next[idx];
  mcItemImagePreviewByIndex.value = next;

  mcPriceTextByIndex.value[idx] = "";
}

function normalizeHiddenLinks(v) {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (v && typeof v === 'object') return Object.keys(v).filter((k) => v[k]);
  return [];
}

function isLinkHidden(key) {
  return Array.isArray(hiddenLinks.value) && hiddenLinks.value.includes(key);
}

function setLinkHidden(key, hidden) {
  const next = Array.isArray(hiddenLinks.value) ? [...hiddenLinks.value] : [];
  const idx = next.indexOf(key);
  if (hidden && idx === -1) next.push(key);
  if (!hidden && idx !== -1) next.splice(idx, 1);
  hiddenLinks.value = next;
}

const paymentButtons = ref([
  {
    key: "pay_entry",
    title: "Pay Entry",
    badgeId: "show_supporter",
    description: "Door entry for tonight’s show",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "tip_band",
    title: "Tip the Band",
    badgeId: "tip_legend",
    description: "Thanks for the support ❤️",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "pay_merch",
    title: "Pay for Merch",
    badgeId: "merch_mvp",
    description: "Shirts, posters, vinyl, etc.",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "support_band",
    title: "Support the Band",
    badgeId: "band_backer",
    description: "Help us keep making music",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "help_get_home",
    title: "Help Us Get Home",
    badgeId: "road_crew",
    description: "Gas, food, and late nights on the road",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "after_show_support",
    title: "After-Show Support",
    badgeId: "after_show_backer",
    description: "Thanks for coming out tonight ❤️",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
]);

function sanitizePricingMode(v) {
  return v === "fixed" || v === "presets" || v === "min" ? v : "min";
}

function parsePresetAmounts(v) {
  if (!v) return [];
  return String(v)
    .split(",")
    .map((s) => Number(String(s).trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function sanitizePresetAmounts(arr) {
  return Array.isArray(arr)
    ? arr
        .map((n) => Number(n))
        .filter((n) => Number.isFinite(n) && n > 0)
    : [];
}

function formatPresetAmounts(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(", ") : "";
}

function mergePaymentButtons(existing = []) {
  const safeExisting = Array.isArray(existing) ? existing : [];
  const byKey = new Map(safeExisting.filter(Boolean).map((b) => [b.key, b]));
  return paymentButtons.value.map((d) => {
    const e = byKey.get(d.key) || {};

    const pricingMode = sanitizePricingMode(e.pricingMode ?? d.pricingMode);
    const minAmount = Number(e.minAmount ?? d.minAmount ?? 5);
    const fixedAmountRaw = e.fixedAmount ?? d.fixedAmount ?? null;
    const fixedAmount = fixedAmountRaw == null ? null : Number(fixedAmountRaw);
    const presetAmounts = sanitizePresetAmounts(e.presetAmounts ?? d.presetAmounts);

    return {
      ...d,
      ...e,
      key: d.key,
      title: d.title,
      description: d.description,
      enabled: e.enabled === true,
      pricingMode,
      minAmount: pricingMode === "min" ? minAmount : null,
      fixedAmount: pricingMode === "fixed" ? fixedAmount : null,
      presetAmounts: pricingMode === "presets" ? presetAmounts : [],
      presetAmountsText:
        pricingMode === "presets" ? formatPresetAmounts(presetAmounts) : "",
    };
  });
}

// Featured song/video
const singlesongType = ref("upload"); // 'upload' or 'embed'
const singlesongTitle = ref("");
const singlesongPlatform = ref(""); // new
const singlesongTrackId = ref(""); // new
const singlesongFile = ref(null);
const singlesongFileId = ref(null); // preserve existing file relation

const singlevideoYoutubeUrl = ref("");

// Clear the song fields and mark for removal on Save
function deleteSong() {
  if (!confirm("Remove the featured song from this form?")) return;
  removeSong.value = true;
  singlesongTitle.value = "";
  singlesongPlatform.value = "";
  singlesongTrackId.value = "";
  singlesongEmbedHtml.value = ""; // NEW
  singlesongFile.value = null;
  singlesongFileId.value = null;
}

// Clear the video field and mark for removal on Save
function deleteVideo() {
  if (!confirm("Remove the featured video from this form?")) return;
  removeVideo.value = true;
  singlevideoYoutubeUrl.value = "";
}

const rawEmbedHtml = computed(() => singlesongEmbedHtml.value || "");

function normalizeLink(link) {
  if (!link) return "";

  // Already has a protocol → return as-is
  if (/^https?:\/\//i.test(link)) return link.trim();

  // Starts with www → add https://
  if (/^www\./i.test(link)) return `https://${link.trim()}`;

  // Otherwise assume https://
  return `https://www.${link.trim()}`;
}

async function fetchBand() {
  loading.value = true;
  const id = route.params.id;

  try {
    const url =
      `${config.public.strapiUrl}/api/bands/${id}` +
      `?populate=bandImg,members.image,singlesong.song,singlevideo`;
    const res = await fetch(url);
    const j = await res.json();
    if (!j.data) throw new Error("No data");

    const attrs = j.data.attributes;

    stripeAccountId.value = attrs.stripeAccountId || null;
    stripeOnboardingComplete.value = attrs.stripeOnboardingComplete === true;
    paymentsEnabled.value = attrs.paymentsEnabled === true;

    // Basic fields
    bandName.value = attrs.name || "";
    genre.value = attrs.genre || "";
    bio.value = attrs.bio || "";
    websitelink.value = normalizeLink(attrs.websitelink) || "";
    websitelinktext.value = attrs.websitelinktext || "";

    // Existing image
    const img = attrs.bandImg?.data;
    bandImgId.value = img?.id || null;
    bandImgUrl.value = img?.attributes?.url || "";

    // Members
    members.value = (attrs.members?.data || []).map((m) => ({
      name: m.attributes.name,
      instrument: m.attributes.instrument,
      imageUrl: m.attributes.image?.data?.attributes?.url || null,
    }));

    // Social & Streaming
    Object.keys(social.value).forEach(
      (k) => (social.value[k] = attrs[k] || "")
    );
    Object.keys(streaming.value).forEach(
      (k) => (streaming.value[k] = attrs[k] || "")
    );

    hiddenLinks.value = normalizeHiddenLinks(attrs.hiddenLinks);

    paymentButtons.value = mergePaymentButtons(attrs.paymentButtons);

    normalizeMerchConcierge(attrs.merchConcierge);

    // Singlesong component + existing file
    if (attrs.singlesong) {
      const ss = attrs.singlesong;
      singlesongTitle.value = ss.title || "";
      if (ss.isEmbed) {
        singlesongType.value = "embed";
        // legacy (keep reading in case old data exists)
        singlesongPlatform.value = ss.platform || "";
        singlesongTrackId.value = ss.trackId || "";
        // NEW: load raw embed code if present
        singlesongEmbedHtml.value = ss.embedHtml || "";
      } else {
        singlesongType.value = "upload";
      }
      singlesongFileId.value = ss.song?.data?.id || null;
    }

    // Singlevideo component
    if (attrs.singlevideo) {
      singlevideoYoutubeUrl.value = attrs.singlevideo.youtubeid || "";
      singlevideoTitle.value = attrs.singlevideo?.title || "";
    }
  } catch (err) {
    console.error("❌ fetchBand failed:", err);
  } finally {
    loading.value = false;
  }
}
onMounted(fetchBand);

async function startPayoutOnboarding() {
  const id = route.params.id;
  if (!token.value) {
    alert("You must be logged in.");
    return;
  }

  payoutLoading.value = true;
  try {
    const res = await fetch(
      `${config.public.strapiUrl}/api/bands/${id}/payments/onboard`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error?.message || "Unable to start Stripe onboarding");
    }
    if (!json?.url) throw new Error("Stripe onboarding URL missing");
    window.location.href = json.url;
  } catch (e) {
    alert(e?.message || "Unable to start payouts setup");
  } finally {
    payoutLoading.value = false;
  }
}

// Handlers
function handleImageUpload(e) {
  bandImgFile.value = e.target.files[0];
  bandImgUrl.value = URL.createObjectURL(bandImgFile.value);
}
function handleSingleSongUpload(e) {
  singlesongFile.value = e.target.files[0];
}

// Normalize links before including them in the payload

async function submitForm() {
  loading.value = true;
  const id = route.params.id;

  try {
    // Ensure merch price inputs are committed to cents
    for (let i = 0; i < mcItems.value.length; i++) {
      const cents = parseMcPriceToCents(mcPriceTextByIndex.value?.[i]);
      mcItems.value[i].priceCents = cents;
      mcPriceTextByIndex.value[i] = formatMcPriceDollars(cents);
    }

    // 1) Upload new image if chosen
    let newImageId = null;
    if (bandImgFile.value) {
      const fm = new FormData();
      fm.append("files", bandImgFile.value, bandImgFile.value.name);
      fm.append("ref", "api::band.band");
      fm.append("refId", id);
      fm.append("field", "bandImg");
      const up = await fetch(`${config.public.strapiUrl}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: fm,
      });
      const uj = await up.json();
      if (!up.ok) throw uj;
      newImageId = uj[0]?.id ?? null;
    }

    // 2) Upload new song file if chosen (only relevant for upload mode)
    let newSongId = null;
    if (singlesongFile.value) {
      const fm2 = new FormData();
      fm2.append("files", singlesongFile.value, singlesongFile.value.name);
      fm2.append("ref", "api::band.band");
      fm2.append("refId", id);
      fm2.append("field", "singlesong.song");
      const su = await fetch(`${config.public.strapiUrl}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: fm2,
      });
      const suj = await su.json();
      if (!su.ok) throw suj;
      newSongId = suj[0]?.id ?? null;
    }

    // 2b) Upload merch concierge images (stored as absolute URL in merchConcierge JSON)
    if (mcEnabled.value) {
      for (let i = 0; i < mcItemImageFiles.value.length; i++) {
        const f = mcItemImageFiles.value[i];
        if (!f) continue;

        const fm3 = new FormData();
        fm3.append("files", f, f.name);
        const mu = await fetch(`${config.public.strapiUrl}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token.value}` },
          body: fm3,
        });
        const muj = await mu.json();
        if (!mu.ok) throw muj;

        const uploadedUrl = muj?.[0]?.url || null;
        if (uploadedUrl) {
          const base = String(config.public.strapiUrl || "").replace(/\/+$/, "");
          const u = String(uploadedUrl);
          mcItems.value[i].imageUrl = u.startsWith("http")
            ? u
            : base + (u.startsWith("/") ? u : `/${u}`);
        }
      }
    }

    // Optional: require a real <iframe> when in embed mode and user pasted something
    if (singlesongType.value === "embed" && singlesongEmbedHtml.value.trim()) {
      const looksLikeIframe = /<iframe[\s\S]*<\/iframe>/i.test(
        singlesongEmbedHtml.value
      );
      if (!looksLikeIframe) {
        alert("Please paste a full <iframe> embed code for the embedded song.");
        loading.value = false;
        return;
      }
    }

    // 3) Build payloads
    // Featured song
    let singlesongPayload = null;
    if (!removeSong.value) {
      const isEmbed = singlesongType.value === "embed";
      const embedHtml = isEmbed ? (singlesongEmbedHtml.value || "").trim() : "";

      singlesongPayload = {
        title: singlesongTitle.value || "",
        isEmbed,
        // Prefer raw embed HTML. If present, we ignore platform/trackId.
        embedHtml: isEmbed ? embedHtml || null : null,
        platform:
          isEmbed && !embedHtml ? singlesongPlatform.value || null : null, // legacy fallback
        trackId: isEmbed && !embedHtml ? singlesongTrackId.value || null : null, // legacy fallback
        embedUrl: null, // no builder anymore
        song: !isEmbed ? newSongId || singlesongFileId.value || null : null,
      };
    }

    // Featured video
    const singlevideoPayload = removeVideo.value
      ? null
      : {
          youtubeid: singlevideoYoutubeUrl.value || "",
          title: singlevideoTitle.value || "",
        };

    // Normalize socials/streaming
    const normalizedSocial = Object.fromEntries(
      Object.entries(social.value).map(([key, val]) => [
        key,
        normalizeLink(val),
      ])
    );
    const normalizedStreaming = Object.fromEntries(
      Object.entries(streaming.value).map(([key, val]) => [
        key,
        normalizeLink(val),
      ])
    );

    // Full band payload
    const payload = {
      name: bandName.value,
      genre: genre.value,
      bio: bio.value,
      websitelink: websitelink.value || null,
      websitelinktext: websitelinktext.value || null,
      users_permissions_user: user.value.id,
      hiddenLinks: hiddenLinks.value,
      merchConcierge: mcEnabled.value
        ? {
            enabled: true,
            pickupInstructions: String(mcPickupInstructions.value || "").trim(),
            staffReadyConfirmed: mcStaffReadyConfirmed.value === true,
            merchItems: mcItems.value.map((it) => {
              const sizesEnabled = it.sizesEnabled === true;
              const sizeStock = sizesEnabled ? (it.sizeStock || {}) : {};
              return {
                title: String(it.title || "").trim(),
                description: String(it.description || "").trim(),
                imageUrl: String(it.imageUrl || "").trim(),
                priceCents: Number(it.priceCents || 0),
                sizesEnabled,
                availableQty: sizesEnabled ? null : Number(it.availableQty || 0),
                sizeStock: sizesEnabled ? sizeStock : null,
              };
            }),
          }
        : { enabled: false },
      paymentButtons: paymentButtons.value.map((b) => {
        const mode = sanitizePricingMode(b.pricingMode);
        const minAmount = mode === "min" ? Number(b.minAmount || 5) : null;
        const fixedAmount =
          mode === "fixed" && b.fixedAmount != null && b.fixedAmount !== ""
            ? Number(b.fixedAmount)
            : null;
        const presetAmounts =
          mode === "presets"
            ? parsePresetAmounts(
                b.presetAmountsText != null
                  ? String(b.presetAmountsText)
                  : formatPresetAmounts(b.presetAmounts)
              )
            : [];
        return {
          key: b.key,
          title: b.title,
          description: b.description,
          badgeId: b.badgeId ?? null,
          enabled: b.enabled === true,
          pricingMode: mode,
          minAmount,
          fixedAmount,
          presetAmounts,
          shareEnabled: b.shareEnabled ?? true,
          unlockEnabled: b.unlockEnabled ?? false,
          supporterWallEligible: b.supporterWallEligible ?? true,
        };
      }),
      ...(newImageId
        ? { bandImg: newImageId }
        : bandImgId.value && { bandImg: bandImgId.value }),
      members: members.value.map((m) => ({
        name: m.name,
        instrument: m.instrument,
      })),
      ...normalizedSocial,
      ...normalizedStreaming,
      singlesong: singlesongPayload,
      singlevideo: singlevideoPayload,
    };

    // 4) Send update
    const put = await fetch(`${config.public.strapiUrl}/api/bands/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ data: payload }),
    });
    const pj = await put.json();
    if (!put.ok) throw pj;

   // ✅ get the current slug and do a full redirect (hard refresh)
let slug =
  pj?.data?.attributes?.slug ||
  pj?.data?.slug ||
  pj?.slug ||
  null;

if (!slug) {
  // fallback: refetch just the slug by id
  try {
    const r = await fetch(`${config.public.strapiUrl}/api/bands/${id}?fields[0]=slug`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    const j = await r.json();
    slug = j?.data?.attributes?.slug || null;
  } catch {}
}

if (slug && process.client) {
  // full page navigation → guarantees header is fresh
  window.location.replace(`/${slug}`);
  return;
}

// final fallback
if (process.client) window.location.reload();
  } catch (err) {
    console.error("❌ submitForm error:", err);
    alert(err?.error?.message || "Update failed");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.container-mdc {
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
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
}
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.mdc-text-field {
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
}
.mdc-text-field__input {
  width: 100%;
  padding: 0.75rem 0.5rem;
  border: 1px solid #000;
  border-radius: 10px;
  outline: none;
}
.mdc-floating-label {
  position: absolute;
  top: 0.75rem;
  left: 0.5rem;
  background: white;
  padding: 0 0.2em;
  transition:
    transform 0.2s,
    color 0.2s;
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
  background: #6200ee;
  transform: scaleX(0);
  transition: transform 0.2s;
}
.mdc-text-field__input:focus ~ .mdc-line-ripple {
  transform: scaleX(1);
}

.mdc-button,
.styled-file-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.mdc-button {
  background: #2c2c2c;
  color: #fff;
  border: none;
  margin-top: 1rem;
}
.mdc-button:hover {
  background: #3700b3;
}
.styled-file-input {
  display: none;
}
.styled-file-label {
  background: #2c2c2c;
  color: #fff;
}
.styled-file-label:hover {
  background: #3700b3;
}
.styled-file-label.w-full {
  width: 100%;
  text-align: center;
}
</style>
