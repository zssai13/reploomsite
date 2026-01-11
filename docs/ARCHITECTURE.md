# HYROS Sales Page Generator - Architecture Document

**Version:** 2.0
**Last Updated:** January 2026
**Status:** Active Development

---

## 1. System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              VERCEL                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │
│  │   Next.js App   │    │  Vercel Blob    │    │   Vercel KV     │     │
│  │   (App Router)  │◄──►│    Storage      │    │   (or Postgres) │     │
│  │                 │    │                 │    │                 │     │
│  │  - Admin UI     │    │  - RAG Files    │    │  - Page Data    │     │
│  │  - Public Pages │    │  - Testimonials │    │  - Settings     │     │
│  │  - API Routes   │    │  - Logos        │    │  - Search Index │     │
│  └────────┬────────┘    └─────────────────┘    └─────────────────┘     │
│           │                                                              │
└───────────┼──────────────────────────────────────────────────────────────┘
            │
            ▼
    ┌───────────────────────────────────────────┐
    │           External APIs                    │
    ├───────────────────────────────────────────┤
    │  ┌─────────────┐    ┌─────────────────┐   │
    │  │ Gemini API  │    │  Anthropic API  │   │
    │  │ (Research)  │    │ (Generation)    │   │
    │  └─────────────┘    └─────────────────┘   │
    └───────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14 (App Router) | Server components, API routes, Vercel optimization |
| Styling | TailwindCSS | Rapid mobile-first development |
| Database | Vercel KV (Redis) | Simple key-value, fast search, serverless |
| File Storage | Vercel Blob | Native integration, CDN delivery |
| AI - Research | Gemini API | Deep web research capabilities |
| AI - Generation | Anthropic Claude | Superior content generation |
| Deployment | Vercel | Seamless Next.js integration |
| Authentication | NextAuth.js (Credentials) | Simple, extensible auth |

---

## 2. Project Structure

```
hyros-sales-pages/
├── .claude.md                    # Claude AI context file
├── docs/
│   ├── PRD.md                    # Product Requirements
│   ├── ARCHITECTURE.md           # This document
│   ├── CHANGELOG.md              # Recent changes log
│   └── PAGE_TEMPLATE_GUIDE.md    # Page structure/styling (Phase 3)
├── src/
│   ├── app/
│   │   ├── (admin)/              # Admin route group
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx    # Admin layout with auth check
│   │   │   │   ├── page.tsx      # Redirect to /admin/create
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx  # Page generation form
│   │   │   │   ├── pages/
│   │   │   │   │   └── page.tsx  # List of generated pages
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx  # RAG uploads, prompts, logo
│   │   │   └── login/
│   │   │       └── page.tsx      # Login page
│   │   ├── (public)/             # Public route group
│   │   │   └── p/
│   │   │       └── [slug]/
│   │   │           ├── pitch/
│   │   │           │   └── page.tsx
│   │   │           ├── close-1/
│   │   │           │   └── page.tsx
│   │   │           └── close-2/
│   │   │               └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts  # NextAuth handler
│   │   │   ├── generate/
│   │   │   │   └── route.ts      # Page generation endpoint
│   │   │   ├── pages/
│   │   │   │   ├── route.ts      # List/create pages
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # Get/delete specific page
│   │   │   ├── settings/
│   │   │   │   └── route.ts      # Settings CRUD
│   │   │   └── upload/
│   │   │       └── route.ts      # File upload handler
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Root redirect
│   ├── components/
│   │   ├── admin/
│   │   │   ├── CreateForm.tsx
│   │   │   ├── PagesList.tsx
│   │   │   ├── SettingsForm.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── pages/
│   │   │   ├── PageLayout.tsx    # Shared page wrapper
│   │   │   ├── Header.tsx        # Dual logo header
│   │   │   ├── VideoEmbed.tsx    # Loom embed component
│   │   │   ├── Benefit.tsx       # Benefit section
│   │   │   ├── Testimonial.tsx   # Testimonial image display
│   │   │   ├── ROICalculator.tsx # ROI display section
│   │   │   ├── WhatYouGet.tsx    # Benefits list
│   │   │   ├── CTAButton.tsx     # Close page CTA
│   │   │   ├── Guarantee.tsx     # 90-day guarantee
│   │   │   └── Footer.tsx        # Simple footer
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       ├── FileUpload.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── gemini.ts         # Gemini API client
│   │   │   ├── anthropic.ts      # Anthropic API client
│   │   │   └── generation.ts     # Page content generation logic
│   │   ├── db/
│   │   │   ├── kv.ts             # Vercel KV client
│   │   │   └── schemas.ts        # Zod schemas for data
│   │   ├── storage/
│   │   │   └── blob.ts           # Vercel Blob client
│   │   ├── scraper/
│   │   │   └── logo.ts           # Logo extraction logic
│   │   ├── utils/
│   │   │   ├── slug.ts           # URL slug generation
│   │   │   ├── roi.ts            # ROI calculation
│   │   │   └── validation.ts     # Form validation
│   │   └── auth.ts               # Auth configuration
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── styles/
│       └── globals.css           # Tailwind imports + custom
├── public/
│   └── hyros-logo.png            # Default HYROS logo (fallback)
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 3. Data Models

### 3.1 Page Data Schema

```typescript
interface GeneratedPage {
  // Identifiers
  id: string;                    // UUID
  slug: string;                  // URL-safe business name
  referenceNname: string;        // Internal label
  
