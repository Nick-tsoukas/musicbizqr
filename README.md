# MusicBizQR (MBQ)

A Nuxt 3 application for musicians featuring smart links, QR codes, fan analytics, and an Agency Portal for label/management teams.

---

## Agency Portal (V1.3)

A "label operating system" demo for managing artist rosters. Password-protected at `/agency`.

### Features

#### Core Pages
- **`/agency`** - Roster Inbox with triage buckets (Needs Action, Heating Up, Watching, Cooling)
- **`/agency/dashboard`** - Executive dashboard with widgets and Daily Brief strip
- **`/agency/artists/:bandId`** - Individual artist detail pages
- **`/agency/cities`** - City heat map and territory management
- **`/agency/signals`** - Signal feed with search, sort, filters, saved views
- **`/agency/tasks`** - Task management and accountability tracking
- **`/agency/admin`** - Roster management (add/edit bands, tiers, owners)
- **`/agency/team`** - Team member management

#### Dashboard Widgets
- **Roster Momentum Trend** - Sparkline chart of avg momentum index (7d/30d)
- **Platform Pull Mix** - Click distribution across Spotify/YouTube/Tickets/Instagram
- **City Heat Map** - Top cities by heat score with click-through
- **City Stacks** - Cities with multiple active artists
- **After-Show Lift** - Post-show engagement boost metrics
- **Top Movers** - Artists with highest velocity

#### Signal Types
| Type | Description |
|------|-------------|
| `CITY_CLAIM` | Artist dominating a city |
| `CITY_STACK` | Multiple roster artists heating in same city |
| `NEW_CITY_UNLOCKED` | New market detected |
| `MOMENTUM_SURGE` | Velocity spike above baseline |
| `AFTER_SHOW_ENERGY` | Post-show attention spike |
| `SHARE_CHAIN` | Active fan sharing |
| `ENGAGED_SESSIONS` | High engagement sessions |
| `RETURNING_FANS` | Repeat visitor intent |
| `PLATFORM_PULL` | Platform preference signal |
| `PEAK_HOUR` | Optimal posting window identified |
| `SOURCE_SURGE` | Traffic source spike |
| `MILESTONE_DROP` | Achievement unlocked |

#### Briefs System (Text-Only, No Integrations)
- **Daily Brief** - Roster summary (top movers, cities, tasks)
- **Weekly Deck Outline** - 6-slide executive summary
- **City Claim Brief** - Territory-specific report
- **Artist Momentum Pack** - Individual artist snapshot
- **Slack Update** - Single message format
- **Slack Thread Pack** - 4-message thread format

All briefs are copy-to-clipboard only. No Slack API, no PDF exports.

#### Queue UX (Signals Feed)
- **Search** - Band name, city, headline, proof (Cmd/Ctrl+K shortcut)
- **Sort** - Priority, Newest, Highest Score, Needs Action First, Unassigned First
- **Filter Chips** - High Priority, Needs Action Today, My Artists, Unassigned, City Claim, After-Show, Share Chain, New Cities
- **Owner/Tier Filters** - Dropdown filters
- **Saved Views** - My Queue, High Priority, Unassigned, City Claim Watch, After-Show Watch
- **Pagination** - 20 items + load more

#### OS Actions (Click-Through)
All dashboard widgets are clickable with deep link navigation:
- Top Movers → `/agency/artists/:bandId`
- City Heat Map → `/agency/cities?city={cityKey}`
- City Stacks → Opens city detail drawer
- Platform Pull Mix → `/agency/signals?type=PLATFORM_PULL&platform={platform}`
- After-Show Lift → `/agency/signals?type=AFTER_SHOW_ENERGY`
- Roster Momentum → `/agency/signals?sort=priority&chip=needsAction`

#### Trust Features (No NaN)
- **Safe Formatters** - `safeNumber()`, `safeInt()`, `safePercent()`, `safeDelta()`
- **Empty States** - Clear messaging when data is missing
- **Dev Validator** - Console warnings for invalid mock data (dev only)
- **Debug Panels** - 🐛 button on charts to inspect data (dev only)

### Key Files

```
pages/agency/
├── index.vue          # Inbox
├── dashboard.vue      # Dashboard
├── cities.vue         # Cities page
├── signals.vue        # Signals feed
├── tasks.vue          # Tasks
├── admin.vue          # Roster admin
├── team.vue           # Team management
└── artists/[bandId].vue  # Artist detail

components/agency/
├── AgencyLayout.vue   # Main layout with sidebar/bottom nav
├── AgencyMobileNav.vue
├── BriefsDrawer.vue   # Briefs generation drawer
├── CopyBlock.vue      # Reusable copy-to-clipboard block
├── DailyBriefStrip.vue
├── SignalFeedItem.vue
├── ProofDrawer.vue
├── CityDetailDrawer.vue
├── TaskRow.vue
└── dashboard/
    ├── RosterMomentumTrendCard.vue
    ├── PlatformPullMixCard.vue
    ├── HeatMapCard.vue
    ├── CityStackCard.vue
    ├── AfterShowLiftCard.vue
    └── TopMoversCard.vue

stores/
└── agencyPortal.js    # Pinia store with mock data + localStorage

utils/agencyPortal/
├── mockData.js        # Mock data generators
├── safeFormat.js      # Safe number formatters
├── validateMockData.js # Dev-only validator
├── briefGenerators.js # Brief text generators
└── formatters.js      # Display formatters
```

### localStorage Keys
- `mbq_agency_portal` - Main state persistence
- `agencySignalsSelectedView` - Saved view selection
- `agencyBriefWindow` - Brief window preference (7d/30d)
- `agencyBriefLastCityKey` - Last selected city for briefs
- `agencyBriefLastArtistId` - Last selected artist for briefs

---

## Backend Requirements (Future)

When swapping mock data for real API, implement these endpoints:

### Core Endpoints
```
GET  /api/agency/org                    # Organization details
GET  /api/agency/members                # Team members
GET  /api/agency/roster                 # All roster bands
POST /api/agency/roster                 # Add band to roster
PUT  /api/agency/roster/:bandId         # Update band (tier, owner, notes)
DELETE /api/agency/roster/:bandId       # Remove from roster

GET  /api/agency/signals                # Paginated signals feed
PUT  /api/agency/signals/:id/handle     # Mark signal handled
PUT  /api/agency/signals/:id/assign     # Assign owner
PUT  /api/agency/signals/:id/proof      # Add proof/notes

GET  /api/agency/tasks                  # All tasks
POST /api/agency/tasks                  # Create task
PUT  /api/agency/tasks/:id              # Update task
PUT  /api/agency/tasks/:id/complete     # Mark complete

GET  /api/agency/metrics/daily/:bandId  # Daily metrics for band
GET  /api/agency/metrics/roster-trend   # Roster momentum trend
GET  /api/agency/metrics/city-heat      # City heat scores
GET  /api/agency/metrics/platform-mix   # Platform click distribution
```

### Data Shapes

