# HYROS Sales Page Generator - Build Plan

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Ready for Phase 1

---

## Overview

This build plan follows a phased approach designed for exploratory development. Each phase has clear deliverables and exit criteria. The plan acknowledges that Phase 3 will require significant iteration to achieve consistent, high-quality page generation.

**Key Principle:** Build the infrastructure first, then iterate on the AI-generated content until it consistently produces excellent results.

---

## Design Assets & Tools

### Wireframes
Reference wireframes are stored at:
- `C:\Users\bills\OneDrive\Desktop\Design\RepSite\pitchpage.png` - Pitch page (no CTAs)
- `C:\Users\bills\OneDrive\Desktop\Design\RepSite\closepage1.png` - Close page 1 (annual CTA only)
- `C:\Users\bills\OneDrive\Desktop\Design\RepSite\closepage2.png` - Close page 2 (annual + monthly CTAs)

### Wireframe Structure (All Pages)
```
┌─────────────────────────────┐
│  HYROS LOGO + BRAND LOGO    │
├─────────────────────────────┤
│        HEADLINE             │
├─────────────────────────────┤
│   ┌─────────────────────┐   │
│   │    Loom Video       │   │
│   │      (16:9)         │   │
│   └─────────────────────┘   │
├─────────────────────────────┤
│   [CTA - Close pages only]  │  ← Red "INTIAL OFFER" buttons
├─────────────────────────────┤
│   Benefit 1                 │
│   Testimonial 1             │
│   Benefit 2                 │
│   Testimonial 2             │
│   Benefit 3                 │
│   Testimonial 3             │
├─────────────────────────────┤
│   What You Get When Join    │
├─────────────────────────────┤
│         FOOTER              │
└─────────────────────────────┘
```

### HYROS Style Guide
The official HYROS brand style guide is located at:
- `docs/HYROS_STYLE_GUIDE.md` - Complete design system (colors, typography, components)
- `docs/style-reference/` - 6 reference screenshots from HYROS website

**Key Style Elements:**
- High-tech minimalist theme with heavy dark/light contrast
- Inter font (primary) + Playfair Display (accent for numbers/adjectives only)
- Pill buttons with `border-radius: 9999px`
- Rounded-square avatars (`border-radius: 12px`) - NOT circles
- Glass cards on dark sections, white cards on light sections
- Abstract digital/holographic art backgrounds

**IMPORTANT:** The page FORMAT stays the same (wireframes), only the AESTHETIC changes to match this style guide.

### Frontend Design Skill
This project uses the **frontend-design skill** (Claude Code plugin) for building high-quality, production-grade UI components. The skill should be invoked during Phase 3 when building public page components to ensure polished, mobile-first design that matches the HYROS style guide.

**Note:** The frontend-design skill works with live Vercel deployments via browser automation, allowing design iteration on production pages.

---

## Phase 1: Foundation & Documentation

**Duration:** 1-2 days  
**Goal:** Establish project structure, tooling, and documentation framework

### 1.1 Project Initialization

```bash
# Tasks
- [ ] Create Next.js 14 project with App Router
- [ ] Configure TypeScript strict mode
- [ ] Install and configure TailwindCSS (mobile-first breakpoints)
- [ ] Set up project directory structure per ARCHITECTURE.md
- [ ] Initialize Git repository
- [ ] Configure ESLint and Prettier
```

**Commands:**
```bash
npx create-next-app@latest hyros-sales-pages --typescript --tailwind --app --use-npm
cd hyros-sales-pages
npm install zod @vercel/kv @vercel/blob next-auth
```

### 1.2 Create Documentation Files

```bash
# Tasks
- [ ] Create .claude.md (AI context file for Claude Code)
- [ ] Create docs/PRD.md (copy from this planning session)
- [ ] Create docs/ARCHITECTURE.md (copy from this planning session)
- [ ] Create docs/CHANGELOG.md (empty template)
- [ ] Create docs/PAGE_TEMPLATE_GUIDE.md (placeholder for Phase 3)
```

