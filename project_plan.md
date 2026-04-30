# Triprodeo - AI-Powered Travel Platform

## 1. Project Description
Triprodeo is a premium AI-powered travel discovery and booking platform focused on curated weekend getaways (resorts, villas, experiences). It connects customers, hotel owners, agents, and affiliates in a single ecosystem. The brand feel is a mix of Airbnb + luxury resort.

**Target Users:** Travelers seeking premium weekend escapes, hotel owners/hosts, travel agents, and affiliates.
**Core Value:** Fast discovery → instant booking with AI personalization, high trust, and strong conversion.

---

## 2. Page Structure
- `/` - Homepage
- `/search` - Search Results Page
- `/property/:id` - Property Detail Page
- `/booking/:id` - Booking Flow (future)
- `/ai-planner` - AI Trip Planner (future)
- `/experiences` - Experiences Page (future)
- `/dashboard` - User Dashboard (future)
- `/become-host` - Become a Host Page (future)
- `/partners` - Partner / Agent Page (future)
- `/about` - About Page (future)
- `/contact` - Contact Page (future)
- `/login` - Login / Signup (future)

---

## 3. Core Features
- [x] Homepage with hero search, collections, trending stays, AI planner teaser, featured properties, reviews, loyalty section, newsletter
- [x] Search Results page with list/map toggle, filters, scarcity tags
- [x] Property Detail page with gallery, amenities, reviews, booking widget
- [ ] Booking flow (multi-step checkout)
- [ ] AI Trip Planner (chat UI)
- [ ] Experiences marketplace
- [ ] User dashboard
- [ ] Become a Host page
- [ ] Partner/Agent page
- [ ] About page
- [ ] Contact page
- [ ] Login/Signup

---

## 4. Data Model Design
No Supabase connected - using mock data for Phase 1.

---

## 5. Backend / Third-party Integration Plan
- Supabase: Future - user auth, bookings, host listings
- Shopify: Not needed
- Stripe: Future - payment processing
- Others: Google Maps embed for map views

---

## 6. Development Phase Plan

### Phase 1: Core Pages (Current)
- Goal: Build Homepage, Search Results, and Property Detail pages with rich mock data
- Deliverable: Fully designed, navigable 3-page website with premium UI

### Phase 2: Booking Flow
- Goal: Multi-step booking flow with payment options
- Deliverable: 3-step checkout, confirmation page

### Phase 3: AI Trip Planner + Experiences
- Goal: Chat UI for AI planning, experiences marketplace
- Deliverable: Functional UI for AI planner and experiences page

### Phase 4: User Accounts & Dashboard
- Goal: Auth with Supabase, user dashboard
- Deliverable: Login, signup, my bookings, saved trips, wallet

### Phase 5: Host & Partner Pages
- Goal: Onboarding for hosts, agents, affiliates
- Deliverable: Become a Host, Partner/Agent pages
