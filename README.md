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