  // Business Info
  businessUrl: string;
  companyName: string;
  
  // Media
  loomVideoUrl: string;
  companyLogoUrl: string | null; // Blob storage URL
  hyrosLogoUrl: string;          // From settings
  
  // Pricing
  adSpend: number;
  adRevenue: number;
  primaryProductLink: string;
  primaryProductPrice: number;
  downsellProductLink: string;
  downsellProductPrice: number;
  
  // Generated Content
  content: {
    headline: string;             // Focus on "Ad ROI & Scale"
    subheadline: string;
    benefits: Array<{
      title: string;
      description: string;
      testimonialName: string;    // Associated testimonial person
      testimonialLogoUrl: string; // Testimonial company logo
    }>;                           // 4 benefits with testimonials
    testimonialIds: string[];     // References to testimonial records
    roiCopy: string;              // Uses "15-30% improvement" language
    whatYouGetIntro: string;
  };
  
  // AI Research Data (stored for debugging/regeneration)
  researchData: {
    businessModel: string;
    industry: string;
    products: string[];
    targetMarket: string;
    rawResearch: string;
  };
  
  // Metadata
  createdAt: string;             // ISO date
  createdBy: string;             // Future: rep ID
  status: 'generating' | 'ready' | 'error';
  errorMessage?: string;
}
```

### 3.2 Settings Schema

```typescript
interface Settings {
  // Logos
  hyrosLogoUrl: string;
  
  // System Prompts
  generationSystemPrompt: string;
  
  // RAG Documents (Blob URLs)
  ragDocuments: {
    salesKnowledgeBase: string | null;
    businessIntelDossier: string | null;
    salesTranscripts: string | null;
  };
  
  // API Keys (encrypted)
  apiKeys: {
    gemini: string;
    anthropic: string;
  };
  
  // Last Updated
  updatedAt: string;
}
```

### 3.3 Testimonial Schema

```typescript
interface Testimonial {
  id: string;
  imageUrl: string;              // Blob storage URL
  businessName: string;
  businessType: TestimonialBusinessType;
  industry: string;
  adSpendRange: string;
  tags: string[];
  createdAt: string;
}

type TestimonialBusinessType = 
  | 'ecommerce'
  | 'info-product'
  | 'saas'
  | 'agency'
  | 'coaching'
  | 'local-business';
```

---

## 4. Database Design (Vercel KV)

### 4.1 Key Structure

```
# Pages
page:{id}                       → JSON(GeneratedPage)
pages:list                      → JSON(string[])  // Array of page IDs, sorted by date
pages:slug:{slug}               → string          // Maps slug to ID

# Settings
settings:global                 → JSON(Settings)

# Testimonials
testimonial:{id}                → JSON(Testimonial)
testimonials:list               → JSON(string[])  // Array of testimonial IDs
testimonials:by-type:{type}     → JSON(string[])  // Index by business type