**.claude.md structure:**
```markdown
# HYROS Sales Page Generator

## Project Overview
Internal tool for HYROS sales reps to generate personalized sales pages.

## Tech Stack
- Next.js 14 (App Router)
- TailwindCSS (mobile-first)
- Vercel KV (database)
- Vercel Blob (file storage)
- Gemini API (research)
- Anthropic API (content generation)

## Key Documentation
- docs/PRD.md - Product requirements
- docs/ARCHITECTURE.md - Technical architecture
- docs/CHANGELOG.md - Recent changes
- docs/PAGE_TEMPLATE_GUIDE.md - Page styling guide

## Current Phase
[Update as you progress]

## Important Patterns
- All public pages are mobile-first (90% mobile traffic)
- Admin uses simple credential auth (hyrosrep/hyrosrep)
- Pages stored in Vercel KV with slug-based lookup
- RAG documents stored in Vercel Blob

## Code Style
- Use Server Components by default
- Client Components only when needed ('use client')
- Zod for all validation
- TypeScript strict mode
```

### 1.3 Configure Tailwind for Mobile-First

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',    // iPhone SE+
      'sm': '414px',    // iPhone Plus/Max
      'md': '768px',    // Tablet
      'lg': '1024px',   // Desktop
      'xl': '1280px',   // Large desktop
    },
    extend: {
      colors: {
        'hyros': {
          primary: '#000000',   // Update with actual brand color
          accent: '#FF0000',    // Update with actual accent
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

### 1.4 Create Type Definitions

```typescript
// src/types/index.ts
// Copy interfaces from ARCHITECTURE.md Section 3
```

### 1.5 Exit Criteria

- [ ] `npm run dev` starts without errors
- [ ] Project structure matches ARCHITECTURE.md
- [ ] All documentation files created
- [ ] .claude.md provides clear context
- [ ] Tailwind configured for mobile-first

---

## Phase 2: Admin Dashboard & Data Layer

**Duration:** 3-4 days  
**Goal:** Fully functional admin with RAG data management

### 2.1 Authentication Setup

```bash
# Tasks
- [ ] Configure NextAuth.js with Credentials provider
- [ ] Create login page
- [ ] Add auth middleware for admin routes
- [ ] Create session context provider
```

**Implementation:**
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.username === 'hyrosrep' &&
          credentials?.password === 'hyrosrep'
        ) {
          return { id: '1', name: 'HYROS Rep' };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
};
```

### 2.2 Database Layer (Vercel KV)

```bash
# Tasks
- [ ] Create Vercel KV instance
- [ ] Implement KV client wrapper
- [ ] Create CRUD operations for pages
- [ ] Create CRUD operations for settings
- [ ] Create CRUD operations for testimonials
- [ ] Implement search functionality
```

**Key File: src/lib/db/kv.ts**
```typescript
// Implement all database operations per ARCHITECTURE.md Section 4
```

### 2.3 File Storage (Vercel Blob)

```bash
# Tasks
- [ ] Create Vercel Blob store
- [ ] Implement upload API route
- [ ] Create helper functions for different file types
- [ ] Handle file type validation
```

### 2.4 Settings Page

```bash
# Tasks
- [ ] Create settings page layout
- [ ] HYROS logo upload component
- [ ] System prompt textarea with save
- [ ] RAG document upload sections:
  - Sales Knowledge Base (MD)
  - Business Intel Dossier (MD)
  - Sales Transcripts (MD)
- [ ] Testimonial bulk upload with metadata form
- [ ] Display current uploads with delete option
- [ ] API key input fields (masked)
```

**UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                    SETTINGS                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  HYROS Logo                                             │
│  ┌─────────────┐                                        │
│  │   [image]   │  [Upload New] [Delete]                 │
│  └─────────────┘                                        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  API Keys                                               │
│  Gemini API Key: [••••••••••••] [Show/Hide]            │
│  Anthropic API Key: [••••••••••••] [Show/Hide]         │
│                                    [Save Keys]          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  System Prompt                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                   │   │
│  │  [Large textarea for system prompt]              │   │
│  │                                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                         [Save Prompt]   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  RAG Documents                                          │
│                                                          │
│  Sales Knowledge Base                                   │
│  ✓ sales_knowledge_base.md (uploaded 1/5/26)           │
│  [Upload New] [Delete]                                  │
│                                                          │
│  Business Intelligence Dossier                          │
│  ✓ hyros_intel_dossier.md (uploaded 1/5/26)            │
│  [Upload New] [Delete]                                  │
│                                                          │
│  Sales Transcripts                                      │
│  ✗ No file uploaded                                    │
│  [Upload]                                               │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Testimonials                                           │
│                                                          │
│  [+ Add Testimonial]                                    │
│                                                          │
│  ┌─────┐ FitGear Pro | ecommerce | fitness             │
│  │ img │ Tags: shopify, facebook-ads, scaling          │
│  └─────┘                              [Edit] [Delete]   │
│                                                          │
│  ┌─────┐ CoachMike Academy | coaching | self-help      │
│  │ img │ Tags: youtube-ads, call-tracking              │
│  └─────┘                              [Edit] [Delete]   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2.5 Pages List View

```bash
# Tasks
- [ ] Create pages list page
- [ ] Implement search bar
- [ ] Display page cards with metadata
- [ ] Show status (generating/ready/error)
- [ ] Link to all 3 page types
- [ ] Delete with confirmation modal
- [ ] Empty state
```

### 2.6 Create Page Form (Shell)

```bash
# Tasks
- [ ] Create form layout with all fields
- [ ] Input validation with Zod
- [ ] File upload for optional logo
- [ ] Currency formatting for financial fields
- [ ] Submit button (disabled - no generation yet)
- [ ] Form state management
```

### 2.7 Admin Layout & Navigation

```bash
# Tasks
- [ ] Create admin layout with sidebar
- [ ] Navigation: Create | Pages | Settings
- [ ] Responsive sidebar (collapsible on mobile)
- [ ] User info / logout in header
```

### 2.8 Exit Criteria

- [ ] Can log in with hyrosrep/hyrosrep
- [ ] Can upload HYROS logo and see it persist
- [ ] Can save/edit system prompt
- [ ] Can upload all 3 RAG documents
- [ ] Can add testimonials with metadata
- [ ] Can view list of pages (empty initially)
- [ ] Can search pages (test with mock data)
- [ ] Can delete items with confirmation
- [ ] All data persists across sessions

---

## Phase 3: Page Generation & Iteration

**Duration:** 5-10 days (iterative)  
**Goal:** Reliable, high-quality page generation

### 3.1 Create Page Template Guide

```bash
# Tasks
- [ ] Document exact page structure
- [ ] Define component hierarchy
- [ ] Specify styling requirements
- [ ] Create example content for each section
- [ ] Define responsive breakpoints behavior
```

**File: docs/PAGE_TEMPLATE_GUIDE.md**
```markdown
# Page Template Guide

## Page Structure
[Detailed section-by-section breakdown]

## Component Specifications
[Dimensions, spacing, typography for each component]

## Content Requirements
[Character limits, tone guidelines, example content]

## Styling Rules
[Colors, fonts, spacing, mobile adaptations]
```

### 3.2 Build Page Components

```bash
# Tasks (in order)
- [ ] PageLayout.tsx - Wrapper with mobile styles
- [ ] Header.tsx - Dual logo display
- [ ] VideoEmbed.tsx - Loom 16:9 responsive
- [ ] Benefit.tsx - Title + description card
- [ ] Testimonial.tsx - Image display
- [ ] ROICalculator.tsx - Dynamic calculation display
- [ ] WhatYouGet.tsx - Benefits list
- [ ] Guarantee.tsx - 90-day guarantee text
- [ ] CTAButton.tsx - Close page buttons
- [ ] Footer.tsx - Simple footer
```

### 3.3 Logo Extraction

```bash
# Tasks
- [ ] Implement HTML fetcher
- [ ] Parse for favicon, og:image, logo patterns
- [ ] Download and validate image
- [ ] Upload to Blob storage
- [ ] Graceful fallback to manual upload
```

```typescript
// src/lib/scraper/logo.ts
export async function extractLogo(url: string): Promise<string | null> {
  try {
    const html = await fetch(url).then(r => r.text());
    
    // Try multiple extraction strategies
    const strategies = [
      extractOgImage,
      extractFavicon,
      extractHeaderLogo,
      extractByPattern,
    ];
    
    for (const strategy of strategies) {
      const logoUrl = strategy(html, url);
      if (logoUrl) {
        const validated = await validateImage(logoUrl);
        if (validated) {
          return await uploadToBlob(validated);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Logo extraction failed:', error);
    return null;
  }
}
```

### 3.4 Gemini Research Integration

```bash
# Tasks
- [ ] Create Gemini API client (placeholder structure)
- [ ] Define research prompt template
- [ ] Implement response parsing
- [ ] Add error handling and retries
- [ ] Store raw research for debugging
```

```typescript
// src/lib/ai/gemini.ts
// Note: Using placeholder until Gemini 3 docs provided
export async function researchBusiness(url: string): Promise<BusinessResearch> {
  const apiKey = await getApiKey('gemini');
  
  // Placeholder implementation
  const response = await fetch('https://api.gemini.google.com/v1/...', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: buildResearchPrompt(url),
    }),
  });
  
  return parseResearchResponse(await response.json());
}
```

### 3.5 Anthropic Content Generation

```bash
# Tasks
- [ ] Create Anthropic API client
- [ ] Build content generation prompt
- [ ] Implement RAG context loading
- [ ] Parse structured response
- [ ] Validate output completeness
```

```typescript
// src/lib/ai/anthropic.ts
import Anthropic from '@anthropic-ai/sdk';

export async function generateContent(
  research: BusinessResearch,
  ragContext: string,
  systemPrompt: string
): Promise<GeneratedContent> {
  const client = new Anthropic({
    apiKey: await getApiKey('anthropic'),
  });
  
  const response = await client.messages.create({
    model: 'claude-opus-4-5-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: buildGenerationPrompt(research, ragContext),
    }],
  });
  
  return parseContentResponse(response);
}
```

### 3.6 Testimonial Matching

```bash
# Tasks
- [ ] Implement matching algorithm
- [ ] Score by business type (primary)
- [ ] Score by industry (secondary)
- [ ] Score by tags (tertiary)
- [ ] Select top 3 unique testimonials
- [ ] Fallback to random if no matches
```

### 3.7 Generation Pipeline

```bash
# Tasks
- [ ] Create /api/generate route
- [ ] Implement async generation flow
- [ ] Status updates during generation
- [ ] Error capture and reporting
- [ ] Connect all components
```

### 3.8 Public Page Rendering

```bash
# Tasks
- [ ] Create pitch page route
- [ ] Create close-1 page route
- [ ] Create close-2 page route
- [ ] Server-side data fetching
- [ ] 404 handling for invalid slugs
- [ ] Loading states
```

### 3.9 Iteration Cycle

This is where the bulk of Phase 3 time will be spent:

```
┌─────────────────────────────────────────────────────────┐
│                 ITERATION CYCLE                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Generate test page with real business URL           │
│                                                          │
│  2. Review output:                                       │
│     - Is headline compelling and specific?              │
│     - Are benefits contextual to business?              │
│     - Do testimonials match industry?                   │
│     - Is mobile layout clean?                           │
│     - Are CTAs clear?                                   │
│                                                          │
│  3. Identify issues                                      │
│                                                          │
│  4. Adjust:                                              │
│     - System prompt in settings                         │
│     - Prompt templates in code                          │
│     - Component styling                                 │
│     - Testimonial matching logic                        │
│                                                          │
│  5. Delete test page                                     │
│                                                          │
│  6. Repeat until consistent quality                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Test Business URLs to Use:**
1. eCommerce: Find a Shopify fashion brand
2. SaaS: Find a B2B software company
3. Info Product: Find a course creator
4. Coaching: Find a high-ticket coach
5. Agency: Find a marketing agency

