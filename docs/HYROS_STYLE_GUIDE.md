# HYROS Design System & Style Guide

> **For AI Coding Assistants**: Use this guide when building any HYROS-branded UI, landing pages, dashboards, or marketing materials.

---

## Core Visual Philosophy

- **Theme**: High-Tech Minimalist
- **Contrast**: Heavy dark/light mode alternation (Pure Black ↔ Pure White sections)
- **Vibe**: Aggressive, confident, data-driven, premium SaaS
- **Key Visual Marker**: Abstract digital/glitch art mixed with clean, flat UI elements

---

## Color Palette

### Backgrounds

| Name | Hex | Usage |
|------|-----|-------|
| Deep Black | `#000000` | Hero sections, "Truth" sections |
| Pure White | `#FFFFFF` | Feature breakdowns |
| Off-White | `#F9FAFB` | Testimonial grids |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Dark | `#111827` | Headings on light backgrounds |
| Primary Light | `#FFFFFF` | Headings on dark backgrounds |
| Secondary Gray | `#6B7280` | Subheadings/body on light backgrounds |
| Muted Light | `#9CA3AF` | Subheadings on dark backgrounds |

### Accent & Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Hyros Blue | `#3B82F6` | Links, arrows, accent dots |
| Conversion Yellow | `#FCD34D` → `#F59E0B` | Buy buttons, high-alert accents |
| Holographic Gradients | Cyan/Magenta/Lime blends | Abstract art backgrounds |

---

## Typography

### Font Families

```css
/* Primary - Use for most text */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Accent Serif - ONLY for impact numbers/adjectives like "43%" or "Transparent" */
font-family: 'Playfair Display', 'Times New Roman', serif;
```

### Type Scale

| Element | Font | Weight | Size | Letter Spacing | Notes |
|---------|------|--------|------|----------------|-------|
| **H1 - Hero** | Sans | 500-600 | 64-80px | -0.03em | White on black, NOT ultra-bold |
| **H2 - Section** | Sans | 500 | 48px | -1px | Color: `#111827`, line-height: 1.1 |
| **H3 - Editorial** | Serif | 400 | 56px | normal | Elegant, high contrast |
| **Subheadline** | Sans | 400 | 20-24px | normal | Color: `#6B7280`, line-height: 1.5 |
| **Nav/UI Labels** | Sans | 600 | 14-16px | normal | Sentence case, never ALL CAPS |

---

## Components

### Buttons

#### Dark Mode Pill (on white backgrounds)
```css
.btn-primary-dark {
  background-color: #000;
  color: #fff;
  border-radius: 9999px;
  padding: 16px 36px;
  font-weight: 500;
  font-size: 16px;
  border: none;
  cursor: pointer;
}
```

#### Light Mode Pill (on black backgrounds)
```css
.btn-secondary-white {
  background-color: #fff;
  color: #000;
  border-radius: 9999px;
  padding: 14px 32px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

#### Text Link with Arrow
- Color: `#3B82F6` (blue) or white
- Icon: Right arrow `→`
- Weight: 700 (bold)

---

### Cards

#### Feature Card (Light Mode)
```css
.feature-card {
  background: #FFFFFF;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 40px;
}
```

#### Glass Card (Dark Mode)
```css
.glass-card {
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
```
- Contains: Glowing gradient icon box (~60px) + white text

#### Testimonial Card
```css
.testimonial-card {
  background: #FFFFFF;
  /* Sits on off-white (#F9FAFB) page background */
}

.avatar-square {
  border-radius: 12px; /* NOT a circle - distinctive HYROS style */
  width: 48px;
  height: 48px;
  object-fit: cover;
}
```

---

### Badges & Pills

```css
.feature-pill-badge {
  background-color: #F3F4F6;
  color: #3B82F6;
  border-radius: 99px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
}
```

---

## Layout Templates

### Section 1: "Truth" Hero (Dark)
- **Container**: Full width, black background
- **Content**: Centered text
- **Image**: Large abstract graphic spanning full width or centered behind text
- **Elements**: Two "Glass Cards" side-by-side below headline

### Section 2: Split Feature (Light)
- **Container**: Max-width 1200px, white background
- **Grid**: 50% Text (Left) / 50% Image (Right)
- **Text Column**: Vertical line indicator (`border-left`) for active tabs
  - Active tab: Black text
  - Inactive tab: Light gray text
- **Image Column**: Large rounded container (`border-radius: 24px`) with `#F3F4F6` background containing floating UI

### Section 3: "Grid of Proof" (Testimonials)
- **Container**: Light gray background (`#F9FAFB`)
- **Headline**: Centered, mix of Sans + Serif (e.g., "Used by the *best*")
- **Grid**: 3 columns, masonry or equal height
- **Cards**: White cards with rounded-square avatars

---

## Imagery Guidelines

| Type | Style |
|------|-------|
| **Abstract Backgrounds** | Glitch art, motion-blurred lights, oil-slick textures fading into black |
| **Product UI** | Clean, simplified dashboard screenshots |
| **UI Positioning** | Slightly tilted in 3D space or floating |
| **Drop Shadows** | Soft and widespread behind UI elements |
| **Icons** | App-icon style squares with colorful gradients or 3D renders (NOT standard vector outlines) |

---

## Quick Reference CSS

```css
/* Base Typography Setup */
.font-sans-primary {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  letter-spacing: -0.02em;
}

.font-serif-accent {
  font-family: 'Playfair Display', serif;
  font-weight: 400;
}

/* Headings */
h1 {
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

/* All Button Styles */
.btn-primary-dark {
  background-color: #000;
  color: #fff;
  border-radius: 9999px;
  padding: 16px 36px;
  font-weight: 500;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.btn-secondary-white {
  background-color: #fff;
  color: #000;
  border-radius: 9999px;
  padding: 14px 32px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

/* Card Styles */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.feature-card {
  background: #FFFFFF;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 40px;
}

/* Avatar - Rounded Square, NOT Circle */
.avatar-square {
  border-radius: 12px;
  width: 48px;
  height: 48px;
  object-fit: cover;
}

/* Badge/Pill */
.feature-pill-badge {
  background-color: #F3F4F6;
  color: #3B82F6;
  border-radius: 99px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
}
```

---

## Critical Reminders

1. **Letter spacing is crucial** — Always use tight letter spacing on headings (`-0.02em` to `-0.04em`)
2. **Avatars are rounded squares** — Use `border-radius: 12px`, never circles
3. **Serif font is accent only** — Reserve Playfair Display for impact numbers and single adjectives
4. **Pill buttons only** — All CTAs use `border-radius: 9999px`
5. **Shadows are subtle** — Use diffuse, soft shadows, never harsh drop shadows
6. **No standard icons** — Use gradient-filled app-icon style or 3D rendered icons
