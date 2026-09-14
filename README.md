# Ivy Homes — Property Explorer

A Next.js frontend built against the Ivy Homes property API for Gurgaon. Browse sale listings, rentals, and builder projects with filters, maps, saved listings, and a full insights dashboard — all computed from raw data because the documented analytics endpoint doesn't exist.

**Tools used:** Next.js 16, React 19, TanStack Query, Tailwind CSS, Leaflet, shadcn/ui, Google Antigravity.

## Screenshots

| Login | Listings |
|:---:|:---:|
| ![Login](public/screenshots/login.png) | ![Listings](public/screenshots/listings.png) |

| Rentals | Projects |
|:---:|:---:|
| ![Rentals](public/screenshots/rentals.png) | ![Projects](public/screenshots/projects.png) |

| Insights | Saved |
|:---:|:---:|
| ![Insights](public/screenshots/insights.png) | ![Saved](public/screenshots/saved.png) |

---

## How to run it

```bash
# 1. Clone
git clone https://github.com/ravikant717/ivy_assignment.git
cd ivy_assignment

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local 
cp .env.example .env
```

Edit `.env.local` and `.env` with your credentials:


```env
IVY_BASE_URL=https://solve.ivy.homes
IVY_API_KEY=IVYXX-XXXXXXXXXXX
IVY_EMAIL=demo1@ivy.homes
IVY_PASSWORD=XXXXXXXXXXX

NEXT_PUBLIC_APP_URL=http://localhost:3000

BETTER_AUTH_SECRET=XXXXXXXXXXX
BETTER_AUTH_URL=http://localhost:3000 

DATABASE_URL = 'mongodb+srv://db_user:XXXXXXXXXX@cluster0.u0cfbcy.mongodb.net/?appName=Cluster0'
```

