# Page Template & Style Guide

**Status:** Active - Refined and Implemented
**Last Updated:** January 2026

---

## Overview

This document defines the page structure (from wireframes) and visual styling (from HYROS brand guide). The FORMAT remains fixed; only the AESTHETIC will be iterated during Phase 3.

**Key Principle:** Wireframes define WHAT goes where. Style guide defines HOW it looks.

---

## Reference Materials

### Wireframes (Page Structure)
Located at `C:\Users\bills\OneDrive\Desktop\Design\RepSite\`:
- `pitchpage.png` - Pitch page (no CTAs)
- `closepage1.png` - Close page 1 (annual CTA only)
- `closepage2.png` - Close page 2 (annual + monthly CTAs)

### Style Guide & Reference Images
- `docs/HYROS_STYLE_GUIDE.md` - Complete HYROS design system
- `docs/style-reference/` - 6 screenshots from HYROS website

---

## 1. Page Structure (From Wireframes)

All three page types share the same structure:

```
┌─────────────────────────────────────┐
│  HEADER: HYROS Logo + Brand Logo    │  ← Dual logos
├─────────────────────────────────────┤
│           HEADLINE                  │  ← "How HYROS Will Increase [Company]'s Ad ROI & Scale"
├─────────────────────────────────────┤
│   ┌─────────────────────────────┐   │
│   │       Loom Video            │   │  ← 16:9 aspect ratio
│   │         (16:9)              │   │
│   └─────────────────────────────┘   │
├─────────────────────────────────────┤
│   [CTA BUTTONS - Close pages only]  │  ← Yellow pill buttons
├─────────────────────────────────────┤
│   Benefit 1 (title + description)   │
├─────────────────────────────────────┤
│   Testimonial 1 (Tony Robbins)      │  ← ALWAYS first
├─────────────────────────────────────┤
│   Benefit 2 (title + description)   │
├─────────────────────────────────────┤
│   Testimonial 2 (Alex Hormozi)      │  ← ALWAYS second
├─────────────────────────────────────┤
│   Benefit 3 (title + description)   │
├─────────────────────────────────────┤
│   Testimonial 3 (Industry-matched)  │
├─────────────────────────────────────┤
│   ROI Calculator Section            │  ← With savings breakdown + guarantee
├─────────────────────────────────────┤
│   Testimonial 4 (Industry-matched)  │  ← 4th testimonial below ROI
├─────────────────────────────────────┤
│   What You Get When You Join        │
├─────────────────────────────────────┤
│           FOOTER                    │
└─────────────────────────────────────┘
```

### Testimonial Ordering Rules

| Position | Testimonial | Selection Logic |
|----------|-------------|-----------------|
| 1 | Tony Robbins | Always fixed - high credibility anchor |
| 2 | Alex Hormozi | Always fixed - business credibility |
| 3 | Industry-matched | Selected based on prospect's business model |
| 4 | Industry-matched | Selected based on prospect's business model |

**Important:** Testimonials 1 and 2 are hardcoded. Testimonials 3 and 4 are dynamically matched based on the prospect's industry and business type.

### Page Type Differences

| Element | Pitch Page | Close Page 1 | Close Page 2 |
|---------|------------|--------------|--------------|
| CTAs | None | 1 button (Annual) | 2 buttons (Annual + Monthly) |
| CTA Text | - | "Get Started - Annual" | "Annual" + "Monthly" |
| CTA Links | - | Primary Product Link | Primary + Downsell Links |

---

## 2. Typography (From HYROS Style Guide)

### Font Families

```css
/* Primary - All main text */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Accent Serif - ONLY for impact numbers like "43%" or single adjectives */
font-family: 'Playfair Display', 'Times New Roman', serif;
```

### Type Scale

| Element | Font | Weight | Size (Mobile) | Size (Desktop) | Letter Spacing |
|---------|------|--------|---------------|----------------|----------------|
| **Headline** | Inter | 600 | 32px | 48-64px | -0.03em |
| **Subheadline** | Inter | 400 | 16px | 20-24px | normal |
| **Benefit Title** | Inter | 600 | 20px | 24px | -0.02em |
| **Benefit Desc** | Inter | 400 | 14px | 16px | normal |
| **CTA Button** | Inter | 500 | 16px | 16px | normal |
| **Impact Numbers** | Playfair | 400 | 48px | 56px | normal |

---

## 3. Colors (From HYROS Style Guide)

### Backgrounds

| Section | Background | Usage |
|---------|------------|-------|
| Hero/Header | `#000000` (Deep Black) | Top section with video |
| Benefits | `#FFFFFF` (Pure White) | Benefit sections |
| Testimonials | `#F9FAFB` (Off-White) | Testimonial areas |
| Footer | `#000000` (Deep Black) | Footer section |

### Text Colors

| Context | Color | Hex |
|---------|-------|-----|
| Headings on dark | White | `#FFFFFF` |
| Headings on light | Dark | `#111827` |
| Body on dark | Muted | `#9CA3AF` |
| Body on light | Gray | `#6B7280` |

### Accent Colors

| Use | Color | Hex |
|-----|-------|-----|
| Links/arrows | Hyros Blue | `#3B82F6` |
| CTA buttons | Yellow gradient | `#FCD34D` → `#F59E0B` |
| Secondary CTA | Black pill | `#000000` |

---

## 4. Component Specifications

### Header (Dual Logos)
- Background: `#000000`
- HYROS logo: Left-aligned, max-height 40px
- Brand logo: Right-aligned, max-height 40px
- Padding: 16px (mobile), 24px (desktop)
- Logos should have subtle glow/separation on dark background

### Video Embed (Loom)
- Aspect ratio: 16:9 (always)
- Max-width: 100% on mobile, 800px on desktop
- Border-radius: 16px
- Box-shadow: `0 4px 20px rgba(0, 0, 0, 0.3)`
- Centered horizontally