**Band Daily Metrics** (per day per band):
```js
{
  dateISO: "2026-01-13",
  sessions: 150,
  qrScans: 40,
  linkClicks: 90,
  engagedSessions: 50,
  returningFans: 25,
  shares: 15,
  paymentsCount: 3,
  platformClicks: { spotify: 35, youtube: 20, tickets: 15, instagram: 25 },
  topCity: { city: "Austin", region: "TX", country: "US" }
}
```

**Signal**:
```js
{
  id: "sig_001",
  type: "CITY_CLAIM",
  bandId: "band_001",
  score: 87,
  confidence: "strong",
  headline: "Austin is heating up",
  proof: "3x session increase in Austin",
  context: { city: "Austin", region: "TX" },
  windowLabel: "Last 7 days",
  createdAt: "2026-01-13T10:00:00Z",
  handled: false,
  ownerId: null
}
```

**Momentum Index Formula**:
```js
// Weighted sum of normalized metrics (0-100 scale)
sessions * 0.20 +
qrScans * 0.15 +
linkClicks * 0.20 +
engagedSessions * 0.15 +
returningFans * 0.10 +
shares * 0.10 +
paymentsCount * 0.10
```

### Signal Generation Logic
Signals should be generated server-side based on:
1. **Velocity thresholds** - 7-day vs 30-day comparison
2. **City concentration** - % of traffic from single city
3. **After-show detection** - Spike within 48h of event
4. **Platform pull** - Dominant platform clicks
5. **Suppression windows** - Don't repeat same signal type within window

### Authentication
- Password gate currently uses simple localStorage check
- For production: Use existing Strapi auth + role-based access
- Add `agencyMember` role with roster access

---

## Article Notes

