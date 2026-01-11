# HYROS Sales Page Generator - Product Requirements Document

**Version:** 2.0
**Last Updated:** January 2026
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Product Vision
Build an internal sales tool that enables HYROS sales reps to generate personalized, AI-powered sales pages for prospective clients. Each generated package consists of three pages—one pitch page and two close pages—customized to the prospect's business model, brand, and financial metrics.

### 1.2 Core Value Proposition
- Eliminate manual page creation for sales reps
- Deliver hyper-personalized sales content that speaks directly to each prospect's business
- Provide consistent, high-quality brand presentation with relevant social proof
- Enable rapid iteration: generate → review → delete/regenerate workflow

### 1.3 Success Metrics
- Pages generated per day: 15-30
- Time to generate a complete 3-page package: < 2 minutes
- Mobile-first experience (90% of page viewers on mobile)

---

## 2. User Personas

### 2.1 Primary User: HYROS Sales Representative
**Goals:**
- Quickly generate professional sales pages for prospects
- Find and share previously generated pages
- Manage RAG content and system prompts

**Pain Points:**
- Manual page creation is time-consuming
- Generic content doesn't resonate with prospects
- Difficulty maintaining consistent branding

### 2.2 Secondary User: Prospect (Page Viewer)
**Context:**
- Receives a Loom video link directing them to the pitch page
- Primarily viewing on mobile devices (90%)
- Looking for relevance to their specific business model

**Needs:**
- Fast-loading, mobile-optimized experience
- Content that clearly relates to their business
- Clear ROI calculations and social proof
- Frictionless path to sign-up

---

## 3. Functional Requirements

### 3.1 Page Generation System

#### 3.1.1 Input Data (Admin Creation Form)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Reference Name | Text | Yes | Internal label for admin use only |
| Business URL | URL | Yes | Prospect's website for AI research |
| Company Name | Text | Yes | Official company name |
| Loom Video URL | URL | Yes | Pre-recorded sales video |
| Monthly Ad Spend | Currency | Yes | For ROI calculation |
| Monthly Revenue from Ads | Currency | Yes | For ROI calculation |
| Primary Product Link | URL | Yes | Annual package checkout link |
| Primary Product Price | Currency | Yes | Annual price |
| Downsell Product Link | URL | Yes | Monthly package checkout link |
| Downsell Product Price | Currency | Yes | Monthly price |
| Company Logo (Optional) | Image | No | Manual upload if scraper fails |
| Additional Notes | Text | No | Sales rep context for AI |

#### 3.1.2 Page Types

**Pitch Page** (No CTA buttons)
- Header: HYROS logo + Prospect's brand logo
- Headline: AI-generated, format: "How HYROS Will Increase [Company]'s Ad ROI & Scale"
- Loom Video Embed (16:9 aspect ratio)
- 4 Benefits with descriptions (contextual to business model)
- 4 Testimonials with fixed ordering:
  - Position 1: Tony Robbins (always first)
  - Position 2: Alex Hormozi (always second)
  - Positions 3-4: Industry-matched testimonials
- ROI Calculator section with savings breakdown and guarantee banner
- "What You Get When You Join" section
- Footer

**Close Page 1** (Annual Package)
- Same structure as Pitch Page
- "Annual Package (Save 20%)" label
- Annual price display
- Create Account CTA button → Primary Product Link
- "What you get" benefits list
- 90-day guarantee text

**Close Page 2** (Annual + Monthly Options)
- Same as Close Page 1
- Additional "Monthly Package" option
- Monthly price display
- Second CTA button → Downsell Product Link

#### 3.1.3 ROI Calculation Logic
```
Current Ad Spend: [input]
Projected Ad Spend: [input] × 0.85 (15% reduction)
Ad Spend Saved: Current - Projected

Current Revenue: [input]
Projected Revenue: [input] × 1.15 (15% increase)
Revenue from Scale: Projected - Current

Current ROAS: (Current Revenue / Current Ad Spend) × 100
Projected ROAS: (Projected Revenue / Projected Ad Spend) × 100
ROAS Gain %: ((Projected - Current) / Current) × 100
```