### 3.10 Exit Criteria

- [ ] Can generate all 3 pages from a single URL
- [ ] Content is specific to the business model
- [ ] Headlines are compelling (not generic)
- [ ] Benefits speak to prospect's pain points
- [ ] Testimonials match business type
- [ ] ROI calculation displays correctly
- [ ] Mobile layout is polished
- [ ] Generation succeeds >95% of the time
- [ ] Generation completes in <60 seconds
- [ ] Bill approves output quality

---

## Phase 4: Polish & Production

**Duration:** 2-3 days  
**Goal:** Production-ready deployment

### 4.1 Edge Cases & Error Handling

```bash
# Tasks
- [ ] Handle generation timeout
- [ ] Handle API rate limits
- [ ] Handle invalid URLs
- [ ] Handle missing testimonials
- [ ] Handle blob storage failures
- [ ] User-friendly error messages
```

### 4.2 UI/UX Polish

```bash
# Tasks
- [ ] Loading states everywhere
- [ ] Success/error toasts
- [ ] Confirmation modals
- [ ] Empty states
- [ ] Form validation feedback
- [ ] Keyboard accessibility
```

### 4.3 Performance Optimization

```bash
# Tasks
- [ ] Image optimization (next/image)
- [ ] Font optimization (next/font)
- [ ] Bundle analysis
- [ ] Lighthouse audit (target: 90+)
```