[] updated Why MusicBizQR Is the Linktree Alternative Built for Musicians
  - musicbizqr.com/articles/qr-code-strategy/musicbizqr-vs-linktree-for-musicians
  - pillar page The Ultimate QR Code Strategy Guide for Musicians slug qr-code-strategy
  - The Best Linktree Alternative for Musicians: QR Codes, Music Embeds & Fan Analytics
  - https://musicbizqr.com/article/smart-links/best-music-smart-link-tools-2025
  - https://musicbizqr.com/article/smart-links/perfect-smart-link-page-musicians
  - What Are Music Smart Links? (And Why Every Artist Needs One in 2025
  - another aritlce  one more time 
  - The Smart Link Alternative Built for Bands
[] article creation 
  - What Are Smart Links for Musicians? The Complete 2026 Guide

## Need to Fix

 - [] TOC https://musicbizqr.com/article/smart-links/linktree-alternative-for-musicians
  - tried to fix  h
 - [] need another update https://musicbizqr.com/article/smart-links/smart-link-vs-linktree-musicians
 - fixed another toc issue romve toc  one more 

### Notes 
 - must fix this article at some point Smart Link vs Linktree: What Every Musician Should Know in 2026
 - fixed code on article page 
 - upgraded article again
- upgrading f fff f

---

## Smart Link Live Surface (V1 + V2)

A feature-flagged upgrade system that makes band pages feel alive, present-tense, and momentum-driven without adding social feed complexity.

### Quick Start (How to Demo)

1. Open `config/smartLinkFeatureFlags.js`
2. Set `SMARTLINK_LIVE_SURFACE_ENABLED = true`
3. Refresh any band page to see the new features
4. Toggle individual module flags to show/hide specific upgrades

**When `SMARTLINK_LIVE_SURFACE_ENABLED = false` (default), the page behaves exactly as before with zero layout shifts.**

### Feature Flags

```js
// config/smartLinkFeatureFlags.js

// Master switch - controls ALL live surface features
SMARTLINK_LIVE_SURFACE_ENABLED = false  // Set to true for demos

// V1 Module Toggles (only active when master switch is true)
SMARTLINK_SHOW_NOW_BANNER = true        // Contextual status banner
SMARTLINK_SHOW_LIVE_FEED = true         // Micro-signals display
SMARTLINK_SHOW_PAGE_MODES = true        // State machine (SHOW_DAY, POST_SHOW, QUIET)
SMARTLINK_SHOW_CONTINUE_CHIP = true     // "Continue on YouTube" for returning visitors
SMARTLINK_SHOW_FAN_TOASTS = true        // Recognition toasts after actions
SMARTLINK_SHOW_SUPPORT_MODULE_REFACTOR = true  // Consolidated payment section

// Demo Data Mode
DEMO_FEED_ENABLED = true                // Shows realistic demo data when real data is missing

// V2 Optional Features (requires V2_ENABLED = true)
SMARTLINK_V2_ENABLED = false
SMARTLINK_SHOW_MOMENT_BADGES = true     // Small chips ("New tonight", "Tour week")
SMARTLINK_SHOW_SHOW_DAY_HEADER = true   // Compact show day strip
SMARTLINK_SHOW_MOMENT_SHARE_CARD = true // Shareable moment preview
```

### V1 Components

#### NOW Banner (`NowBanner.vue`)
Contextual status banner below identity, above primary CTAs.

**States:**
| State | Trigger | Display |
|-------|---------|---------|
| `SHOW_TONIGHT` | Event within 24h | "Live Tonight" + venue/city + tickets CTA |
| `POST_SHOW_THANKS` | Event ended within 12h | "Thanks for coming out" + share CTA |
| `NEW_RELEASE` | `newReleaseDate` within 30d | "New Music" + listen CTA |
| `ON_TOUR` | 2+ upcoming events | "On Tour" + see dates CTA |
| `QUIET_DEFAULT` | Fallback | Band name + bio snippet |

**Auto-detection logic:**
```
if (event within 24h) → SHOW_TONIGHT
else if (event ended within 12h) → POST_SHOW_THANKS
else if (newReleaseDate within 30d) → NEW_RELEASE
else if (2+ upcoming events) → ON_TOUR
else → QUIET_DEFAULT
```

#### Live Feed (`LiveFeed.vue`)
Micro-signals showing recent activity. NOT a social feed—no usernames, no comments.

**Feed Item Types:**
| Type | Description | Icon |
|------|-------------|------|
| `SUPPORT_RECEIVED` | Payment in last 2h/24h | 💜 |
| `CITY_TUNING_IN` | Top city today or new city | 📍 |
| `HEATING_UP` | Activity spike (2x baseline) | 🔥 |
| `POST_SHOW_SPIKE` | Surge after show ends | 📈 |
| `MOST_CLICKED_LINK` | Top platform today | 🎵 |

**Rules:**
- Max 3 items displayed
- Items decay after 24h
- Demo data auto-populates when real data is missing

#### Page Modes (State Machine)
Affects CTA emphasis and subtle section reordering.

| Mode | Trigger | Effect |
|------|---------|--------|
| `SHOW_DAY` | Event within 24h | Tickets/Entry emphasized, events higher |
| `POST_SHOW` | Event ended within 12h | Share/Support emphasized |
| `QUIET` | Default | Listen/Follow emphasized |

#### Continue Chip (`ContinueChip.vue`)
For returning visitors—shows last clicked platform/media.

- Uses localStorage to track: last clicked platform, last played media
- Shows subtle chip: "Continue on YouTube" / "Continue listening"
- Dismissible (stays dismissed for 24h)
- 7-day expiry on stored data

#### Fan Toasts (`FanToast.vue`)
Recognition toasts after key actions.

**Triggers:**
| Action | Example Toast |
|--------|---------------|
| `follow` | "Following! Stay in the loop." |
| `save` | "Saved. Welcome back anytime." |
| `share` | "Shared — thanks for spreading the word." |
| `payment` | "You're supporting independent music." |

**Rules:**
- Rate-limited: 5s minimum between toasts
- Queue system for multiple actions
- 3s display duration

#### Support Module (`SupportModule.vue`)
Consolidated payment section with quick tip amounts.

- Quick tip buttons: $5, $10, $20 (with "Popular" badge)
- Expandable detailed payment options
- Auto-expands on `SHOW_DAY` mode
- Preserves all existing Stripe functionality

### V2 Components (Optional)

#### Moment Badges (`MomentBadges.vue`)
Small chips under NOW banner.

| Badge | Trigger |
|-------|---------|
| 🎤 New tonight | `hasShowTonight` |
| 🚐 Tour week | `isOnTour` |
| 🔥 Fresh release | `hasNewRelease` |
| 🎬 Fresh video | `hasNewVideo` |
| 👕 Merch drop | `hasMerchDrop` |

Max 3 badges displayed.

#### Show Day Header (`ShowDayHeader.vue`)
Compact strip only on `SHOW_DAY` mode.

```
[🔴 live] Tonight in Austin — The Fillmore    [Tickets]
```

#### Moment Share Card (`MomentShareCard.vue`)
Shareable preview card in share section.

**Types:** `you_were_here`, `support_received`, `heating_up`, `post_show`, `default`

### File Structure

```
config/
└── smartLinkFeatureFlags.js    # All feature flags

composables/
├── useSmartLinkPageMode.js     # Page mode state machine
├── useSmartLinkLiveFeed.js     # Live feed data + demo fallback
└── useSmartLinkLiveSurface.js  # Main integration composable

components/smartlink/
├── NowBanner.vue               # Contextual status banner
├── LiveFeed.vue                # Micro-signals display
├── ContinueChip.vue            # Return visitor chip
├── FanToast.vue                # Recognition toasts
├── SupportModule.vue           # Consolidated payments
├── MomentBadges.vue            # V2: Small chips
├── ShowDayHeader.vue           # V2: Show day strip
└── MomentShareCard.vue         # V2: Shareable card
```

### Backend TODOs

When implementing real data, add these fields/endpoints:

**Band Fields:**
```js
band.newReleaseDate      // Date - for NEW_RELEASE detection
band.nowBannerOverride   // String - manual banner state override
```

**Event Fields:**
```js
event.doorsTime          // String - "7:00 PM" for show day header
```

**Analytics Endpoint:**
```
GET /api/bands/:id/live-signals

Response:
{
  recentSupport: { amount: 20, timestamp: 1705000000000 },
  topCity: { name: "Austin", isNew: false, count: 45 },
  activitySpike: { multiplier: 2.5, timestamp: 1705000000000 },
  topLink: { platform: "Spotify", clicks: 120 }
}
```

### Integration Points

The Live Surface integrates with existing band page at:
- `pages/[bandSlug]/index.vue` - Main integration
- `onToggleSaveBand()` - Triggers save toast
- `handleFollowConfirm()` - Triggers follow toast
- Streaming link clicks - Records for Continue Chip

### Demo Data

When `DEMO_FEED_ENABLED = true` and real data is missing:
- Live feed shows realistic mock signals
- Signals vary based on page mode (SHOW_DAY gets "heating up", POST_SHOW gets "spike")
- Demo data is obvious in code but invisible to users

### Implementation Details

#### How It Works (Technical)

The Live Surface is implemented directly in `pages/[bandSlug]/index.vue` with feature flags imported from `config/smartLinkFeatureFlags.js`.

**Key Design Decisions:**
1. **No composable wrapper** - Feature flags and computed values are defined directly in the page component for simplicity and to avoid reactivity issues with composables inside computed properties.
2. **Direct flag imports** - All `SMARTLINK_*` flags are imported at the top of the script and used in computed properties.
3. **Demo data inline** - The `liveFeedItems` computed generates demo data directly when `DEMO_FEED_ENABLED` is true.

**State Detection Logic (in page component):**
```js
// NOW Banner State Detection
const nowBannerState = computed(() => {
  // 1. Check manual override from band data
  if (band.value?.data?.nowBannerOverride) return band.value.data.nowBannerOverride;
  
  // 2. Auto-detect from events
  if (event within 24h) return 'SHOW_TONIGHT';
  if (newReleaseDate within 30d) return 'NEW_RELEASE';
  if (2+ upcoming events) return 'ON_TOUR';
  return 'QUIET_DEFAULT';
});

// Page Mode Detection
const effectivePageMode = computed(() => {
  if (event within 24h) return 'SHOW_DAY';
  // TODO: POST_SHOW detection needs past events
  return 'QUIET';
});

// Demo Feed Items (varies by mode)
const liveFeedItems = computed(() => {
  // QUIET: city + trending link
  // SHOW_DAY: city + heating up
  // POST_SHOW: city + post-show spike
});
```

**Component Placement in Template:**
```
Bio/Tagline
  ↓
[ShowDayHeader] ← V2, only on SHOW_DAY mode
  ↓
[NowBanner] ← Always shows when enabled
  ↓
[MomentBadges] ← V2, chips under banner
  ↓
[ContinueChip] ← For returning visitors
  ↓
[LiveFeed] ← Micro-signals
  ↓
Main Content (Featured Song, etc.)
```

**DEV Indicator:**
- `DevIndicator.vue` shows "🔴 Live Surface: ON" badge in bottom-left
- Only visible when `SMARTLINK_LIVE_SURFACE_ENABLED = true` AND `NODE_ENV !== 'production'`
- Prevents accidentally leaving features enabled in production

#### File Locations

```
config/
└── smartLinkFeatureFlags.js    # All feature flags (master switch here)

pages/[bandSlug]/
└── index.vue                   # Main integration (flags, computed, template)

components/smartlink/
├── NowBanner.vue               # Contextual status banner
├── LiveFeed.vue                # Micro-signals display
├── ContinueChip.vue            # Return visitor chip
├── FanToast.vue                # Recognition toasts
├── SupportModule.vue           # Consolidated payments
├── DevIndicator.vue            # DEV-only badge
├── MomentBadges.vue            # V2: Small chips
├── ShowDayHeader.vue           # V2: Show day strip
└── MomentShareCard.vue         # V2: Shareable card
```

#### Adding New Features

1. Add flag to `config/smartLinkFeatureFlags.js`
2. Import flag in `pages/[bandSlug]/index.vue`
3. Create computed for visibility: `const showMyFeature = computed(() => SMARTLINK_LIVE_SURFACE_ENABLED && MY_FLAG)`
4. Add component to template with `v-if="showMyFeature"`

#### Testing Checklist

- [ ] `SMARTLINK_LIVE_SURFACE_ENABLED = false` → Page looks exactly like before
- [ ] `SMARTLINK_LIVE_SURFACE_ENABLED = true` → All enabled features appear
- [ ] Individual flags toggle features on/off
- [ ] Demo feed shows when `DEMO_FEED_ENABLED = true` and no real data
- [ ] DEV indicator only shows in development
- [ ] Fan toasts fire on save/follow actions
- [ ] Continue chip remembers last clicked link

---

# Smart Link Live Surface (V1 + V2)

A feature-flagged upgrade system that makes MBQ band pages feel **alive**, **present-tense**, and **momentum-driven** — without adding social feed complexity.

---

## Live Features (Built)

### 1) Live Surface System (Foundation)
A state-aware system that controls what the band page shows, emphasizes, or hides based on what's happening **right now**.

- Converts the Smart Link page from static → reactive
- Powers all present-tense + momentum features
- Designed to stay calm when nothing is happening

---

### 2) NOW Banner (Present-Tense Context)
A contextual status banner that answers:

> "What's happening with this band today?"

**States**
- SHOW_TONIGHT — event within 24 hours
- POST_SHOW_THANKS — event ended within 12 hours
- NEW_RELEASE — new release in last 30 days
- ON_TOUR — 2+ upcoming events
- QUIET_DEFAULT — fallback/calm mode

**Behavior**
- Auto-detected from band/events
- Can be manually overridden (future backend field)

---

### 3) Page Modes (Live State Machine)
A live state machine that subtly changes CTA emphasis and page behavior based on touring context.

**Modes**
- SHOW_DAY 
- POST_SHOW 
- QUIET 

**Effect**
- SHOW_DAY → Tickets/Entry emphasized, events rise higher
- POST_SHOW → Share/Support emphasized
- QUIET → Listen/Follow emphasized

---

### 4) Live Feed (Micro Momentum Signals)
A non-social micro-feed that displays **proof of momentum** without usernames, comments, or moderation.

**Signal Types**
- SUPPORT_RECEIVED — payment in last 2h/24h
- CITY_TUNING_IN — top city today or new city
- HEATING_UP — activity spike (2x baseline)
- POST_SHOW_SPIKE — surge after show ends
- MOST_CLICKED_LINK — top platform today

**Rules**
- Max **3** items shown
- Items decay after **24h**
- Calm by default (no spam/no noise)

---

### 5) Demo Feed Mode (Live Signal Simulator)
A realistic live-signal simulator used when real analytics data is missing.

**Behavior**
- Auto-populates live feed with realistic activity
- Varies signals based on page mode:
  - SHOW_DAY → heating up + city tuning in
  - POST_SHOW → post-show spike + support received
  - QUIET → calmer signals (most clicked link, city tuning in)

**Purpose**
- Enables clean internal demos without hacking code or real traffic

---

### 6) Continue Chip (Returning Fan Memory)
A returning-visitor feature that remembers where the fan last engaged.

**Examples**
- "Continue on YouTube"
- "Continue listening"

**Rules**
- Uses `localStorage` 
- Dismissible (dismiss state persists 24h)
- Stored data expires after 7 days

---

### 7) Fan Recognition Toasts (Live Feedback Loop)
Non-intrusive toasts that acknowledge fan actions.

**Triggers**
- Follow
- Save
- Share
- Payment intent

**Examples**
- "Following! Stay in the loop."
- "Saved. Welcome back anytime."
- "Shared — thanks for spreading the word."
- "You're supporting independent music."

**Rules**
- Rate-limited (min 5s between toasts)
- Queue system for multiple actions
- Auto-dismiss ~3 seconds
- No popups/modals (calm UX)

---

### 8) Support Module Refactor (Context-Aware Payments)
A consolidated "Support the Band" payment surface with quick tip options.

**Includes**
- Quick tip buttons: $5, $10, $20 (with optional "Popular" badge)
- Expandable advanced payment options
- Preserves all existing Stripe Connect payment functionality

**Live Behavior**
- Auto-expands on SHOW_DAY 
- Stays calmer/collapsed on QUIET 

---

## V2 Live Features (Optional / Feature-Flagged)

### 9) Moment Badges (Small Chips)
Small "moment chips" under the NOW banner to summarize current activity.

**Examples**
- New tonight
- Tour week
- Fresh release
- Fresh video
- Merch drop

**Rules**
- Max **3** badges displayed
- Auto-derived from band state

---

### 10) Show Day Header (Compact Strip)
A compact sticky-like strip that appears only on SHOW_DAY.

Example:
- `[ live] Tonight in Austin — The Fillmore    [Tickets]` 

Purpose:
- High-conversion show-day CTA
- Perfect for QR scans at shows

---

### 11) Moment Share Card (Shareable Preview)
A shareable preview card that appears inside the Share section.

**Types**
- you_were_here 
- support_received 
- heating_up 
- post_show 
- default 

Purpose:
- Turns momentum into something fans can share instantly

---

## Demo & Internal Controls (Quality-of-Life)

### 12) Feature Flags System
All Live Surface functionality is controlled via:
- Master enable/disable
- Per-module toggles
- V2 gated toggles
- Demo feed mode

Ensures:
- Safe rollout
- Zero layout shifts when disabled
- Easy demos + iteration

---

### 13) Demo Control Panel (Dashboard UI Toggles)
An internal Demo Controls UI (whitelisted users only) that allows:

- Turning Live Surface ON/OFF
- Toggling modules without editing code
- Enabling demo feed mode
- Enabling V2
- (Optional) forcing states for demos (e.g., SHOW_DAY, SHOW_TONIGHT)

---

## Why This Matters
MBQ Smart Links are no longer static "link-in-bio pages."

They are **Live Artist Surfaces** that:
- show present-tense context
- reflect momentum
- adapt to show/tour states
- acknowledge fans
- improve repeat engagement
- support monetization at the right moment

---

## Live Surface Documentation

### Overview
Live Surface transforms static band pages into dynamic, real-time experiences that adapt to tour states, fan activity, and momentum signals.

### Demo Pages
- **Smart Link Live Demo**: `/internal/demo/smart-link-live` - Complete Live Surface showcase
- **Demo Controls**: Available in dashboard for whitelisted users
- **Feature Flags**: Full control over Live Surface modules and states

### Style Guide

#### Band Page Styles
All band page templates now include Live Surface features:

| Style | Description | Live Surface Integration |
|-------|-------------|---------------------------|
| **Classic** | Full-width sections with detailed layouts | Complete integration |
| **Smart Link** | Live Surface features, responsive hero | Native Live Surface style |
| **Compact** | Modern grid layout, mobile-friendly | Overlay MomentBadges |
| **Bold** | Immersive hero, bento-grid streaming | Premium Live Surface experience |

#### Component Hierarchy
1. **MomentBadges** - Animated neon badges overlay on hero image
2. **ShowDayHeader** - "Tonight in Los Angeles • The Echo" style
3. **NOW Banner** - Contextual status banners (ON_TOUR, SHOW_TONIGHT, etc.)
4. **ContinueChip** - For returning visitors
5. **LiveFeed** - Real-time micro-signals
6. **SupportModule** - Enhanced support sections

#### Visual Design
- **Color Scheme**: Elite purple/red gradient theme
- **Typography**: Clean, modern sans-serif hierarchy
- **Animations**: Neon cyberpunk borders, smooth transitions
- **Responsive**: Mobile-first design with adaptive layouts
- **Accessibility**: High contrast, semantic HTML, ARIA labels

### Technical Implementation

#### Live Surface Components
```vue
<!-- Core Components -->
<MomentBadges :is-on-tour="true" :has-new-release="true" />
<ShowDayHeader :event="nextEvent" :has-pay-entry="true" />
<NowBanner state="ON_TOUR" :content="nowBannerContent" />
<ContinueChip :band-slug="band.slug" />
<LiveFeed :feed-items="liveFeedItems" display-mode="single" />
<SupportModule :band-name="band.name" :show-quick-tips="true" />
```

#### Data Structure
```javascript
// Live Feed Items
const liveFeedItems = [
  { id: 1, icon: '', copy: 'Los Angeles tuning in', type: 'city' },
  { id: 2, icon: '', copy: 'Turns Me On played', type: 'song_play' },
  { id: 3, icon: '', copy: 'New follower', type: 'new_follower' }
]

// NOW Banner Content
const nowBannerContent = {
  icon: '',
  headline: 'On Tour',
  subtext: '3 upcoming shows across the west coast',
  accent: 'purple',
  cta: 'See Dates',
  ctaAction: 'scroll-to-events'
}
```

#### Banner States
- **ON_TOUR** - Touring with upcoming shows
- **SHOW_TONIGHT** - Show happening today
- **NEW_RELEASE** - New music available
- **HEATING_UP** - Momentum spike detected
- **DEFAULT** - Standard state

### Interactive Features

#### MomentBadges
- **Animated Borders**: Purple neon cyberpunk infinite animation
- **Dynamic States**: Tour week, new release, heating up
- **Overlay Position**: Top-left of hero image
- **Responsive**: Adapts to all screen sizes

#### Live Feed
- **Real-time Updates**: Micro-signals from fan activity
- **Multiple Display Modes**: Single, multi, compact
- **Smart Filtering**: Relevant signals based on context
- **Engagement Metrics**: Track fan interactions

#### NOW Banner
- **Contextual Content**: Adapts to tour/release states
- **Interactive CTAs**: Scroll-to-events, share functionality
- **Color Themes**: Purple/red elite color scheme
- **Smooth Transitions**: State changes with animations

### Analytics & Tracking

#### Event Emissions
```javascript
// Component Events
@tickets="handleTicketClick"
@pay-entry="scrollToSupport"
@cta-click="handleBannerCta"
@scroll-to="handleScrollTo"
@share="handleShare"
@continue="handleContinueAction"
@quick-tip="handleSupport"
```

#### Fan Recognition
- **Toast Notifications**: Real-time fan acknowledgments
- **Activity Tracking**: Monitor engagement patterns
- **Return Visitor Detection**: Personalized experiences
- **Geographic Signals**: Location-based fan activity

### Configuration Options

#### Feature Flags
- `SMARTLINK_LIVE_SURFACE_ENABLED` - Master toggle
- `SMARTLINK_V2_ENABLED` - V2 components access
- `SMARTLINK_SHOW_MOMENT_BADGES` - Badge visibility
- `SMARTLINK_SHOW_SHOW_DAY_HEADER` - Header visibility
- `SMARTLINK_SHOW_LIVE_FEED` - Feed visibility
- `SMARTLINK_SHOW_SUPPORT_MODULE` - Support section

#### Demo Controls
- **Live Feed Mode**: Simulated activity for demos
- **State Override**: Force specific banner states
- **Module Toggles**: Enable/disable individual components
- **Style Variants**: Switch between band page styles

### Getting Started

#### For Developers
1. **Clone Repository**: `git clone [repo-url]`
2. **Install Dependencies**: `npm install`
3. **Run Development**: `npm run dev`
4. **Visit Demo**: `/internal/demo/smart-link-live`
5. **Enable Features**: Use demo controls in dashboard

#### For Bands
1. **Create Profile**: Choose Smart Link style during setup
2. **Upload Content**: Add music, images, tour dates
3. **Enable Live Surface**: Features activate automatically
4. **Customize**: Adjust colors, layout, content
5. **Share**: Distribute Smart Link to fans

### Best Practices

#### Design Guidelines
- **Consistent Branding**: Match band aesthetic
- **Clear Hierarchy**: Important information first
- **Mobile Priority**: Optimize for mobile viewing
- **Fast Loading**: Optimize images and assets

---

## Audio Player Style Guide

A design system for the featured song/audio player component used in band page templates.

### Component Structure

```html
<!-- Featured Song Card -->
<div class="bg-white/5 border border-white/10 rounded-xl p-4">
  <div class="flex items-center gap-4">
    <!-- Album Art with Play Button Overlay -->
    <div class="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
      <img src="[album-art]" alt="Album art" class="w-full h-full object-cover" />
      <div class="absolute inset-0 flex items-center justify-center bg-black/40">
        <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Track Info + Progress -->
    <div class="min-w-0 flex-1">
      <div class="text-white font-semibold truncate">Track Title</div>
      <div class="text-white/60 text-sm">New Single • 3:24</div>
      <!-- Progress Bar -->
      <div class="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
        <div class="h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>
    </div>
  </div>
</div>
```

### Design Tokens

#### Container
| Property | Value | Description |
|----------|-------|-------------|
| Background | `bg-white/5` | 5% white opacity |
| Border | `border border-white/10` | 10% white border |
| Radius | `rounded-xl` | 12px border radius |
| Padding | `p-4` | 16px padding |

#### Album Art
| Property | Value | Description |
|----------|-------|-------------|
| Size | `w-14 h-14` | 56x56px |
| Radius | `rounded-lg` | 8px border radius |
| Overlay | `bg-black/40` | 40% black overlay |

#### Play Button
| Property | Value | Description |
|----------|-------|-------------|
| Size | `w-8 h-8` | 32x32px |
| Background | `bg-white/20 backdrop-blur` | Frosted glass effect |
| Shape | `rounded-full` | Circle |
| Icon | `w-4 h-4 text-white ml-0.5` | Centered play triangle |

#### Typography
| Element | Classes | Description |
|---------|---------|-------------|
| Track Title | `text-white font-semibold truncate` | Bold, truncates on overflow |
| Subtitle | `text-white/60 text-sm` | 60% opacity, small |

#### Progress Bar
| Property | Value | Description |
|----------|-------|-------------|
| Track | `h-1 bg-white/10 rounded-full` | 4px height, subtle background |
| Fill | `bg-gradient-to-r from-purple-500 to-pink-500` | Purple→Pink gradient |

### Variants

#### Compact (Default)
- Album art: 56x56px (`w-14 h-14`)
- Play button: 32x32px (`w-8 h-8`)
- Single row layout

#### Large
- Album art: 64x64px (`w-16 h-16`)
- Play button: 48x48px (`w-12 h-12`)
- Larger text sizes

```html
<!-- Large Variant -->
<div class="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
  <!-- ... -->
  <div class="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
    <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
</div>
```

### Interactive States

#### Hover
```css
/* Container hover */
hover:bg-white/10

/* Play button hover */
hover:bg-white/30
hover:scale-105
```

#### Playing State
```html
<!-- Replace play icon with pause -->
<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
</svg>

<!-- Animate progress bar -->
<div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"></div>
```

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Purple 500 | `#8b5cf6` | Progress bar start, accents |
| Pink 500 | `#ec4899` | Progress bar end |
| White/5 | `rgba(255,255,255,0.05)` | Card background |
| White/10 | `rgba(255,255,255,0.1)` | Borders, progress track |
| White/20 | `rgba(255,255,255,0.2)` | Play button background |
| White/40 | `rgba(255,255,255,0.4)` | Album art overlay |
| White/60 | `rgba(255,255,255,0.6)` | Subtitle text |

### Accessibility

- Play button has sufficient contrast (white on dark)
- `truncate` prevents text overflow issues
- Semantic HTML structure
- Add `aria-label="Play track"` to play button
- Add `role="progressbar"` to progress element

### Usage Example

```vue
<template>
  <div class="bg-white/5 border border-white/10 rounded-xl p-4">
    <div class="flex items-center gap-4">
      <div class="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
        <img :src="albumArt" :alt="`${trackTitle} album art`" class="w-full h-full object-cover" />
        <button 
          @click="togglePlay"
          class="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
        >
          <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition">
            <svg v-if="!isPlaying" class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </div>
        </button>
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-white font-semibold truncate">{{ trackTitle }}</div>
        <div class="text-white/60 text-sm">{{ subtitle }}</div>
        <div class="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
```
- **Accessibility**: Semantic HTML, ARIA labels

#### Content Strategy
- **Real-time Updates**: Keep tour dates current
- **Fan Engagement**: Respond to activity signals
- **Momentum Building**: Leverage heating up states
- **Cross-platform**: Link to streaming/social
- **Call-to-action**: Clear next steps for fans

### Related Resources

#### Documentation
- **Component API**: Detailed props and events
- **Styling Guide**: CSS classes and theming
- **Integration Guide**: Adding to existing pages
- **Migration Guide**: Upgrading from static pages

#### Support
- **Demo Pages**: Interactive examples
- **Code Repository**: Source code and examples
- **Community**: Developer discussions
- **Issues**: Bug reports and feature requests

---

## Corvana Deck System

A multi-deck presentation system for conference-ready demos and investor pitches. Built with Nuxt 3, Vue 3, and TailwindCSS.

### Overview

Corvana is a slide deck renderer that dynamically loads components and demo data to create interactive presentations. Each deck is defined as a JavaScript object with slides that can be narrative text, mobile device previews, or full dashboard views.

### Quick Start

```bash
# Navigate to a deck
http://localhost:3000/corvana/decks/mbq-flagship-elite
```

### Deck Structure

```javascript
// corvana/decks/flagshipDeck_elite.js
export const flagshipDeck_elite = {
  slug: 'mbq-flagship-elite',
  title: 'MBQ Flagship ELITE',
  subtitle: 'Live Artist Surfaces + Momentum Intelligence',
  slides: [
    {
      id: 1,
      type: 'narrative',
      chapter: 'Opening',
      content: {
        headline: 'MusicBizQR',
        subhead: 'Live Artist Surfaces',
        body: 'Static pages don\'t build careers.',
        speakerNotes: 'Opening hook...'
      }
    },
    {
      id: 2,
      type: 'mobile_view',
      chapter: 'Demo: Surface',
      content: {
        componentKey: 'SmartLinkSurface',
        demoDataKey: 'demo_band_neon_avenue',
        speakerNotes: 'Show the live surface...'
      }
    },
    {
      id: 3,
      type: 'dashboard_view',
      chapter: 'Demo: Analytics',
      content: {
        componentKey: 'BandAnalyticsOverview',
        speakerNotes: 'Flash the analytics...'
      }
    }
  ]
}
```

### Slide Types

| Type | Description | Content Fields |
|------|-------------|----------------|
| `narrative` | Text-only slide | `headline`, `subhead`, `body`, `speakerNotes` |
| `mobile_view` | Component in mobile device frame | `componentKey`, `demoDataKey`, `speakerNotes` |
| `dashboard_view` | Full-width component | `componentKey`, `demoDataKey`, `speakerNotes` |

### Component Registry

Components are registered in `corvana/decks/componentRegistry.js`:

```javascript
import { defineAsyncComponent } from 'vue'

const ShareablesShowcase = defineAsyncComponent(() => 
  import('~/corvana/decks/ShareablesShowcase.vue')
)

export const componentRegistry = {
  'ShareablesShowcase': {
    component: ShareablesShowcase,
    buildProps: (demoDataKey) => {
      // Return props for the component
      return {}
    }
  }
}
```

### Adding a New Slide Component

1. **Create the component** in `corvana/decks/`:
```vue
<!-- corvana/decks/MyComponent.vue -->
<template>
  <div class="my-component">
    <!-- Component content -->
  </div>
</template>

<script setup>
// Component logic
</script>
```

2. **Register in componentRegistry.js**:
```javascript
const MyComponent = defineAsyncComponent(() => 
  import('~/corvana/decks/MyComponent.vue')
)

// Add to componentRegistry object:
'MyComponent': {
  component: MyComponent,
  buildProps: (demoDataKey) => {
    const data = getDemoData(demoDataKey)
    return { /* props */ }
  }
}
```

3. **Add to deck slides**:
```javascript
{
  id: 8,
  type: 'dashboard_view',
  chapter: 'Demo: My Feature',
  content: {
    componentKey: 'MyComponent',
    demoDataKey: 'demo_band_neon_avenue',
    speakerNotes: 'Explain the feature...'
  }
}
```

### Demo Data

Demo data is stored in `corvana/demo/demoData.js`:

```javascript
export const demoData = {
  'demo_band_neon_avenue': {
    band: { name: 'Neon Avenue', genre: 'Indie Rock', ... },
    events: [...],
    analytics: {...}
  }
}

export function getDemoData(key) {
  return demoData[key] || demoData['demo_band_neon_avenue']
}
```

### Deck Viewer Features

- **Keyboard Navigation**: Arrow keys, spacebar, N/P keys
- **Speaker Notes Panel**: Toggle with 'S' key or button
- **Progress Bar**: Shows current position in deck
- **Chapter Labels**: Display current section
- **Fullscreen Mode**: F11 or fullscreen button

### Key Files

```
corvana/
├── decks/
│   ├── deckIndex.js           # Deck registry
│   ├── componentRegistry.js   # Component registry
│   ├── flagshipDeck_elite.js  # Main demo deck
│   ├── ShareablesShowcase.vue # Shareables demo component
│   ├── LiveFeedEnhanced.vue   # Live feed demo
│   ├── PulseMuse.vue          # Pulse/Muse demo
│   └── MobileViewport.vue     # Mobile device frame
├── demo/
│   └── demoData.js            # Demo data store
└── pages/corvana/decks/
    └── [id].vue               # Deck viewer page
```

---

## Share Drawer System

A unified share experience across all MBQ surfaces with real-time image generation and preview.

### Overview

Share drawers provide a consistent sharing experience for bands and fans. When opened, they generate the actual share image and display it as a preview before sharing.

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ShareDrawer` | `components/band/ShareDrawer.vue` | Band page sharing |
| `MomentShareDrawer` | `components/band/MomentShareDrawer.vue` | Fan moment sharing |
| `ShareCustomizeDrawer` | `components/shareables/ShareCustomizeDrawer.vue` | Shareable card customization |

### Share Image Generation

All drawers use `useShareKit` composable for image generation:

```javascript
import { useShareKit } from '~/composables/useShareKit'

const {
  generateFanShareImage,    // Fan moment images
  generateShareCardImage,   // Shareable card images
  webShare,                 // Native Web Share API
  copyToClipboard,          // Clipboard operations
  downloadBlob,             // Image download
  openFacebookSharer,       // Facebook sharing
} = useShareKit()
```

### Image Preview Flow

1. **Drawer opens** → `watch(isOpen)` triggers
2. **Generate image** → `getOrGenerateImage()` creates 1080x1080 canvas
3. **Create preview URL** → `URL.createObjectURL(blob)`
4. **Display preview** → Shows actual share image in drawer
5. **User shares** → Same image used for share action

```javascript
// Generate preview when drawer opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && !previewImageUrl.value) {
    generatingPreview.value = true
    try {
      const blob = await getOrGenerateImage()
      if (blob) {
        previewImageUrl.value = URL.createObjectURL(blob)
      }
    } finally {
      generatingPreview.value = false
    }
  }
}, { immediate: true })
```

### Share Actions

| Action | Method | Description |
|--------|--------|-------------|
| Share Now | `webShare()` | Native share sheet (mobile) or copy+download fallback |
| Copy Link | `copyToClipboard()` | Copy band URL to clipboard |
| Copy Caption | `copyToClipboard()` | Copy generated caption |
| Download Image | `downloadBlob()` | Download share image as PNG |
| Instagram Kit | Download + copy caption | Ready for Instagram Stories |
| Facebook | `openFacebookSharer()` | Open Facebook share dialog |

### Caption Styles

Drawers support multiple caption styles:

```javascript
const captionVariants = [
  { key: 'hype', label: '🔥 Hype' },
  { key: 'chill', label: '😎 Chill' },
  { key: 'flex', label: '💪 Flex' },
]
```

### Props Reference

#### ShareDrawer
```javascript
props: {
  isOpen: Boolean,
  bandId: Number,
  bandSlug: String,
  bandName: String,
  bandImageUrl: String,
  isBandNameInLogo: Boolean,
}
```

#### MomentShareDrawer
```javascript
props: {
  isOpen: Boolean,
  bandId: Number,
  bandSlug: String,
  bandName: String,
  bandImageUrl: String,
  headline: String,      // Moment headline
  subtext: String,       // Moment subtext
  fanPosition: String,   // Fan position (e.g., "Early Supporter #12")
  captions: Object,      // { hype, chill, flex }
  momentType: String,    // DEFAULT, SUPPORT, CITY, etc.
}
```

### Styling

Share drawers use consistent styling:

```css
/* Drawer container */
.fixed.bottom-0.left-0.right-0.z-[101]
.bg-gray-950.border-t.border-white/10.rounded-t-3xl