**Display Elements:**
- "Current" column: Ad Spend, Revenue, Current ROAS %
- "With HYROS" column (blue background):
  - Ad Spend with yellow "-15% waste" label
  - Revenue with yellow "+15% better efficiency" label
  - Projected ROAS with yellow "+X%" gain indicator
  - "$X Saved" and "$X from more scale" in yellow text
- Guarantee banner: "HYROS guarantees these results. If your ads do not grow you do not pay!"

**Copy Rules:**
- ALWAYS use "15-30% improvement" language
- NEVER use "2-3x gains" or similar inflated promises

#### 3.1.4 Content Generation Rules
- **Headline:** Must follow format "How HYROS Will Increase [Company]'s Ad ROI & Scale"
- Benefits must be contextualized to the prospect's business model
- If SaaS: focus on subscription metrics, LTV, churn reduction
- If eCommerce: focus on ROAS, order tracking, inventory movement
- If Info Products/Coaching: focus on call attribution, long sales cycles
- **Testimonial Ordering (Fixed):**
  - Position 1: Tony Robbins testimonial (always)
  - Position 2: Alex Hormozi testimonial (always)
  - Positions 3-4: Selected based on business model match (tags in RAG)

### 3.2 Admin Dashboard

#### 3.2.1 Navigation
- **Create**: Page generation form
- **Pages**: List of all generated pages
- **Settings**: RAG uploads, system prompts, logos

#### 3.2.2 Create Tab
- Input form with all fields from 3.1.1
- "Generate Pages" button
- Loading state with progress indication
- Error handling for failed generations

#### 3.2.3 Pages Tab (List View)
- Sortable by creation date (newest first)
- Search by Reference Name or Business URL
- Each entry displays:
  - Reference Name
  - Company Name
  - Business URL
  - Created Date
  - Links to: Pitch Page | Close Page 1 | Close Page 2
- **Reload button:** Pre-populates create form with original generation data
  - All text fields auto-filled
  - File uploads (logo, research) require re-upload
  - Title changes to "Regenerate Page"
- Delete button with confirmation

#### 3.2.4 Settings Tab
- **HYROS Logo Upload**: Single image, persists until replaced
- **System Prompt Editor**: Text area for AI generation instructions
- **RAG Data Management**:
  - Sales Knowledge Base (MD file upload)
  - Business Intelligence Dossier (MD file upload)
  - Sales Transcript Database (MD file upload)
  - Testimonials (Multiple image uploads with metadata form)
- **Testimonial Bank Management**:
  - Displays ALL testimonials (no truncation)
  - Shows name, company, and current logo for each
  - "Change Logo" button opens upload modal
  - Logo changes persist to testimonial bank
- Clear visual indication of what's currently uploaded
- Delete/replace functionality for each item

### 3.3 Authentication
- Simple credential-based login
- Username: `hyrosrep`
- Password: `hyrosrep`
- Session-based authentication
- Protects all admin routes

### 3.4 Public Page URLs
```
/{business-slug}/pitch    → Pitch Page
/{business-slug}/close-1  → Close Page 1 (Annual Only)
/{business-slug}/close-2  → Close Page 2 (Annual + Monthly)
```
- `business-slug` derived from Business URL (sanitized)
- No authentication required for public pages

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Page generation: < 60 seconds
- Public page load: < 2 seconds
- Admin dashboard: < 1 second initial load

### 4.2 Mobile Experience
- Mobile-first design (90% of traffic)
- Responsive breakpoints: 320px, 375px, 414px, 768px, 1024px+
- Touch-friendly CTAs (minimum 44px tap targets)
- Video embed responsive (maintains 16:9)

### 4.3 Scalability
- Support 15-30 page generations per day
- Store unlimited generated pages
- Efficient search across all pages

### 4.4 Browser Support
- iOS Safari (primary)
- Chrome Mobile
- Chrome Desktop
- Safari Desktop

---

## 5. AI/ML Requirements

### 5.1 Business Research (Gemini API)
**Purpose:** Deep research on prospect's business from their URL