### 4.4 Security Review

```bash
# Tasks
- [ ] Verify auth on all admin routes
- [ ] Validate all API inputs
- [ ] Sanitize any rendered user content
- [ ] Review CSP headers
- [ ] Secure API key storage
```

### 4.5 Documentation Update

```bash
# Tasks
- [ ] Update CHANGELOG.md
- [ ] Final README.md
- [ ] Environment variable documentation
- [ ] Deployment guide
```

### 4.6 Vercel Deployment

```bash
# Tasks
- [ ] Create Vercel project
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set up Vercel KV
- [ ] Set up Vercel Blob
- [ ] Deploy and test
- [ ] Configure custom domain (if applicable)
```

### 4.7 Exit Criteria

- [ ] Deployed to Vercel production
- [ ] All environment variables configured
- [ ] Can generate pages in production
- [ ] Mobile experience is excellent
- [ ] No console errors
- [ ] Bill signs off on production readiness

---

## Risk Mitigation

### Technical Risks

| Risk | Mitigation | Fallback |
|------|------------|----------|
| Gemini API not available | Use placeholder | Manual business info input |
| Logo extraction unreliable | Multiple strategies + fallback | Manual upload always available |
| Content quality inconsistent | Extensive prompt iteration | System prompt adjustment by reps |
| Slow generation | Async with status updates | Increase timeout, show progress |

### Schedule Risks

| Risk | Mitigation |
|------|------------|
| Phase 3 takes longer than expected | Phase 3 is intentionally flexible; iterate until quality is acceptable |
| Scope creep | Strict adherence to "Out of Scope" in PRD |
| Integration issues | Build and test each integration in isolation first |

---

## Communication Checkpoints

- **End of Phase 1:** Review project structure, confirm foundation is solid
- **End of Phase 2:** Demo admin functionality, confirm data management works
- **During Phase 3:** Frequent reviews of generated pages, iterate on feedback
- **End of Phase 3:** Sign-off on content quality
- **End of Phase 4:** Production deployment approval

---

## Appendix: Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Run linter

# Vercel CLI
vercel env pull               # Pull env vars locally
vercel deploy                 # Deploy preview
vercel deploy --prod          # Deploy production

# Database (Vercel KV)
# Use Vercel dashboard or @vercel/kv SDK

# File Storage (Vercel Blob)
# Use Vercel dashboard or @vercel/blob SDK
```

---

## Next Steps

1. **Confirm this plan** - Review with Bill, clarify any questions
2. **Begin Phase 1** - Initialize project and documentation
3. **Regular check-ins** - After each phase completion