/* Share image preview */
.aspect-square.max-h-56.mx-auto
.rounded-xl.overflow-hidden.bg-black/40.border.border-white/10

/* Share button */
.bg-gradient-to-r.from-purple-600.to-violet-600
.hover:from-purple-500.hover:to-violet-500
```

### Z-Index Layers

| Element | Z-Index |
|---------|---------|
| Backdrop | 100 |
| Drawer | 101 |
| Toast | 102 |
| Speaker Notes | 10001 |

---

## Shareables System

Auto-generated shareable content cards for bands and fans.

### Shareable Types

| Type | Description | Trigger |
|------|-------------|---------|
| `MILESTONE_DROP` | Achievement unlocked | Follower/stream milestones |
| `CITY_CLAIM` | City domination | High activity in city |
| `HEATING_UP` | Momentum spike | 2x baseline activity |
| `SUPPORT_MOMENT` | Fan support receipt | After payment |
| `YOU_WERE_HERE` | Show attendance | Post-show |

### Components

```
components/shareables/
├── ShareablesFeed.vue         # Feed of shareable cards
├── ShareableCard.vue          # Individual card display
├── ShareableMomentCard.vue    # Moment-specific card
├── ShareCustomizeDrawer.vue   # Customization drawer
└── ShareableHeroCard.vue      # Featured card display
```

### Feed Integration

```vue
<ShareablesFeed
  :band-id="band.id"
  :band-name="band.name"
  :band-slug="band.slug"
  :band-image-url="band.imageUrl"
