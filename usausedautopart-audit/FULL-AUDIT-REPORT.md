# Comprehensive Website SEO Audit Report
**Website**: USA Used Auto Parts ([usausedautopart.com](https://www.usausedautopart.com))  
**Business Type**: E-Commerce & Commercial Auto Parts Supplier (Salvage & Recycled OEM)  
**Date**: September 20, 2026  
**Auditor**: Claude SEO Autonomous Intelligence  

---

## Executive Summary

An exhaustive technical, on-page, architectural, and Generative Engine Optimization (GEO) audit was conducted across the codebase and public endpoint configurations of **USA Used Auto Parts**.

The site demonstrates exceptional architectural foundations: a modern Next.js App Router framework, dynamically generated XML sitemaps mapped to thousands of inventory permutations, rich Product schema with used-part specifications (Hollander interchanges, donor VINs, warranties, and return policies), and deeply informative automotive buyer guides.

However, several high-impact optimization gaps were identified:
1. **Missing Server Metadata on Client Pages**: Key landing pages (`/about-us`, `/contact`, `/refunds`) and the homepage utilize `"use client"` without server-rendered metadata wrappers, forcing search engines to fall back to root site defaults.
2. **Entity & Brand Name Inconsistencies**: The repository and assets oscillate between *"Bionic Auto Parts"* and *"USA Used Auto Parts"*, causing fragmented brand entity recognition in search knowledge graphs.
3. **Core Web Vitals Runtime Drag**: External Google Font stylesheets are loaded via blocking `<link>` tags in `<head>`, and `@mui/material` is loaded inside client navigation components alongside Tailwind CSS, inflating main-thread execution time.
4. **Untapped AI Citation Potential (GEO)**: The absence of `llms.txt` and explicit AI bot indexing rules in `robots.ts` limits brand visibility in generative search systems (AI Overviews, ChatGPT Search, Perplexity).

### Overall SEO Health Score: **78 / 100** (Grade: **B+**)

```
┌─────────────────────────────────────────────────────────────┐
│                   SEO HEALTH SCORECARD                      │
├─────────────────────────────┬────────┬──────────────┬───────┤
│ Category                    │ Weight │ Actual Score │ Pts   │
├─────────────────────────────┼────────┼──────────────┼───────┤
│ Technical SEO               │  22%   │    82/100    │ 18.04 │
│ Content Quality & E-E-A-T   │  23%   │    76/100    │ 17.48 │
│ On-Page SEO                 │  20%   │    80/100    │ 16.00 │
│ Schema & Structured Data    │  10%   │    85/100    │  8.50 │
│ Performance (Core Web Vitals) 10%   │    72/100    │  7.20 │
│ AI Search Readiness (GEO)   │  10%   │    68/100    │  6.80 │
│ Images & Media Optimization │   5%   │    84/100    │  4.20 │
├─────────────────────────────┴────────┴──────────────┼───────┤
│ TOTAL WEIGHTED HEALTH SCORE                         │ 78.22 │
└─────────────────────────────────────────────────────┴───────┘
```

---

## 1. Technical SEO (Score: 82/100 · Weight: 22%)

### What Works
- **Dynamic XML Sitemap (`src/app/sitemap.ts`)**: Comprehensively covers commercial category hubs (`/used-engines`, `/used-transmissions`), make filters (`/used-engines/toyota`), model routes (`/used-engines/toyota/camry`), vehicle year routes (`/used-engines/toyota/camry/2018`), individual inventory product pages (`/parts/[id]`), and technical guides (`/blogs/[id]`).
- **Canonical Routing**: Well-formed canonical tags implemented across product detail pages and commercial categories.
- **Search & Transaction Hygiene**: `robots.ts` effectively blocks non-indexable utility and dynamic search query URLs (`/api/`, `/checkout`, `/payment`, `/confirmation`, `/parts?search=`).

### Issues & Deficiencies
1. **[CRITICAL] Client-Only Pages Lacking Metadata Overrides**:
   - `src/app/about-us/page.tsx`, `src/app/contact/page.tsx`, and `src/app/refunds/page.tsx` are marked with `"use client"` at line 1 and export no metadata. Next.js does not allow metadata exports from client components. Consequently, all three critical trust pages inherit the default title *"Used Auto Parts Online | Recycled OEM Engines & Transmissions"* and general description, creating duplicate titles in Google Search Console.
   - *Fix*: Decouple interactive forms into client components and export dedicated `metadata` from server-side page wrappers.
2. **[HIGH] Lack of AI Search Engine Crawler Directives**:
   - `robots.ts` declares a single wildcard rule `userAgent: '*'`. While standard search crawlers (Googlebot, Bingbot) are permitted, modern AI indexing engines (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`) do not receive explicit priority permissions.
   - *Fix*: Add explicit `allow: ['/', '/blogs', '/parts']` rules for AI search crawlers.

---

## 2. Content Quality & E-E-A-T (Score: 76/100 · Weight: 23%)

### What Works
- **Rich Automotive Expertise**: Guide articles in `src/app/data/blogs/` feature high-value technical specifics, such as Hollander Interchange breakdown instructions, compression testing PSI benchmarks (150–190 PSI), and run-testing protocols.
- **Direct Answer Format**: Articles feature structured direct takeaways and comparison tables, facilitating quick information retrieval.
- **Detailed Inventory Attributes**: Inventory items detail donor mileage, donor VIN, condition grading, and explicit warranty coverage.

### Issues & Deficiencies
1. **[HIGH] Entity & Brand Discrepancies**:
   - The brand is named *"USA Used Auto Parts"* in page metadata, telephone scripts, and header text, but footer logo alt text specifies *"Bionics Auto Parts Logo"*, the code repository is named `bionicAutoparts`, and support emails reference `part@usausedautopart.com`.
   - Google Knowledge Graph algorithms require consistent entity naming across all touchpoints (Schema, OpenGraph, NAP, Footer, Privacy/Terms).
   - *Fix*: Harmonize all public customer-facing elements to "USA Used Auto Parts" (with "formerly Bionic Auto Parts" footnote if needed).
2. **[MEDIUM] Missing Individual Author Credentials in Guides**:
   - Blog articles attribute authorship to a generic *"USA Used Auto Parts Technical Editorial Team"*.
   - Following Google's Sept 2025 Quality Rater Guidelines (QRG) update, YMYL and high-value technical purchase guides benefit significantly from individual author bios with ASE certification credentials or mechanical experience.
3. **[LOW] Incomplete Branch Address and Placeholder Social Links**:
   - The Chicago location lists an incomplete street address (`W North Ave, Chicago, IL 60639`).
   - The footer features generic root links (`facebook.com`, `twitter.com`, `instagram.com`) rather than branded social profiles.

---

## 3. On-Page SEO (Score: 80/100 · Weight: 20%)

### What Works
- **Product Title Strategy**: Formulaic, high-intent product titles: `{Year} {Make} {Model} {PartName} | Used OEM Part {ID}`.
- **Search-Friendly Breadcrumbs**: Breadcrumb lists are present on both product detail pages and blog pages.
- **Clear Call-to-Actions (CTAs)**: High-visibility phone ordering CTA `(617) 516-3140` and online quote forms placed above the fold on product pages.

### Issues & Deficiencies
1. **[HIGH] Homepage Missing Tailored OpenGraph & Canonical**:
   - Because `src/app/page.tsx` is `"use client"`, it cannot declare page-specific metadata. It defaults to layout-level settings without unique keywords or explicit canonical targeting for the root domain.
2. **[MEDIUM] Heading Hierarchy Skipping**:
   - On category hubs and commercial pages, several section containers jump from `<h1>` directly to `<h4>` or style text as headings using Tailwind classes without semantic HTML `<h2-h3>` elements.

---

## 4. Schema & Structured Data (Score: 85/100 · Weight: 10%)

### What Works
- **Root Entity Graph (`src/app/layout.tsx`)**: Injects `AutoPartsStore` and `WebSite` with `SearchAction` potentialAction.
- **Product Entity Graph (`src/app/parts/[id]/page.tsx`)**: Accurately sets `@type: "Product"`, `sku`, `mpn` (Hollander / OEM reference), `itemCondition: "UsedCondition"`, and `hasMerchantReturnPolicy`.
- **BreadcrumbList**: Proper hierarchical breadcrumb schema on commercial pages.

### Issues & Deficiencies
1. **[MEDIUM] Incomplete AutoPartsStore Attributes**:
   - Root `AutoPartsStore` lacks `geo` latitude/longitude coordinates.
   - Quincy and Chicago warehouse facilities are omitted from structured data.
2. **[INFO] Deprecated FAQPage Schema Usage**:
   - Blog guides generate `FAQPage` JSON-LD schema. Google retired FAQ rich results for all commercial websites in May 2026. While safe to leave, it does not provide snippet expansion on Google SERPs.

---

## 5. Performance & Core Web Vitals (Score: 72/100 · Weight: 10%)

### What Works
- `next/image` is implemented across product listings, hero images, and blog illustrations with explicit `sizes` and `priority` flags.

### Issues & Deficiencies
1. **[HIGH] Render-Blocking Font Link**:
   - `src/app/layout.tsx` loads the Poppins font via `<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />` in `<head>`.
   - This causes an external round-trip DNS resolution and stylesheet fetch, negatively impacting First Contentful Paint (FCP) and Largest Contentful Paint (LCP).
   - *Fix*: Replace with Next.js built-in font loader `import { Poppins } from 'next/font/google'`.
2. **[MEDIUM] Material UI (@mui/material) Bundle Bloat in Header**:
   - `src/app/components/Header.tsx` imports `@mui/material` and `@mui/icons-material` alongside Tailwind CSS. The Emotion/MUI styling runtime adds ~75KB (gzipped) of redundant JavaScript to every page load, increasing Total Blocking Time (TBT) and Interaction to Next Paint (INP).

---

## 6. AI Search Readiness / GEO (Score: 68/100 · Weight: 10%)

### What Works
- Technical guides provide clear tabular data, inspection tolerances, and bulleted takeaways that large language models (LLMs) can easily parse and synthesize.

### Issues & Deficiencies
1. **[HIGH] Absence of `llms.txt` and `llms-full.txt`**:
   - AI search engines (Perplexity, ChatGPT Search, Claude Search) look for `/llms.txt` to discover site capabilities, inventory categories, warranty terms, and canonical contact endpoints.
   - *Fix*: Publish a specification-compliant `public/llms.txt` file.

---

## 7. Images & Media (Score: 84/100 · Weight: 5%)

### What Works
- Next.js Image optimization handles lazy loading, responsive srcset generation, and format negotiation.

### Issues & Deficiencies
1. **[LOW] Alt-Text Brand Discrepancy**:
   - Footer logo uses `alt="Bionics Auto Parts Logo"`.
   - Update to `alt="USA Used Auto Parts Logo"`.