# Search Index (simple implementation)
search:pages                    → JSON(SearchIndex)  // {slug, companyName, referenceName}[]
```

### 4.2 Operations

**Create Page:**
```typescript
async function createPage(page: GeneratedPage): Promise<void> {
  const multi = kv.multi();
  multi.set(`page:${page.id}`, JSON.stringify(page));
  multi.set(`pages:slug:${page.slug}`, page.id);
  multi.lpush('pages:list', page.id);
  await multi.exec();
  await updateSearchIndex();
}
```

**Search Pages:**
```typescript
async function searchPages(query: string): Promise<GeneratedPage[]> {
  const index = await kv.get<SearchEntry[]>('search:pages');
  const matches = index.filter(entry => 
    entry.companyName.toLowerCase().includes(query.toLowerCase()) ||
    entry.referenceName.toLowerCase().includes(query.toLowerCase()) ||
    entry.slug.includes(query.toLowerCase())
  );
  return Promise.all(matches.map(m => getPage(m.id)));
}
```

---

## 5. API Design

### 5.1 Authentication

All `/admin/*` routes and `/api/*` routes (except public page data) require authentication.

**Session Check Middleware:**
```typescript
// src/lib/auth.ts
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return session;
}
```

### 5.2 API Endpoints

#### POST /api/generate
Initiates page generation.

**Request:**
```json
{
  "referenceName": "string",
  "businessUrl": "string",
  "companyName": "string",
  "loomVideoUrl": "string",
  "adSpend": "number",
  "adRevenue": "number",
  "primaryProductLink": "string",
  "primaryProductPrice": "number",
  "downsellProductLink": "string",
  "downsellProductPrice": "number",
  "companyLogo": "File | null",
  "additionalNotes": "string | null"
}
```

**Response:**
```json
{
  "success": true,
  "pageId": "uuid",
  "slug": "company-name"
}
```

**Process:**
1. Validate inputs
2. Create page record with `status: 'generating'`
3. Start async generation:
   a. Extract/upload logo
   b. Call Gemini for business research
   c. Call Anthropic for content generation
   d. Match testimonials
   e. Update page record with content
   f. Set `status: 'ready'`
4. Return immediately with page ID

#### GET /api/pages
List all pages with search.

**Query Params:**
- `search`: Search query (optional)
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

#### GET /api/pages/[id]
Get specific page data.

#### DELETE /api/pages/[id]
Delete page and associated assets.

#### POST /api/upload
Handle file uploads to Vercel Blob.

**Request:** FormData with file

**Response:**
```json
{
  "url": "https://blob.vercel-storage.com/...",
  "filename": "original-name.png"
}
```

#### GET/PUT /api/settings
Manage application settings.

---

## 6. AI Integration Architecture

### 6.1 Generation Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    GENERATION PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INPUT VALIDATION                                            │
│     └─► Zod schema validation                                   │
│                                                                  │
│  2. LOGO EXTRACTION                                             │
│     └─► HTML scrape of businessUrl                              │
│     └─► Extract favicon, og:image, header logo                  │
│     └─► Upload to Blob storage                                  │
│     └─► Fallback: use manual upload                             │
│                                                                  │
│  3. BUSINESS RESEARCH (Gemini)                                  │
│     └─► Send businessUrl                                        │
│     └─► Get: business model, industry, products, positioning    │
│     └─► Structure output for content generation                 │
│                                                                  │
│  4. LOAD RAG CONTEXT                                            │
│     └─► Fetch salesKnowledgeBase from Blob                      │
│     └─► Fetch businessIntelDossier from Blob                    │
│     └─► Fetch salesTranscripts from Blob                        │
│     └─► Combine into context string                             │
│                                                                  │
│  5. CONTENT GENERATION (Anthropic)                              │
│     └─► System prompt from settings                             │
│     └─► Research data as context                                │
│     └─► RAG documents as context                                │
│     └─► Generate: headline, benefits, ROI copy                  │
│                                                                  │
│  6. TESTIMONIAL MATCHING                                        │
│     └─► Position 1: Always Tony Robbins testimonial             │
│     └─► Position 2: Always Alex Hormozi testimonial             │
│     └─► Position 3-4: Match by business model from research     │
│     └─► Score by tag overlap for positions 3-4                  │
│     └─► Select 4 total testimonials                             │
│                                                                  │
│  7. ROI CALCULATION                                             │
│     └─► Apply formulas to adSpend/adRevenue                     │
│     └─► Generate display values                                 │
│                                                                  │
│  8. PAGE ASSEMBLY                                               │
│     └─► Combine all generated content                           │
│     └─► Store in database                                       │
│     └─► Update status to 'ready'                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Gemini Research Prompt Structure

```typescript
const researchPrompt = `
Analyze the following business website and provide structured information:

URL: ${businessUrl}

Research and return JSON with:
{
  "businessModel": "ecommerce | saas | info-product | coaching | agency | local-business",
  "industry": "specific industry (e.g., fitness, fashion, b2b-software)",
  "primaryProducts": ["list", "of", "main", "products/services"],
  "targetMarket": "description of ideal customer",
  "brandPositioning": "how they position themselves",
  "keyDifferentiators": ["what", "makes", "them", "unique"],
  "pricePoint": "low | medium | high | premium",
  "salesModel": "self-serve | sales-assisted | high-touch"
}
`;
```

### 6.3 Content Generation Prompt Structure

```typescript
const generationPrompt = `
${settingsSystemPrompt}

## Context
You are generating a personalized sales page for HYROS, an ad attribution and tracking platform.

## Prospect Business Research
${JSON.stringify(researchData, null, 2)}

## HYROS Knowledge Base
${ragContext}

## Task
Generate personalized sales page content that speaks directly to this prospect's business model.

Return JSON:
{
  "headline": "How HYROS Will Increase [COMPANY_NAME]'s Ad ROI & Scale",
  "subheadline": "Supporting text with specificity to their business",
  "benefits": [
    {
      "title": "Benefit that relates to their business model",
      "description": "2-3 sentences explaining how HYROS helps",
      "testimonialName": "Tony Robbins",  // Position 1: Always Tony Robbins
      "testimonialLogoUrl": "..."
    },
    {
      "title": "Second benefit",
      "description": "...",
      "testimonialName": "Alex Hormozi",  // Position 2: Always Alex Hormozi
      "testimonialLogoUrl": "..."
    },
    // Positions 3-4: Industry-matched testimonials
  ],
  "roiCopy": "Custom copy using '15-30% improvement' (never '2-3x gains')"
}
`;
```

---

## 7. Public Page Rendering

### 7.1 Server-Side Rendering Strategy

All public pages use Next.js Server Components for optimal performance:

```typescript
// src/app/(public)/p/[slug]/pitch/page.tsx
export default async function PitchPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const page = await getPageBySlug(params.slug);
  
  if (!page || page.status !== 'ready') {
    notFound();
  }
  
  const testimonials = await getTestimonials(page.content.testimonialIds);
  const settings = await getSettings();
  
  return (
    <PageLayout>
      <Header 
        hyrosLogo={settings.hyrosLogoUrl} 
        brandLogo={page.companyLogoUrl} 
      />
      <Headline text={page.content.headline} />
      <Subheadline text={page.content.subheadline} />
      <VideoEmbed url={page.loomVideoUrl} />
      
      {page.content.benefits.map((benefit, i) => (
        <Fragment key={i}>
          <Benefit title={benefit.title} description={benefit.description} />
          {testimonials[i] && <Testimonial image={testimonials[i]} />}
        </Fragment>
      ))}
      
      <ROICalculator 
        currentSpend={page.adSpend}
        currentRevenue={page.adRevenue}
      />
      <WhatYouGet />
      <Footer />
    </PageLayout>
  );
}
```

### 7.2 Testimonial Display Structure

Public pages display 4 testimonials in a fixed order:
1. **Benefit 1 → Testimonial 1 (Tony Robbins)** - Always first
2. **Benefit 2 → Testimonial 2 (Alex Hormozi)** - Always second
3. **Benefit 3 → Testimonial 3** - Industry-matched
4. **ROI Calculator Section**
5. **Testimonial 4** - Below ROI calculator, industry-matched

### 7.3 ROI Calculator Display

The ROI calculator shows a side-by-side comparison:
- **Current Column:** Ad Spend, Revenue, Current ROAS
- **With HYROS Column:**
  - Ad Spend with "-15% waste" yellow label
  - Revenue with "+15% better efficiency" yellow label
  - Projected ROAS with yellow gain percentage
  - "$X Saved" and "$X from more scale" in yellow text
- **Guarantee Banner:** Subtle yellow warning style (bg-yellow-100)

### 7.4 Caching Strategy

```typescript
// Force dynamic rendering for always-fresh data
export const dynamic = 'force-dynamic';

// OR use revalidation for better performance
export const revalidate = 60; // Revalidate every 60 seconds
```

---

## 8. Admin Dashboard Features

### 8.1 Page Reload Feature

The Pages list includes a "Reload" button for each generated page that allows regenerating with pre-filled data:

**Implementation:**
```typescript
// Pages list passes data via URL query parameter
<Link href={`/admin/create?reload=${encodeURIComponent(JSON.stringify({
  referenceName, companyName, businessUrl, loomVideoUrl,
  adSpend, adRevenue, primaryProductLink, primaryProductPrice,
  downsellProductLink, downsellProductPrice, companyLogoUrl
}))}`}>
  Reload
</Link>

// Create page parses and applies reload data
const reloadParam = searchParams.get('reload');
if (reloadParam) {
  const data = JSON.parse(decodeURIComponent(reloadParam));
  // Pre-fill all form fields with defaultValue
}
```

**UI Behavior:**
- Title changes to "Regenerate Page" when reloading
- Info banner explains data has been pre-filled
- Current logo shown for reference
- Yellow reminder to re-upload business research file
- File inputs cannot be pre-populated (browser security)

### 8.2 Testimonial Logo Management

The Settings page includes a testimonial bank manager:

**Features:**
- Displays ALL testimonials from the markdown bank (no truncation)
- Each testimonial shows name, company, and current logo
- "Change Logo" button opens upload modal
- Modal allows selecting and previewing new logo
- Uploads saved to `/testimonial-logos/` directory
- Changes persist to testimonial bank JSON

---

## 9. File Storage Architecture

### 9.1 Vercel Blob Organization

```
/hyros-sales-pages/
├── logos/
│   ├── hyros-logo.png          # Default HYROS logo
│   └── brands/
│       └── {slug}-logo.{ext}   # Per-business logos
├── rag/
│   ├── sales-knowledge-base.md
│   ├── business-intel-dossier.md
│   └── sales-transcripts.md
└── testimonials/
    └── {id}.{ext}              # Testimonial images
```

### 9.2 Upload Handler

```typescript
// src/app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string;
  
  const pathname = getPathname(type, file.name);
  
  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: false,
  });
  
  return Response.json({ url: blob.url });
}
```

---

## 10. Error Handling

### 10.1 Generation Error Recovery

```typescript
async function generatePage(input: GenerationInput): Promise<void> {
  try {
    // Step 1: Logo
    let logoUrl: string | null = null;
    try {
      logoUrl = await extractLogo(input.businessUrl);
    } catch (e) {
      console.warn('Logo extraction failed, using fallback');
      logoUrl = input.manualLogoUrl || null;
    }
    
    // Step 2: Research
    const research = await geminiResearch(input.businessUrl);
    
    // Step 3: Content (critical - no fallback)
    const content = await generateContent(research, await loadRagContext());
    
    // Step 4: Testimonials (non-critical)
    let testimonials: string[];
    try {
      testimonials = await matchTestimonials(research.businessModel);
    } catch (e) {
      testimonials = await getDefaultTestimonials();
    }
    
    // Step 5: Assemble and save
    await savePage({ ...input, logoUrl, content, testimonials, status: 'ready' });
    
  } catch (error) {
    await updatePageStatus(input.id, 'error', error.message);
    throw error;
  }
}
```

### 10.2 Error Boundary (Client)

```typescript
// src/app/(admin)/admin/error.tsx
'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## 11. Security Considerations

### 11.1 Authentication
- Session-based auth via NextAuth.js
- Credentials provider with hardcoded values (Phase 1)
- All admin routes protected by middleware
- CSRF protection built into NextAuth

### 11.2 API Security
- All mutation endpoints require authentication
- Input validation via Zod schemas
- Rate limiting via Vercel's built-in protection

### 11.3 Secrets Management
- API keys stored in Vercel environment variables
- Never exposed to client-side code
- Encrypted at rest in Vercel KV

### 11.4 Content Security
- Public pages render user-provided content
- Sanitize any HTML (Loom embeds use allowlisted iframe)
- CSP headers configured in next.config.js

---

## 12. Deployment Architecture

### 12.1 Vercel Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { hostname: 'blob.vercel-storage.com' },
      { hostname: '*.loom.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/p/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};
```

### 12.2 Environment Variables

```bash
# .env.local (development)
# .env.production (production - set in Vercel dashboard)

# Auth
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://your-domain.vercel.app

# Database
KV_URL=xxx
KV_REST_API_URL=xxx
KV_REST_API_TOKEN=xxx
KV_REST_API_READ_ONLY_TOKEN=xxx

# Storage
BLOB_READ_WRITE_TOKEN=xxx

# AI APIs
GEMINI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
```

---

## 13. Performance Optimizations

### 13.1 Mobile Performance

- Server Components for zero client JS on public pages
- Image optimization via next/image
- Font optimization via next/font
- Minimal CSS via Tailwind purge

### 13.2 Generation Performance

- Async generation with immediate response
- Parallel API calls where possible
- Blob storage with CDN delivery
- KV caching for frequently accessed settings

### 13.3 Monitoring

- Vercel Analytics for performance metrics
- Error logging via Vercel's built-in logs
- Generation status tracking in database

---

## 14. Migration Path

### 14.1 Phase 1 → Phase 2
No data migration needed. Phase 1 is foundation only.

### 14.2 Phase 2 → Phase 3
RAG data format may evolve. Maintain backward compatibility:
```typescript
// Version RAG documents
interface RagDocument {
  version: number;
  content: string;
}
```

### 14.3 Future Scaling
If 15-30 pages/day grows significantly:
- Migrate from Vercel KV to Vercel Postgres for complex queries
- Add background job queue for generation
- Implement pagination for pages list
