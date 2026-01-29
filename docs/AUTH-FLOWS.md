# MusicBizQR Authentication & Signup Flows

> **Last Updated:** January 28, 2026  
> **Purpose:** Complete documentation of all signup, login, Stripe, and email flows

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Flow 1: Google OAuth Signup/Login](#flow-1-google-oauth-signuplogin)
3. [Flow 2: Email/Password Signup](#flow-2-emailpassword-signup)
4. [Flow 3: Email/Password Login](#flow-3-emailpassword-login)
5. [Stripe Customer Management](#stripe-customer-management)
6. [Email Configuration](#email-configuration)
7. [Environment Variables](#environment-variables)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [API Endpoints Reference](#api-endpoints-reference)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Nuxt)                              │
│                    https://musicbizqr.com                            │
├─────────────────────────────────────────────────────────────────────┤
│  composables/useFirebase.ts    → Google OAuth via Firebase           │
│  composables/useSignup.ts      → Email/Password signup               │
│  server/api/stripe/confirm-social.ts → Nuxt server route for OAuth   │
│  server/utils/stripe-trial.ts  → Stripe customer/subscription helper │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Strapi)                              │
│              https://qrserver-production.up.railway.app              │
├─────────────────────────────────────────────────────────────────────┤
│  /api/stripe/register          → Email/Password signup + Stripe      │
│  /api/stripe/confirm-social    → Google OAuth (Strapi route)         │
│  /api/auth/local               → Standard Strapi login               │
│  /api/auth/local/register      → Standard Strapi register (BROKEN)   │
│  /api/user-admin/*             → Custom API for user management      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow 1: Google OAuth Signup/Login

### Overview
Users click "Continue with Google" → Firebase handles OAuth → Nuxt server creates/logs in user

### Detailed Flow

```
1. User clicks "Continue with Google" button
   └── File: pages/signup.vue or pages/login.vue
   └── Calls: loginWithGoogle() from composables/useFirebase.ts

2. Firebase OAuth Popup
   └── File: composables/useFirebase.ts
   └── Signs out first (forces account picker)
   └── Sets prompt: 'select_account' 
   └── Calls: signInWithPopup(auth, provider)
   └── Returns: { email, displayName, uid }

3. Nuxt Server Route
   └── File: server/api/stripe/confirm-social.ts
   └── Endpoint: POST /api/stripe/confirm-social (NUXT, not Strapi)
   └── Receives: { email, name, uid, provider: 'google' }

4. User Lookup
   └── Calls: GET /api/user-admin/by-email/:email (Strapi)
   └── Uses: STRAPI_API_TOKEN for auth
   └── File: qrdb/src/api/user-admin/controllers/user-admin.js

5a. EXISTING USER:
   └── Try login with Firebase-derived password: uid + '_firebaseA1!'
   └── If login fails, update password via PUT /api/user-admin/:id
   └── Check if user has Stripe customer, create if missing
   └── Return JWT

5b. NEW USER:
   └── Register via POST /api/user-admin/register (bypasses email issues)
   └── Login to get JWT
   └── Create Stripe customer (with deduplication check)
   └── Create 30-day trial subscription
   └── Update user with Stripe data
   └── Return JWT

6. Client Completion
   └── Set JWT token via strapiAuth.setToken()
   └── Fetch user data via strapiAuth.fetchUser()
   └── Redirect to /dashboard
```

### Key Files
| File | Purpose |
|------|---------|
| `qr/composables/useFirebase.ts` | Firebase OAuth client-side |
| `qr/server/api/stripe/confirm-social.ts` | Nuxt server route |
| `qr/server/utils/stripe-trial.ts` | Stripe customer/subscription helper |
| `qrdb/src/api/user-admin/controllers/user-admin.js` | Custom Strapi API |

### Password Generation
Google OAuth users get a reproducible password:
```javascript
const password = uid + '_firebaseA1!'
// Example: 'abc123xyz_firebaseA1!'
```

---

## Flow 2: Email/Password Signup

### Overview
User fills form → Direct call to Strapi → Creates user + Stripe customer + trial

### Detailed Flow

```
1. User fills signup form
   └── File: pages/signup.vue
   └── Fields: email, password

2. Frontend Call
   └── File: composables/useSignup.ts
   └── Calls: POST {strapiUrl}/api/stripe/register
   └── Body: { name: email, email, password }

3. Strapi Endpoint
   └── File: qrdb/src/api/subscription/controllers/subscription.js
   └── Function: register()

4. Validation
   └── Check if user already exists (return error if so)
   └── Validate required fields

5. Stripe Customer (with deduplication)
   └── Check: stripe.customers.list({ email, limit: 1 })
   └── If exists: use existing customer
   └── If not: stripe.customers.create({ email, name })

6. Stripe Subscription
   └── stripe.subscriptions.create({
         customer: customer.id,
         items: [{ price: STRIPE_DEFAULT_PRICE_ID }],
         trial_period_days: 30
       })

7. Create Strapi User
   └── username: email
   └── email: email
   └── password: (hashed)
   └── provider: 'local'
   └── confirmed: true (auto-confirm since email is broken)
   └── role: 'authenticated'

8. Send Confirmation Email (best-effort)
   └── Uses: EMAIL_DEFAULT_FROM env var
   └── From: no-reply@musicbizqr.com
   └── FAILS SILENTLY if email doesn't send

9. Update User with Stripe Data
   └── customerId, subscriptionId, subscriptionStatus, trialEndsAt

10. Return Response
    └── { user: { id, email }, message: '...' }

11. Frontend shows success, user must LOGIN separately
```

### Key Files
| File | Purpose |
|------|---------|
| `qr/pages/signup.vue` | Signup form |
| `qr/composables/useSignup.ts` | API call helper |
| `qrdb/src/api/subscription/controllers/subscription.js` | register() function |
| `qrdb/src/api/subscription/routes/subscription.js` | Route definition |

---

## Flow 3: Email/Password Login

### Overview
Standard Strapi login via /api/auth/local

### Detailed Flow

```
1. User enters email/password
   └── File: pages/login.vue

2. Strapi Auth Module
   └── Calls: POST /api/auth/local
   └── Body: { identifier: email, password }

3. Strapi Validates
   └── Finds user by email
   └── Checks provider = 'local'
   └── Verifies password hash
   └── Checks confirmed = true

4. Returns JWT
   └── { jwt: '...', user: {...} }

5. Client stores JWT and redirects to dashboard
```

### IMPORTANT: Provider Field
- Users created via email/password have `provider: 'local'`
- The login endpoint ONLY works for `provider: 'local'` users
- Google OAuth users are set to `provider: 'local'` so they can also use password login

---

## Stripe Customer Management

### Deduplication Logic
ALL signup flows now check for existing Stripe customers AND subscriptions before creating:

```javascript
// Step 1: Check for existing customer
const existingCustomers = await stripe.customers.list({ email, limit: 1 });
if (existingCustomers.data.length > 0) {
  customer = existingCustomers.data[0];  // Use existing
  
  // Step 2: Check for existing active/trialing subscription
  const existingSubs = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 1 });
  if (existingSubs.data.length > 0 && 
      (existingSubs.data[0].status === 'active' || existingSubs.data[0].status === 'trialing')) {
    subscription = existingSubs.data[0];  // Use existing subscription
  }
} else {
  customer = await stripe.customers.create({ email, name });  // Create new
}

// Step 3: Only create subscription if none exists
if (!subscription) {
  subscription = await stripe.subscriptions.create({ ... });
}
```

### Stripe Fields on User
| Field | Type | Description |
|-------|------|-------------|
| `customerId` | string | Stripe customer ID (cus_xxx) |
| `subscriptionId` | string | Stripe subscription ID (sub_xxx) |
| `subscriptionStatus` | enum | trialing, active, pastDue, canceled, unpaid |
| `trialEndsAt` | datetime | When trial expires |

### Where Stripe Customers Are Created
1. **Nuxt** `server/utils/stripe-trial.ts` - Google OAuth (frontend route)
2. **Strapi** `api/subscription/controllers/subscription.js` - Email/Password signup
3. **Strapi** `api/stripe/controllers/stripe.js` - confirmSocial, createCustomer

---

## Email Configuration

### Provider: Resend
- Configured in: `qrdb/config/env/production/plugins.js`
- API Key: `RESEND_API_KEY` env var

### Settings
```javascript
email: {
  config: {
    provider: 'strapi-provider-email-resend',
    providerOptions: { apiKey: env('RESEND_API_KEY') },
    settings: { 
      defaultFrom: env('EMAIL_DEFAULT_FROM'),      // no-reply@musicbizqr.com
      defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO') // support@musicbizqr.com
    },
  },
},
```

### KNOWN ISSUE: Strapi Built-in Register
The built-in `/api/auth/local/register` endpoint uses its own email settings and defaults to `strapi.io` domain, which is NOT verified in Resend. This causes 500 errors.

**Solution:** Use custom `/api/user-admin/register` endpoint which does NOT send emails.

### Email Sending Locations
| Location | From Address | Works? |
|----------|--------------|--------|
| `/api/stripe/register` | `EMAIL_DEFAULT_FROM` | ✅ Yes |
| `/api/auth/local/register` | `strapi.io` (hardcoded) | ❌ No |
| Custom endpoints | N/A (no email sent) | ✅ Yes |

---

## Environment Variables

### Frontend (Nuxt) - Railway
```bash
STRAPI_URL=https://qrserver-production.up.railway.app
STRAPI_API_TOKEN=<same as backend>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_DEFAULT_PRICE_ID=price_...
```

### Backend (Strapi) - Railway
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_DEFAULT_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...
EMAIL_DEFAULT_FROM=no-reply@musicbizqr.com
EMAIL_DEFAULT_REPLY_TO=support@musicbizqr.com

# Auth
JWT_SECRET=<secret>
STRAPI_API_TOKEN=<must match frontend>

# Database
DATABASE_URL=postgresql://...
```

### CRITICAL: STRAPI_API_TOKEN
The `STRAPI_API_TOKEN` must be **identical** in both frontend and backend. The custom `user-admin` API validates this token directly.

---

## Common Issues & Solutions

### Issue 1: 401 Unauthorized on user lookup
**Cause:** `STRAPI_API_TOKEN` mismatch between frontend and backend
**Solution:** Copy token from Strapi backend to frontend env vars

### Issue 2: 500 Error on registration
**Cause:** Strapi's `/api/auth/local/register` tries to send email with `strapi.io` domain
**Solution:** Use custom `/api/user-admin/register` endpoint

### Issue 3: Google login always uses same account
**Cause:** Firebase caches the signed-in user
**Solution:** Call `signOut(auth)` before `signInWithPopup` and set `prompt: 'select_account'`

### Issue 4: Duplicate Stripe customers
**Cause:** No deduplication check before creating customers
**Solution:** Always call `stripe.customers.list({ email })` first

### Issue 7: Duplicate Stripe subscriptions
**Cause:** Even with customer deduplication, subscriptions were always created new
**Solution:** Check `stripe.subscriptions.list({ customer })` for active/trialing subscription before creating

### Issue 5: User can't login after Google signup
**Cause:** `provider` field was set to `'google'` but login requires `'local'`
**Solution:** Always set `provider: 'local'` for all users

### Issue 6: Username has random suffix
**Cause:** Username was generated with timestamp
**Solution:** Use email as username for all signup flows

---

## API Endpoints Reference

### Custom User Admin API (Strapi)
**Base:** `/api/user-admin`  
**Auth:** `Authorization: Bearer <STRAPI_API_TOKEN>`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/by-email/:email` | Find user by email |
| PUT | `/:id` | Update user fields |
| POST | `/register` | Create user (no email sent) |

### Stripe API (Strapi)
**Base:** `/api/stripe`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/register` | None | Email/password signup |
| POST | `/confirm-social` | None | Google OAuth (Strapi route) |
| GET | `/subscription-status` | JWT | Get subscription status |
| GET | `/billing` | JWT | Get billing info |
| POST | `/create-billing-portal-session` | JWT | Stripe portal URL |

### Nuxt Server Routes
**Base:** `/api/stripe`

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/confirm-social` | Google OAuth handler (Nuxt route) |

---

## Testing Checklist

### Google OAuth Signup
- [ ] Account picker shows every time
- [ ] New user created with email as username
- [ ] Stripe customer created (check for duplicates)
- [ ] 30-day trial subscription created
- [ ] User redirected to dashboard
- [ ] User can logout and login again

### Email/Password Signup
- [ ] Duplicate email rejected
- [ ] Stripe customer created (check for duplicates)
- [ ] 30-day trial subscription created
- [ ] User marked as confirmed: true
- [ ] Success message shown
- [ ] User can login with same credentials

### Login
- [ ] Correct credentials work
- [ ] Wrong password rejected
- [ ] Non-existent user rejected
- [ ] JWT stored correctly
- [ ] User data fetched after login

---

## File Reference Map

```
qr/ (Frontend - Nuxt)
├── composables/
│   ├── useFirebase.ts          # Google OAuth
│   └── useSignup.ts            # Email signup helper
├── pages/
│   ├── signup.vue              # Signup page
│   └── login.vue               # Login page
├── server/
│   ├── api/stripe/
│   │   └── confirm-social.ts   # Google OAuth Nuxt route
│   └── utils/
│       └── stripe-trial.ts     # Stripe helper
└── plugins/
    └── firebase..ts            # Firebase init

qrdb/ (Backend - Strapi)
├── config/
│   └── env/production/
│       └── plugins.js          # Email, upload, users-permissions config
├── src/api/
│   ├── user-admin/
│   │   ├── controllers/user-admin.js   # Custom user API
│   │   ├── routes/user-admin.js        # Routes
│   │   └── services/user-admin.js      # Empty service
│   ├── stripe/
│   │   ├── controllers/stripe.js       # Stripe endpoints
│   │   └── routes/stripe.js            # Routes
│   └── subscription/
│       ├── controllers/subscription.js  # register(), webhook
│       └── routes/subscription.js       # Routes
└── src/extensions/
    └── users-permissions/
        └── strapi-server.js    # Custom auth policy
```

---

*This document should be updated whenever auth flows are modified.*
