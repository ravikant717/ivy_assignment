# Ivy Homes Property API — Reference (Corrected)

**Version 1.4 (Audited) · Base URL: `https://solve.ivy.homes`**

> **Fixed & Audited Reference**  
> Written based on empirical network audits, running service behavior, and discovery findings from [findings.txt](file:///d:/ivy_project/docs/findings.txt).  

---

## Overview of Critical Discrepancies

The original `API_REFERENCE.md` was drafted from legacy changelogs and contains major contradictions with the live API. Below is the summary of essential differences:

| Domain | Documented in Old Reference | Actual Live API Behavior | Impact / Action Required |
|---|---|---|---|
| **Auth Key** | Query parameter `?api_key=...` | Request Header `X-API-Key: <key>` | Query param returns `401 Unauthorized`. Must send `X-API-Key` header. |
| **Token Lifetime** | 24 Hours (`86400`s), no refresh | 15 Minutes (`900`s), with `/auth/refresh` | Token expires quickly. Frontend must refresh or re-authenticate. |
| **Logout** | "Invalidates the current token server side" | Returns `{"ok": true, "note": "tokens are stateless; discard them client side"}`. Tokens remain valid. | **Not server-side**. Client must discard tokens from storage. |
| **City Scope** | Unspecified / Bangalore examples | **Gurugram / Gurgaon (City ID: 6)** | All data belongs to 10 Gurgaon localities, not Bangalore. |
| **Pagination** | `page` (1-indexed) & `limit` up to 200 | **`offset`** (0-indexed) & `limit` (max 50) | `page` is completely ignored. `limit` is capped at 50 records. |
| **Total Counts** | `total` is exact count | `total` is under-reported; stop only on `has_more: false` | Paging halts prematurely if relying on `total`. Page until `has_more: false`. |
| **Active Listings** | Returns only active listings | Returns both active & inactive (`is_live: false`) | 708 listings are inactive. Must filter by `is_live === true`. |
| **Listing Units** | All areas in sqft, prices in INR | Mixed units (sqm in MagicHomes; prices in thousands for 6 listings) | MagicHomes areas are in $\text{m}^2$ ($\times 10.7639$ needed). |
| **Project Prices** | Integer Rupees | **Floats in mixed units ($\ge 10$ Lakhs, $< 10$ Crores)** | Values $\ge 10$ are Lakhs, values $< 10$ are Crores ($5.83 = \text{₹}5.83\text{ Cr}$). |
| **Rental Schema** | `super_built_up_area` | `super_builtup_area` (missing underscore) | Schema field name mismatch between listings and rentals. |
| **Analytics Endpoint** | `GET /v1/analytics/summary` | **HTTP 404 Not Found** (Does not exist) | Must compute summary aggregates client-side or via internal proxy. |
| **Verified Fraud** | `is_verified` means vetted by ops | 69 out of 79 fake enquiry bait listings are `is_verified: true` | Cannot rely solely on `is_verified` to filter spam / fake listings. |
| **Timestamps** | ISO 8601 UTC with `Z` suffix | ISO 8601 local **IST (+05:30)** without `Z` | Server timestamps are in Indian Standard Time (`Asia/Kolkata`). |

---

## Authentication

Every request to the API requires two identifiers: an **API key** and, for user-scoped actions, a **Bearer token**.

### 1. API Key Header

The API key must be sent as an HTTP header:

```http
X-API-Key: IVY26-XXXXXXXXXXXX
```

> ⚠️ **Correction**: Passing `?api_key=...` in the query string is rejected with `401 Unauthorized` (`"detail": "send your key in the X-API-Key request header"`).

Your key is automatically scoped to **City ID: 6 (Gurgaon / Gurugram)**. There is no `city` query parameter on the upstream API.

### 2. User Session & Login

#### `POST /auth/login`

**Request Body**
```json
{
  "email": "demo1@ivy.homes",
  "password": "<your issued key password>"
}
```

**Response `200 OK`**
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "email": "demo1@ivy.homes",
    "name": "Demo User"
  }
}
```

> ⚠️ **Correction**:
> 1. The token field is returned as `access_token` (alongside `refresh_token`).
> 2. `expires_in` is **900 seconds (15 minutes)**, NOT 24 hours (`86400`).
> 3. Tokens expire quickly; clients must handle expiration using the refresh flow.

Subsequent authenticated requests must include the header:
```http
Authorization: Bearer <access_token>
```

#### `POST /auth/refresh`

Refreshes an expired access token using the `refresh_token`:

**Request Body**
```json
{
  "refresh_token": "<your refresh token>"
}
```

**Response `200 OK`**
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

#### `POST /auth/logout`

Calls the logout endpoint.

> ⚠️ **CRITICAL CORRECTION (NOT SERVER-SIDE)**:  
> The original documentation claimed `POST /auth/logout` *"Invalidates the current token server side."*  
>
> In reality, **logout is NOT server-side**. The endpoint returns:
> ```json
> {
>   "ok": true,
>   "note": "tokens are stateless; discard them client side"
> }
> ```
> The server does not track or revoke active tokens (tokens are stateless JWTs). After calling `/auth/logout`, both the `access_token` and `refresh_token` remain cryptographically valid until their expiry time, and can still successfully make authenticated requests and refresh tokens.
>
> **Action Required**: Client applications must discard tokens client-side (e.g. from cookies, `localStorage`, and application memory) to effectively log the user out.

**Demo Accounts**: `demo1@ivy.homes`, `demo2@ivy.homes`, `demo3@ivy.homes` (share the same password issued with your API key).

---

## Conventions & Data Reality

| Concept | Documented Rule | Actual Live Data Reality |
|---|---|---|
| **City Scope** | Generic / Bangalore examples | City ID: `6` (**Gurgaon**), spanning 10 localities: `dlf phase 3`, `dwarka expressway`, `golf course road`, `mg road`, `new gurgaon`, `sector 49`, `sector 56`, `sector 65`, `sector 82`, `sohna road`. |
| **Money** | Integer INR everywhere | **Listings**: Mostly integer INR, but 6 listings have negative prices and 6 listings have prices scaled down by 1,000 (in thousands).<br>**Projects**: Floats in mixed units ($\ge 10$ Lakhs, $< 10$ Crores). |
| **Area** | Integer Sq Ft everywhere | **MagicHomes** listings (`website: "magichomes"`) report `carpet_area` and `super_built_up_area` in **Square Metres ($\text{m}^2$)** ($\sim 70-130\text{ m}^2$). Convert via $\times 10.7639$. |
| **Timestamps** | ISO 8601 UTC with `Z` | ISO 8601 string without `Z`, representing local **IST (UTC+05:30)**. |
| **Dates** | `YYYY-MM-DD` | `YYYY-MM-DD` |
| **Strings** | Lowercase | Lowercase for `locality`, `furnishing`, `property_type`, `project_status`. |

---

## Pagination & Collections

Collection endpoints (`/v1/listings`, `/v1/rentals`, `/v1/projects`) use **`offset`** and **`limit`**.

### Query Parameters

| Parameter | Type | Default | Constraint | Notes |
|---|---|---|---|---|
| `offset` | int | `0` | $\ge 0$ | 0-indexed record offset. |
| `limit` | int | `50` | Max `50` | Maximum limit is 50. Requests for $>50$ are capped at 50. |
| `page` | int | — | **Ignored** | Passing `?page=2` is silently ignored and returns `offset=0`. |

### Response Envelope

```json
{
  "limit": 50,
  "offset": 0,
  "count": 50,
  "total": 3200,
  "has_more": true,
  "results": [ ... ]
}
```

### Paging Termination Rules

> ⚠️ **CRITICAL CORRECTION**:  
> The `total` field returned by the API is an **under-reported estimate**, NOT the true count:
> - **Listings**: Reports `total: 3200`, but actually yields **3,500 records**.
> - **Rentals**: Reports `total: 1207`, but actually yields **1,320 records**.
> - **Projects**: Reports `total: 366`, but actually yields **400 records**.
>
> **Never terminate pagination when `offset + limit >= total`.** You must paginate strictly until **`has_more === false`** (or `results.length === 0`).

---

## Listings

### `GET /v1/listings`

Retrieves property sale listings for Gurgaon.

#### Query Parameters

| Parameter | Type | Notes |
|---|---|---|
| `offset`, `limit` | int | See Pagination (`limit` max 50). |
| `locality` | string | Exact match, lowercase (e.g. `golf course road`, `sector 65`). |
| `bhk` | int | Number of bedrooms (`1`, `2`, `3`, `4`). |
| `property_type` | string | `apartment`, `villa`, `independent house`, `plot`, `builder floor`. |
| `min_price`, `max_price` | int | Price in INR. |
| `furnishing` | string | `unfurnished`, `semi-furnished`, `fully-furnished`. |
| `sort_by` | string | `price`, `carpet_area`, `posted_at`, `bedroom`. |
| `order` | string | `asc` or `desc`. |

#### Data Quality & Filtering Gotchas

1. **Inactive Listings (`is_live`)**:
   The endpoint returns both active and inactive listings. Of 3,500 total retrievable listings, **708 listings have `is_live: false`**. Only **2,792 are active**. Frontend interfaces must filter `is_live === true`.
2. **Duplicate Physical Properties**:
   Across 3,500 listing records, there are **3,499 distinct physical properties**. Exactly 1 physical unit appears duplicated across competing portals:
   - *Adarsh Crest, Floor 19, 4 BHK, 1579 sqft*: `MAG-6000753` (MagicHomes) and `DWE-6003269` (Dwelling).
3. **Corrupt Records (30 Records)**:
   Seeded physical impossibilities that should be sanitized:
   - *Negative Price (6)*: `100-6001461`, `100-6002071`, `DWE-6002663`, `MAG-6000631`, `SQU-6003044`, `ZER-6000669`.
   - *Floor > Total Floors (6)*: `100-6000323`, `100-6001968`, `DWE-6001015`, `DWE-6002846`, `MAG-6000453`, `SQU-6001477`.
   - *Carpet Area > Super Built-up Area (6)*: `100-6000338`, `DWE-6000010`, `MAG-6000527`, `MAG-6001135`, `MAG-6002834`, `ZER-6000468`.
   - *Swapped Coordinates (6)*: `100-6001475`, `DWE-6000627`, `MAG-6000014`, `SQU-6002204`, `SQU-6002405`, `ZER-6001341` (Lat $> 76^\circ$, Lon $< 29^\circ$).
   - *0 Bedrooms on Non-Plot (6)*: `MAG-6000212`, `MAG-6000248`, `SQU-6000001`, `SQU-6001628`, `SQU-6001836`, `SQU-6002130`.
4. **Fake / Clickbait Listings (79 Records)**:
   Listings containing boilerplate lead-generation lines (*"Owner moving abroad, priced to sell"*, *"Urgent sale - owner relocating"*, *"Price negotiable for a quick sale"*) priced ~35% below market rate. **69 of them have `is_verified: true`**, so `is_verified` cannot be used as a guarantee of authenticity.
5. **MagicHomes Area Normalization**:
   Listings where `website === "magichomes"` report areas in square metres ($\text{m}^2$). Multiply by $10.7639$ to convert to square feet.
6. **Scaled Prices in Thousands**:
   6 listings have prices divided by 1,000 (`MAG-6002472`, `SQU-6000395`, `MAG-6002941`, `100-6001599`, `100-6000578`, `100-6000678`). Multiply by 1,000 for proper INR.

#### Listing Object Schema

```json
{
  "listing_id": "100-6000042",
  "listing_url": "https://www.100acres.com/property/6000042",
  "website": "100acres",
  "city_id": 6,
  "apartment_name": "DLF The Arbour",
  "locality": "sector 65",
  "property_type": "apartment",
  "bedroom": 4,
  "bathroom": 4,
  "balcony": 3,
  "floor": 14,
  "total_floors": 34,
  "furnishing": "semi-furnished",
  "facing_direction": "north-east",
  "covered_parking": 2,
  "price": 38500000,
  "carpet_area": 2450,
  "super_built_up_area": 3100,
  "latitude": 28.4116,
  "longitude": 77.0655,
  "posted_by": "agent",
  "posted_by_name": "Vikas Malhotra",
  "posted_by_contact": "+919811002233",
  "project_id": "P60012",
  "description": "Luxurious 4 BHK corner residence in Sector 65, Gurgaon with panoramic views.",
  "posted_at": "2026-08-14T09:20:00",
  "is_verified": true,
  "is_live": true
}
```

### `GET /v1/listings/{listing_id}`

Returns a single listing object.

> ⚠️ **Correction**: The route path is `/v1/listings/{listing_id}` (plural), NOT `/v1/listing/{listing_id}`.

### `GET /v1/listings/{listing_id}/similar`

Returns up to 10 comparable active listings sharing the same locality and bedroom count within a ±15% price band.

---

## Rentals

### `GET /v1/rentals`

Returns rental listings for Gurgaon (1,320 total retrievable records; API under-reports `total: 1207`).

#### Query Parameters
- `offset`, `limit` (max 50)
- `locality`, `bhk`, `furnishing`, `sort_by`, `order`

#### Schema Inconsistency Note
> ⚠️ **Field Name Inconsistency**: Rentals use **`super_builtup_area`** (without an underscore between `built` and `up`), whereas sale listings use **`super_built_up_area`**.

```json
{
  "listing_id": "R6000042",
  "listing_url": "https://www.zerobroker.com/rent/6000042",
  "website": "zerobroker",
  "city_id": 6,
  "title": "3 BHK for rent in Golf Course Road",
  "apartment_name": "The Camellias",
  "locality": "golf course road",
  "property_type": "apartment",
  "bedroom": 3,
  "bathroom": 3,
  "floor": 8,
  "total_floors": 24,
  "furnishing": "fully-furnished",
  "facing_direction": "north-east",
  "price": 125000,
  "deposit": 375000,
  "maintenance": 8500,
  "carpet_area": 1850,
  "super_builtup_area": 2400,
  "latitude": 28.4721,
  "longitude": 77.1023,
  "posted_by": "owner",
  "posted_by_name": "Ananya Sen",
  "posted_by_contact": "+919822003344",
  "description": "3 BHK premium furnished residence overlooking golf greens.",
  "posted_at": "2026-07-15T14:30:00"
}
```

### `GET /v1/rentals/{listing_id}`

Returns a single rental object.

---

## Projects

### `GET /v1/projects`

Returns builder developments in Gurgaon (400 retrievable records; API under-reports `total: 366`).

#### Price Units Warning

> ⚠️ **CRITICAL CORRECTION**:  
> `price_min` and `price_max` are **floats in mixed units**, NOT integer INR:
> - Values $\ge 10$ represent **Lakhs** ($94.6 \rightarrow \text{₹}94,60,000$).
> - Values $< 10$ represent **Crores** ($2.15 \rightarrow \text{₹}2,15,00,000$; $5.83 \rightarrow \text{₹}5,83,00,000$).
>
> Multiply values $\ge 10$ by $10^5$, and values $< 10$ by $10^7$ to normalize to Indian Rupees.

#### Project Listings Count Discrepancy

> ⚠️ **Count Discrepancy**:  
> `total_listings` claims to dynamically track active listings linked to that `project_id`. In reality, **`total_listings` disagrees for 295 out of 400 projects**. Calculate linked inventory dynamically by filtering `/v1/listings?project_id=...`.

```json
{
  "project_id": "P60060",
  "project_url": "https://www.ivy.homes/projects/60060",
  "city_id": 6,
  "apartment_name": "Mantri Terraces",
  "developer_name": "Mantri Developers",
  "locality": "golf course road",
  "project_status": "under construction",
  "total_units": 650,
  "total_towers": 5,
  "total_floors": 28,
  "launch_date": "2024-06-01",
  "possession_date": "2028-12-31",
  "rera_number": "HRERA-GGM-2024-184",
  "min_area_sqft": 1450,
  "max_area_sqft": 3600,
  "total_listings": 28,
  "price_min": 185.0,
  "price_max": 5.83,
  "amenities": ["gym", "clubhouse", "infinity pool", "tennis court"],
  "latitude": 28.4688,
  "longitude": 77.0987
}
```

### `GET /v1/projects/{project_id}`

Returns a single project.

---

## Favourites

User bookmarking API requiring a valid Bearer token.

### `GET /v1/favourites`
Returns the logged-in user's saved listings.
```json
{
  "count": 3,
  "results": [ /* full listing objects */ ]
}
```

### `POST /v1/favourites`
Saves a listing to favorites.
```json
{ "id": "100-6000042" }
```
*(Accepts either `{"id": "..."}` or `{"listing_id": "..."}`)*.

### `DELETE /v1/favourites/{id}`
Removes the listing from favorites.

---

## Analytics

### `GET /v1/analytics/summary`

> ⚠️ **MISSING ENDPOINT (HTTP 404)**:  
> The documented `/v1/analytics/summary` endpoint **does not exist on the server** and returns `404 Not Found`.  
>
> Applications must either:
> 1. Compute summary aggregates in memory / background from the raw datasets (`raw_listings.json`, `raw_rentals.json`).
> 2. Implement an internal proxy route (`/v1/analytics/summary` or `/api/analytics/summary`) that delivers precomputed aggregates conforming to the expected shape:

```json
{
  "city": "gurgaon",
  "total_listings": 3500,
  "active_listings": 2792,
  "median_price": 14200000,
  "median_price_per_sqft": 13850,
  "by_locality": [
    {
      "locality": "sector 65",
      "display_name": "Sector 65",
      "count": 385,
      "median_price": 16110000,
      "price_sqft": 14997,
      "rental_yield": 2.6
    }
  ],
  "by_bhk": [
    { "bedroom": 2, "count": 1130 },
    { "bedroom": 3, "count": 1390 }
  ]
}
```

---

## Health

### `GET /health`

Unauthenticated health check endpoint.

**Response `200 OK`**
```json
{
  "status": "healthy",
  "server_time": "2026-09-14T13:00:00+05:30",
  "version": "1.4"
}
```
*Note: The clock includes an explicit `+05:30` (IST) offset.*

---

## HTTP Status Codes & Error Handling

| Status | Code | Typical Cause & Workaround |
|---|---|---|
| `400` | Bad Request | Invalid parameter value or syntax. |
| `401` | Unauthorized | Missing or invalid `X-API-Key` header, or expired Bearer token. |
| `403` | Forbidden | Credentials do not match key scope. |
| `404` | Not Found | Record does not exist, or endpoint is missing (e.g. `/v1/analytics/summary`). |
| `422` | Unprocessable Entity | JSON payload schema validation failure. |
| `429` | Rate Limit Exceeded | Exceeded 1,200 requests/minute per key. |

Error payloads follow standard JSON:
```json
{
  "detail": "Descriptive error message from the server"
}
```
Always read `"detail"` to identify precise validation and authentication issues.