/>
```

### Card Data Structure

```javascript
{
  id: 'share_001',
  type: 'MILESTONE_DROP',
  title: 'First 1,000 Streams',
  primaryStat: '1,000',
  secondaryStat: 'streams this week',
  windowLabel: 'This Week',
  accent: 'violet',  // violet, blue, emerald, amber, rose
  share: {
    captions: {
      hype: '🔥 Just hit 1,000 streams!',
      grateful: '🙏 Thank you for 1,000 streams',
      tease: '👀 Something\'s happening...'
    },
    shareUrl: 'https://mbq.link/band-slug'
  },
  band: {
    id: 1,
    name: 'Neon Avenue',
    slug: 'neon-avenue',
    imageUrl: '/path/to/image.jpg'
  }
}
```

---

## Stripe & Signup Integration

### Overview

MusicBizQR uses Stripe for subscription billing with a 30-day free trial. The integration spans both the Nuxt frontend and the Strapi backend.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Nuxt)                         │
├─────────────────────────────────────────────────────────────────┤
│  pages/signup.vue          → Email/password signup form         │
│  pages/login.vue           → Login form                         │
│  composables/useSignup.ts  → registerUser() helper              │
│  composables/useFirebase.ts→ Google OAuth login                 │
│  pages/account.vue         → Subscription status & billing      │
│  pages/dashboard.vue       → Trial info display                 │
│  components/PastDueBanner.vue → Past due payment warning        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NUXT SERVER (API Routes)                     │
├─────────────────────────────────────────────────────────────────┤
│  server/api/stripe/confirm-social.ts                            │
│    → Handles Google/social signup                               │
│    → Creates Strapi user + Stripe customer + trial              │
│                                                                 │
│  server/utils/stripe-trial.ts                                   │
│    → createStripeCustomerAndTrial() utility                     │
│    → Creates Stripe customer with metadata                      │
│    → Creates subscription with 30-day trial                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STRAPI BACKEND                             │
├─────────────────────────────────────────────────────────────────┤
│  /api/stripe/register      → Email/password registration        │
│  /api/stripe/billing       → Get billing info                   │
│  /api/stripe/subscription-status → Get subscription status      │
│  /api/stripe/create-billing-portal-session → Stripe portal      │
│                                                                 │
│  User fields:                                                   │
│    - customerId (Stripe customer ID)                            │
│    - subscriptionId (Stripe subscription ID)                    │
│    - trialEndsAt (ISO date string)                              │
│    - subscriptionStatus (trialing/active/past_due/etc)          │
└─────────────────────────────────────────────────────────────────┘
```