```bash
# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in with any of the three demo accounts (`demo1@ivy.homes`, `demo2@ivy.homes`, `demo3@ivy.homes`) using the password from your registration email.

**Note:** The app handles 15-minute token expiry automatically via `/auth/refresh` — sessions survive well past 30 minutes without re-login.

---

## How I figured out what to distrust

The assignment says the docs were AI-generated from an old changelog and never reviewed. So my starting assumption was: _everything could be wrong, but the API itself is honest._ The API's error messages are genuinely helpful — they tell you exactly what you did wrong.

### Step 1: Hit the obvious walls first

I pointed a Python fetch script at the API following the docs exactly. It failed immediately:

- **`?api_key=...` → 401.** The error message literally said "send your key in the X-API-Key request header, not as a query parameter." That was the very first lie. Took 10 seconds to find.
- **`?page=2` returned the same data as `?page=1`.** The response envelope had `offset`, `limit`, `count`, `has_more` — not `page`, `page_size`, `total`. So pagination was offset-based, not page-based, and `page` was silently ignored.
- **`?limit=200` only returned 50 rows.** Capped at 50, not 200.

These were the freebies. Any agent or script would catch them in the first run. The interesting part started after that.

### Step 2: Don't trust `total`, trust `has_more`

The API reports `total: 3200` for listings, but I kept paginating past that with `offset` increments until `has_more` came back `false`. The actual count was **3500**. Same pattern with rentals (reported 1207, actual 1320) and projects (reported 366, actual 400).

This was the first thing that required a _choice_ — do I trust `total` and stop, or do I keep going? I kept going because the statement says "the API is honest" and `has_more: true` is the API telling me there's more. The `total` field is the one that lies.

### Step 3: Check what "active" means

The docs say `/v1/listings` "returns active sale listings" and "inactive, expired and withdrawn listings are excluded server-side." But the response objects have an `is_live` field, which is weird if they're all supposed to be active. I counted — **708 out of 3500 listings had `is_live: false`**. The server doesn't filter them out; you have to.

### Step 4: The units problem (this is where it got interesting)

The docs claim all areas are in square feet and all prices are in rupees (integers). Both claims are partially wrong.

**Areas — MagicHomes is in square metres.** I noticed this when a 3 BHK apartment had `carpet_area: 93`. That's a closet in square feet, not an apartment. It was a MagicHomes listing. I filtered all MagicHomes listings and every single one had carpet areas in the 70–140 range — textbook square metre values for Indian apartments. Multiply by 10.7639 and you get normal sqft numbers. Non-MagicHomes listings were all in the 600–2500 sqft range. The split was clean and per-website.

**Prices — six listings are in thousands.** Six listings had prices like 5200 or 14620 for multi-bedroom properties. A 2 BHK for ₹14,620 doesn't exist anywhere in Gurgaon. These are prices in thousands of rupees (i.e., ₹14,620 × 1000 = ₹1.46 Cr). Exactly six, no ambiguity.

**Project prices — Lakhs and Crores mixed.** This one was trickier. Project `price_min` and `price_max` are floats, not integers, and they're in a mixed denomination. Values ≥ 10 are in Lakhs (multiply by 1,00,000), values < 10 are in Crores (multiply by 1,00,00,000). I figured this out by cross-referencing project price ranges against the actual listing prices for properties tagged with those `project_id`s. A project claiming `price_max: 5.83` next to apartments listed at ₹5.8 Cr confirmed it.

### Step 5: Finding the fakes

This was the hardest part and the one I'm most unsure about.

The statement says "some of these listings are not real — they exist to generate enquiries." I looked at descriptions first. There's a cluster of listings with nearly identical boilerplate text — phrases like "Owner moving abroad," "Urgent sale," "Price negotiable for a quick sale." These aren't unique seller descriptions; they're templates designed to generate leads. I found **79 listings** with these patterns.

What made me more confident: these fake listings are priced about 35% below comparable properties in the same locality and BHK bracket. And 69 of the 79 have `is_verified: true`, which doesn't make sense if verification means "our ops team checked the listing." You don't verify a fake.

I flagged them based on description pattern matching + pricing anomaly. I can't be 100% sure my list is complete or that every one is genuinely fake, but the pattern is consistent.

### Step 6: Finding the corrupt ones

These were more mechanical. I wrote constraint checks across all 3500 listings:

- **Negative prices (6):** A property can't cost less than zero.
- **Floor > total floors (6):** You can't be on floor 25 of a 20-story building.
- **Carpet area > super built-up area (6):** Carpet area is always ≤ super built-up area. That's what the words mean.
- **Swapped lat/lon (6):** Coordinates with latitude around 77° and longitude around 28° — those are flipped. Gurgaon is at ~28°N, ~77°E.
- **0-bedroom non-plots (6):** A `bedroom: 0` apartment doesn't make sense (studios would be listed as 1 BHK in Indian real estate).

30 corrupt listings total, distributed in groups of exactly 6 per category. The neatness of that is suspicious — it feels deliberately planted — and that's kind of the point. These are honeypots. The API itself is "honest and healthy" as the statement says, but the _data_ has traps seeded into it to test whether you actually look. The corrupt records are the easy honeypots — straightforward constraint violations that any validation script catches. The fake listings (Step 5) are the harder ones — they look plausible at first glance, have real-looking addresses and contact numbers, but the descriptions are templated bait and the pricing is consistently ~35% below market. The fact that 69 of 79 fakes are `is_verified: true` is almost certainly intentional too — it's testing whether you blindly trust a "verified" flag or actually inspect the data behind it.

### Step 7: The endpoints that don't exist

- `/v1/analytics/summary` → 404. I built the entire insights dashboard from raw data instead.
- `/v1/listing/{id}` (singular) → 404. The working path is `/v1/listings/{id}` (plural).
- `/v1/listings/{id}/similar` → 404. I considered building a client-side similar-listings engine but deprioritized it.
- `/v1/favourites` → 404 on all routes. Saved listings are managed in localStorage per user and also in MongoDB.

---

## What I checked that turned out to be fine

These are the hypotheses that didn't produce findings. I think they're worth listing because they shaped what I _didn't_ waste time on.

### "Maybe the sort parameters are broken for listings too"

I tested every permutation of sort parameter names I could think of — `sort_by=price&order=asc`, `sort=price`, `sort=price:asc`, `order_by=price_asc`, and several others (see `scratch/test_price_params.js`). For listings, `sort_by` and `order` work as documented. The sorting _is_ broken for projects (because it sorts on the raw mixed-denomination floats), but listings sort correctly.

### "Maybe price filters are silently ignored"

I tested `min_price`, `max_price`, `minPrice`, `maxPrice`, `price_min`, `price_max`, and other variations against the upstream API. `min_price` and `max_price` work correctly on `/v1/listings`. The `bhk`, `locality`, and `furnishing` filters also work as documented. I ended up implementing client-side filtering anyway for reliability, but the server-side filters for listings are honest.

### "Maybe there are more duplicates"

I grouped all 3500 listings by `(apartment_name, floor, total_floors, bedroom, carpet_area)` expecting to find many duplicates. I found exactly **one pair** — the same unit in Adarsh Crest listed on two different portals at different prices. I tried looser groupings (dropping floor, or using just name + bedrooms) but those matched different units in the same complex, not actual duplicates. So: 3500 records, 3499 unique properties, 1 duplicate. I was expecting more.

### "Maybe rental prices are also in wrong units"

After finding the listing price issues, I checked rentals for the same patterns — prices suspiciously low or in wrong denominations. Rentals look clean. All rental prices are in rupees, all areas are in the expected range. The only rental-specific quirk is the field name `super_builtup_area` (no underscore) versus `super_built_up_area` in listings — a schema inconsistency, not a data quality issue.

### "Maybe the timestamps are in UTC as documented"

The docs say ISO 8601 UTC with `Z` suffix. The actual timestamps have no `Z` and look like local time. I confirmed by comparing them against the `/health` endpoint's server clock (which does carry an explicit `+05:30` offset). The listing timestamps are IST without any timezone indicator. I initially assumed they might be UTC and that the offset didn't matter much, but it creates a 5.5-hour shift that matters for questions like "listings posted in the last 7 days."

### "Maybe there's a search/keyword filter I'm missing"

I tried `search=Godrej`, `q=Godrej`, `keyword=Godrej`, `apartment_name=Godrej`, `query=Godrej` against the listings endpoint . None of them actually filter — they all return the full dataset. There's no text search. If I wanted search, it'd have to be client-side.

### "Maybe the `is_verified` flag is meaningful for filtering fakes"

It isn't. 69 out of 79 fake listings are marked `is_verified: true`. The flag is unreliable for fraud detection.

---

## What I'd do with another two days

### Better fake detection

My current approach uses description pattern matching and pricing anomalies. It catches the obvious template-based fakes, but I suspect there are more sophisticated ones — listings with unique-looking descriptions but suspicious contact patterns (same phone number across many listings, or phone numbers shared with known fakes). I started looking at `posted_by_contact` clustering but ran out of time. Two days would let me build a proper multi-signal scoring model.


### Improve the insights dashboard

The insights page computes everything from raw JSON files on disk. It works, but it's doing a lot of computation on every page load (even with caching). I'd move the heavy aggregation to a build-time or background computation step, cache the results, and add time-series trend data that updates periodically.

### Property chatbot

A conversational interface where users can ask things like "show me 3 BHK apartments under 1.5 Cr in Sector 65" or "what's the average price per sqft in Golf Course Road" and get filtered results or computed answers back. The data is already normalized and sitting in memory — wiring it to an LLM with function-calling (or even a simpler intent parser) to translate natural language into filter queries would make the app significantly more useful than clicking through dropdowns.

### Test edge cases in auth flow

I hardened the auth flow significantly after reviewing it (race conditions between refresh and logout, expired token hydration, etc.), but I'd want to stress-test the edge cases — what happens when the refresh token itself expires, or when two tabs try to refresh simultaneously. The current implementation handles the happy path and the most likely failure modes.

### Better map experience

Leaflet works but it's showing the basic tile layer. I'd add clustering for dense areas, custom markers that show price on hover, and fix the 6 listings with swapped coordinates so they don't show up in the wrong hemisphere.