**Process:**
1. Receive business URL
2. Perform web research on the business
3. Identify: Business model, products/services, target market, industry
4. Extract: Company description, key offerings, brand positioning
5. Return structured data for content generation

**API Configuration:**
- Placeholder for Gemini 3 API integration
- Configurable API key in settings
- Fallback handling for API failures

### 5.2 Logo Extraction
**Process:**
1. HTML scrape of prospect's website
2. Look for: favicon, og:image, logo in header, /logo paths
3. Download and validate image
4. If extraction fails: rely on manual upload from admin form

### 5.3 Content Generation (Claude Opus 4.5)
**Purpose:** Generate all page content based on research + RAG

**Inputs:**
- Gemini research output
- RAG documents (sales knowledge, business intel, transcripts)
- Testimonial database with tags
- System prompt from settings

**Outputs:**
- Headline (format: "How HYROS Will Increase [Company]'s Ad ROI & Scale")
- Subheadline
- 4 Benefit titles + descriptions
- 4 Testimonial selections:
  - Positions 1-2: Tony Robbins and Alex Hormozi (fixed)
  - Positions 3-4: Matched by business model tags
- ROI section copy (using "15-30% improvement" language)

### 5.4 RAG Data Structure

**Testimonial Metadata Schema:**
```json
{
  "filename": "testimonial_001.png",
  "business_name": "FitGear Pro",
  "business_type": "ecommerce",
  "industry": "fitness",
  "ad_spend_range": "$50k-100k",
  "tags": ["shopify", "facebook-ads", "scaling", "roas-improvement"]
}
```

**Matching Logic:**
- Primary match: `business_type`
- Secondary match: `industry`, `ad_spend_range`
- Tertiary match: `tags`

---

## 6. Design Requirements

### 6.1 Public Pages (Prospect-Facing)

**Visual Style:**
- Clean, professional, modern
- HYROS brand colors as accent
- Prospect's brand colors integrated where possible
- High contrast for mobile readability
- Large, legible typography

**Layout (Mobile-First):**
```
┌─────────────────────────────┐
│  [HYROS Logo] [Brand Logo]  │
├─────────────────────────────┤
│        HEADLINE             │  ← "How HYROS Will Increase [Company]'s Ad ROI & Scale"
│        Subheadline          │
├─────────────────────────────┤
│   ┌─────────────────────┐   │
│   │    Loom Video       │   │
│   │      (16:9)         │   │
│   └─────────────────────┘   │
├─────────────────────────────┤
│   [CTA Button - Close Only] │
├─────────────────────────────┤
│   Benefit 1 + Description   │
├─────────────────────────────┤
│   Testimonial 1 (Tony)      │  ← Always Tony Robbins
├─────────────────────────────┤
│   Benefit 2 + Description   │
├─────────────────────────────┤
│   Testimonial 2 (Alex)      │  ← Always Alex Hormozi
├─────────────────────────────┤
│   Benefit 3 + Description   │
├─────────────────────────────┤
│   Testimonial 3 (Matched)   │  ← Industry-matched
├─────────────────────────────┤
│   ROI Calculator Section    │  ← With savings breakdown + guarantee
├─────────────────────────────┤
│   Testimonial 4 (Matched)   │  ← Industry-matched (4th testimonial)
├─────────────────────────────┤
│   What You Get When Join    │
├─────────────────────────────┤
│   90-Day Guarantee Text     │
├─────────────────────────────┤
│         Footer              │
└─────────────────────────────┘
```

### 6.2 Admin Dashboard

**Visual Style:**
- Functional, clean interface
- Clear visual hierarchy
- Status indicators for uploads
- Loading states for generation

**Responsive:**
- Functional on desktop primarily
- Tablet-friendly for on-the-go access

---

## 7. Technical Constraints

### 7.1 Platform
- **Framework:** Next.js (App Router)
- **Deployment:** Vercel
- **Styling:** TailwindCSS (mobile-first)

### 7.2 APIs
- **Gemini API:** Business research (placeholder for v3)
- **Anthropic API:** Content generation (Opus 4.5)
- **Both require:** Secure key storage, rate limiting awareness