### Signup Flows

#### Email/Password Signup
1. User fills form on `/signup`
2. `useSignup().registerUser()` calls Strapi `/api/stripe/register`
3. Strapi creates user + Stripe customer + 30-day trial subscription
4. User is redirected to `/signupSuccess`

#### Google OAuth Signup
1. User clicks "Continue with Google" on `/signup` or `/login`
2. `useFirebase().loginWithGoogle()` authenticates with Firebase
3. Nuxt server `/api/stripe/confirm-social` is called
4. Creates/finds Strapi user + creates Stripe customer + trial
5. Returns JWT, user is redirected to `/dashboard`

### Key Files

| File | Purpose |
|------|---------|
| `composables/useSignup.ts` | `registerUser(name, email, password)` - calls Strapi registration |
| `composables/useFirebase.ts` | `loginWithGoogle()` - Firebase + Strapi + Stripe flow |
| `server/api/stripe/confirm-social.ts` | Social login handler - creates user + Stripe trial |
| `server/utils/stripe-trial.ts` | `createStripeCustomerAndTrial()` - Stripe API calls |
| `pages/signup.vue` | Signup form with loading state |
| `pages/login.vue` | Login form with loading state |
| `pages/account.vue` | Account settings + subscription status |
| `components/PastDueBanner.vue` | Past due payment warning banner |

