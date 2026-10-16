# SEO Action Plan & Roadmap
**Project**: USA Used Auto Parts ([usausedautopart.com](https://www.usausedautopart.com))  
**Target Health Score Improvement**: 78 → 93+  

---

## Phase 1: Critical Fixes & Metadata Architecture (Week 1)

### 1.1 Convert Client-Only Core Pages into Server Components with Metadata
- **Files**:
  - `src/app/about-us/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/refunds/page.tsx`
- **Action**: Extract stateful form logic into dedicated client components (e.g. `ContactFormClient.tsx`) and make the route files server components that export descriptive `metadata`:
  - `/about-us`: `About USA Used Auto Parts | Nationwide Recycled OEM Supplier Since 2015`
  - `/contact`: `Contact USA Used Auto Parts | Phone Support, Freight Inquiries & Locations`
  - `/refunds`: `Returns & 30-Day Warranty Refund Policy | USA Used Auto Parts`

### 1.2 AI Crawler Permissions in `robots.ts`
- **File**: `src/app/robots.ts`
- **Action**: Add explicit crawler allowances for `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended`.

### 1.3 Brand Entity Harmonization
- **Files**: `src/app/components/Footer.tsx`, `src/app/data/contactData.ts`
- **Action**: Correct all instances of "Bionics Auto Parts" to "USA Used Auto Parts" in alt text and brand descriptions.

---

## Phase 2: Core Web Vitals & Performance Optimization (Weeks 2–3)

### 2.1 Replace Blocking Google Font `<link>` with `next/font/google`
- **File**: `src/app/layout.tsx`
- **Action**: Remove `<link href="https://fonts.googleapis.com/css2?family=Poppins..." />` from `<head>`. Import `Poppins` from `next/font/google` and configure `subsets: ['latin']`, `display: 'swap'`, and variable font injection on `<body>`.

### 2.2 Refactor Header.tsx to Native Tailwind CSS
- **File**: `src/app/components/Header.tsx`
- **Action**: Eliminate dependencies on `@mui/material` and `@mui/icons-material`. Implement mobile drawer with lightweight React state and Lucide icons to reduce JavaScript bundle size by ~75KB.

### 2.3 Deploy `public/llms.txt` and `public/llms-full.txt`
- **Files**: `public/llms.txt`, `public/llms-full.txt`
- **Action**: Provide a markdown-formatted overview of core product categories, warranty policies, Hollander interchange support, and official company credentials for AI engine indexing.

---

## Phase 3: Schema & E-E-A-T Enrichment (Month 2)

### 3.1 Multi-Location & Geo-Coordinates in Schema
- **File**: `src/app/layout.tsx`
- **Action**: Enrich `AutoPartsStore` with exact GPS coordinates and add nested `department` entries for the Quincy distribution warehouse (`Howard St #1, Quincy, MA 02169`) and Chicago office.

### 3.2 Expert Author Byline Attribution
- **Files**: `src/app/data/blogs/types.ts`, `src/app/blogs/[id]/page.tsx`
- **Action**: Update blog Article schema from generic `@type: "Organization"` to `@type: "Person"` with ASE-certified author profiles, author page links, and reviewer credentials.

### 3.3 Connect Real Social Profile Links
- **File**: `src/app/components/Footer.tsx`
- **Action**: Replace generic placeholder social links (`facebook.com`) with active business profiles or remove inactive networks to avoid dead trust signals.

---

## Phase 4: Ongoing Monitoring & Governance (Continuous)

- **Search Console Coverage**: Monitor indexed vs. excluded counts on inventory permutation routes (`/[category]/[make]/[model]/[year]`).
- **Field CWV Tracking**: Review Google CrUX Interaction to Next Paint (INP) and Largest Contentful Paint (LCP) 75th percentile scores.
- **Sitemap Freshness**: Ensure sold-out inventory items are promptly transitioned to 410 Gone or redirected to relevant model hubs.