### 7.3 Storage
- Page data: Vercel KV or PostgreSQL (Vercel Postgres)
- RAG documents: Vercel Blob Storage
- Testimonial images: Vercel Blob Storage

---

## 8. Out of Scope (Phase 1)

- Individual rep accounts / tracking
- Page editing after generation
- Brand image scraping from prospect sites
- Complex footer (terms, privacy, etc.)
- A/B testing
- Analytics integration
- Email notifications
- Preview before generation

---

## 9. Future Considerations

- Multi-rep accounts with activity tracking
- Page editing capabilities
- Brand color extraction and application
- Advanced testimonial matching AI
- Conversion tracking integration
- Automated follow-up sequences
- A/B variant generation

---

## 10. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Logo extraction failure | Medium | Manual upload fallback |
| AI generates poor content | High | Iterative prompt tuning in Phase 3 |
| Gemini API rate limits | Medium | Implement queuing/retry logic |
| Mobile rendering issues | High | Extensive mobile testing |
| Slow page generation | Medium | Show progress, optimize prompts |

---

## 11. Acceptance Criteria

### Phase 1 Complete When:
- [x] Project structure established
- [x] Frontend design plugin integrated
- [x] All MD documentation files created

### Phase 2 Complete When:
- [x] Admin authentication working
- [x] Settings page functional (all uploads)
- [x] RAG data persistence verified
- [x] Pages list/search working
- [x] Delete functionality working
- [x] Testimonial logo management
- [x] Page reload feature

### Phase 3 Complete When:
- [x] Page generation produces all 3 pages
- [x] Content is contextually appropriate
- [x] 4 Testimonials with Tony Robbins and Alex Hormozi first
- [x] Mobile experience is polished
- [x] Generation is reliable (>95% success)
- [x] Headline focus on "Ad ROI & Scale"
- [x] ROI calculator with detailed breakdown

### Phase 4 Complete When:
- [ ] Edge cases handled
- [ ] Error states polished
- [ ] Documentation complete
- [ ] Deployed to production

---

## Appendix A: Sample Generated Content

**Example: eCommerce Bikini Brand**

*Headline:* "How HYROS Will Increase Beach Babe Boutique's Ad ROI & Scale"

*Benefit 1 (Tony Robbins testimonial):* "Track Every Sale Back to the Source"
"Know precisely which Instagram ad, influencer post, or Google search led to each bikini sale—even when customers browse on their phone and buy on desktop three weeks later."

*Benefit 2 (Alex Hormozi testimonial):* "Stop Feeding Bad Data to Facebook"
"Your Meta campaigns are optimizing for the wrong customers because the platform can't see 40% of your sales. Feed HYROS data back to Facebook's AI and watch it find more buyers who actually convert."

*Benefit 3 (Industry-matched testimonial):* "Scale with Confidence, Not Hope"
"See your true ROAS across every channel in one dashboard. No more guessing which campaigns to kill and which to scale—the numbers don't lie when they're accurate."

*Benefit 4 (Industry-matched testimonial):* "Maximize Every Dollar of Ad Spend"
"With HYROS tracking, you'll see a 15-30% improvement in ad efficiency within 90 days. Stop wasting budget on underperforming ads and double down on what works."

---

## Appendix B: Testimonial Tag Taxonomy

**Business Types:**
- `ecommerce`
- `info-product`
- `saas`
- `agency`
- `coaching`
- `local-business`

**Industries:**
- `fitness`, `fashion`, `beauty`, `supplements`
- `finance`, `real-estate`, `b2b`
- `education`, `self-improvement`

**Ad Spend Ranges:**
- `<$10k`, `$10k-50k`, `$50k-100k`, `$100k-250k`, `$250k+`

**Feature Tags:**
- `facebook-ads`, `google-ads`, `youtube-ads`, `tiktok-ads`
- `shopify`, `woocommerce`, `clickfunnels`, `kajabi`
- `call-tracking`, `ltv-tracking`, `attribution`
- `roas-improvement`, `scaling`, `cost-reduction`