### Environment Variables

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_xxx          # Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_live_xxx     # Stripe publishable key
STRIPE_DEFAULT_PRICE_ID=price_xxx      # Default subscription price ID

# Strapi
STRAPI_URL=https://your-strapi.com     # Strapi backend URL
```

### Subscription States

| Status | Description | UI Behavior |
|--------|-------------|-------------|
| `trialing` | 30-day free trial active | Shows days remaining |
| `active` | Paid subscription active | Normal access |
| `past_due` | Payment failed | Shows PastDueBanner, prompts payment |
| `canceled` | Subscription canceled | Limited access |
| `unpaid` | Multiple failed payments | Shows PastDueBanner |

### Trial Flow

1. **Day 0**: User signs up → 30-day trial starts
2. **Days 1-29**: Full access, dashboard shows "X days left"
3. **Day 30**: Trial ends, Stripe attempts first charge
4. **If payment succeeds**: Status → `active`
5. **If payment fails**: Status → `past_due`, PastDueBanner shown

### Billing Portal

Users can manage their subscription via Stripe's hosted billing portal:
- Update payment method
- View invoices
- Cancel subscription

Accessed via:
- `/account` → "Manage Billing Info" button
- `PastDueBanner` → "Pay Now" button

Both call Strapi `/api/stripe/create-billing-portal-session` which returns a Stripe portal URL.

### Stripe Customer Metadata

When creating a Stripe customer, we store:
```js
{
  email: user.email,
  name: user.username,
  metadata: {
    appUserId: String(user.id)  // Strapi user ID for webhook lookups
  }
}
```

### Stripe Webhook Handler

The webhook is handled by the **Strapi backend** at `https://qrserver-production.up.railway.app/api/stripe/webhook`.