### CTA Buttons (Close Pages Only)
```css
.cta-primary {
  background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
  color: #000000;
  border-radius: 9999px; /* Pill shape - CRITICAL */
  padding: 16px 36px;
  font-weight: 500;
  font-size: 16px;
  min-height: 44px; /* Touch target */
}

.cta-secondary {
  background: #FFFFFF;
  color: #000000;
  border-radius: 9999px;
  padding: 14px 32px;
  font-weight: 500;
}
```

### Benefit Sections
- Background: `#FFFFFF`
- Padding: 40px 20px (mobile), 60px 40px (desktop)
- Title: `#111827`, weight 600, tight letter-spacing
- Description: `#6B7280`, weight 400
- Optional: Left border indicator (vertical line) for active/featured benefits

### Testimonial Sections
- Background: `#F9FAFB` (off-white)
- Card background: `#FFFFFF`
- Card border-radius: 24px
- Card shadow: `0 4px 20px rgba(0, 0, 0, 0.05)`
- **Avatar: `border-radius: 12px` (rounded square - NOT circle)**
- Avatar size: 48px × 48px

### ROI Calculator Section
- Title: "Your Projected ROI" (Playfair Display, italic)
- Subtitle: "Based on $X/mo ad spend"
- Layout: Side-by-side comparison grid

**Current Column (White Background):**
- Shows current Ad Spend and Revenue
- Current ROAS percentage at bottom

**With HYROS Column (Blue Background #3B82F6):**
- Ad Spend row: Shows reduced spend with yellow label "-15% waste"
- Revenue row: Shows increased revenue with yellow label "+15% better efficiency"
- Projected ROAS with yellow "+X%" gain indicator
- Yellow text showing: "$X Saved" and "$X from more scale"
- Yellow text color: `#FCD34D` (yellow-300)

**Below Calculator:**
- Descriptive text about 15-30% improvement within 90 days (no big headline)
- **IMPORTANT:** Never use "2-3x gains" language. Always use "15-30% improvement" in the body text

**Guarantee Banner (Subtle Warning Style):**
- Light yellow background: `bg-yellow-100` with `border border-yellow-300`
- NOT a bright button-like yellow - should look like a warning/highlight box
- Text: "HYROS guarantees these results. If your ads do not grow you do not pay!"
- Font: Semibold, dark yellow text (`text-yellow-800`)

### What You Get Section
- Background: `#FFFFFF` or glass card on dark
- List style: Checkmarks or bullet points with blue accent
- Items should have clear visual hierarchy

### Footer
- Background: `#000000`
- Text: `#9CA3AF` (muted)
- Simple, minimal content
- Padding: 40px

---

## 5. Spacing System

### Vertical Spacing

| Between | Mobile | Desktop |
|---------|--------|---------|
| Sections | 60px | 80px |
| Components in section | 24px | 32px |
| Title and description | 12px | 16px |

### Horizontal Padding

| Breakpoint | Container Padding |
|------------|-------------------|
| Mobile (320px) | 20px |
| Small mobile (375px) | 24px |
| Tablet (768px) | 40px |
| Desktop (1024px+) | Max-width 1200px, centered |

---

## 6. Responsive Breakpoints

```css
/* Mobile-first approach */
/* Base styles: 320px+ */

@media (min-width: 375px) { /* xs - iPhone SE+ */ }
@media (min-width: 414px) { /* sm - iPhone Plus/Max */ }
@media (min-width: 768px) { /* md - Tablet */ }
@media (min-width: 1024px) { /* lg - Desktop */ }
```

---

## 7. Visual Effects (From Style Guide)

### Glass Cards (Dark Sections)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
```

### Feature Cards (Light Sections)
```css
.feature-card {
  background: #FFFFFF;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 40px;
}
```

### Abstract Backgrounds
- Hero sections may include abstract digital art
- Glitch textures, motion-blurred lights, holographic gradients
- Should fade into black, not distract from content

---

## 8. Accessibility Requirements

- Color contrast: Minimum 4.5:1 for body text, 3:1 for large text
- Touch targets: Minimum 44px × 44px
- Focus states: Visible outline for keyboard navigation
- Alt text: All images must have descriptive alt text

---

## 9. Content Guidelines

### Headline
- **Format:** "How HYROS Will Increase [Company Name]'s Ad ROI & Scale"
- Focus on ROI and scale, NOT just ad spend
- Max 80 characters
- Business-specific, not generic

### Benefit Titles
- Max 50 characters
- Action-oriented or outcome-focused

### Benefit Descriptions
- 2-3 sentences
- Specific to prospect's business model
- Clear value proposition

### ROI Section Copy
- **ALWAYS use:** "15-30% improvement" language
- **NEVER use:** "2-3x gains" or similar inflated promises
- Focus on efficiency gains and waste reduction

---

## Implementation Notes

### Completed Refinements (Phase 3)
- [x] Typography and spacing finalized
- [x] Color contrast verified for mobile readability
- [x] CTA buttons with proper tap targets (44px minimum)
- [x] Testimonial card layout with 4 testimonials
- [x] ROI calculator with detailed breakdown
- [x] Guarantee banner with subtle warning styling
- [x] Headline format standardized to "Ad ROI & Scale" focus

### Key Implementation Details
- Tony Robbins and Alex Hormozi testimonials are hardcoded in `src/lib/ai/anthropic.ts`
- ROI calculations use 15% reduction for spend and 15% increase for revenue
- Yellow labels use `text-yellow-300` (#FCD34D) for visibility on blue backgrounds
- Guarantee banner uses `bg-yellow-100` with `border-yellow-300` for subtle appearance