**Location:** `qrdb/src/api/subscription/controllers/subscription.js`

**Handled Events:**
| Event | Action |
|-------|--------|
| `checkout.session.completed` | Sets status to `trialing` or `active` |
| `invoice.payment_succeeded` | Sets status to `active` |
| `invoice.payment_failed` | Sets status to `pastDue`, starts grace period |
| `customer.subscription.updated` | Syncs status, plan, trial end date |
| `customer.subscription.deleted` | Sets status to `canceled` |

**Environment Variables (Strapi):**
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret from Stripe Dashboard

### Potential Improvements

1. **Grace Period**: Allow brief grace period after trial ends before restricting access
2. **Email Notifications**: Send trial ending reminders at 7 days, 3 days, 1 day
3. **Proration**: Handle plan upgrades/downgrades with proration
4. **Multiple Plans**: Support different pricing tiers

### Debugging

**Check subscription status:**
```js
// In browser console on dashboard
const token = useStrapiToken().value
const client = useStrapiClient()
const status = await client('/stripe/subscription-status', {
  headers: { Authorization: `Bearer ${token}` }
})
console.log(status)
```

**Stripe Dashboard:**
- View customers: https://dashboard.stripe.com/customers
- View subscriptions: https://dashboard.stripe.com/subscriptions
- Test webhooks: https://dashboard.stripe.com/webhooks

---

## Bot & Spam Protection

### Honeypot Fields

Forms use invisible honeypot fields to detect bots. Bots auto-fill all fields including hidden ones, while real users never see them.

| Form | Honeypot Field | Location |
|------|----------------|----------|
| Signup | `website` | `pages/signup.vue` |
| Contact | `company` | `pages/contact.vue` |

### How It Works

1. Hidden field positioned off-screen (`-left-[9999px]`)
2. Real users never see or fill it
3. Bots auto-fill all form fields
4. If honeypot is filled → bot detected → fake success response

### Implementation

```vue
<!-- Hidden honeypot field -->
<div class="absolute -left-[9999px]" aria-hidden="true">
  <label for="website">Website</label>
  <input
    id="website"
    v-model="formData.website"
    type="text"
    tabindex="-1"
    autocomplete="off"
  />
</div>
```

```js
// Check honeypot before processing
if (formData.value.website) {
  console.log('Bot detected via honeypot');
  // Fake success to not alert the bot
  await new Promise(resolve => setTimeout(resolve, 2000));
  await router.push('/signupSuccess');
  return;
}
```

### Why Honeypot vs reCAPTCHA

- **Zero friction** for real users
- **No external dependencies** (no API keys)
- **Bots don't know they failed** (fake success)
- **Simple to implement** and maintain