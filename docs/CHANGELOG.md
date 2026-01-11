# HYROS Sales Page Generator - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- **Page Reload Feature**: "Reload" button on generated pages list that pre-populates the create form with original generation data for quick regeneration
- **Testimonial Logo Management**: Full testimonial bank display in settings with "Change Logo" functionality and upload modal
- **4th Testimonial Section**: Added a 4th testimonial below the ROI calculator section on all page types
- **ROI Calculator Enhancements**:
  - Yellow "-15% waste" label next to Ad Spend in HYROS column
  - Yellow "+15% better efficiency" label next to Revenue in HYROS column
  - Yellow ROAS gain percentage indicator
  - "$X Saved" and "$X from more scale" breakdown in yellow text
  - Subtle guarantee banner (light yellow warning style)
- Initial project planning complete
- PRD.md created
- ARCHITECTURE.md created
- BUILD_PLAN.md created

### Changed
- **Headline Focus**: Updated headline generation to focus on "Ad ROI & Scale" instead of "ad spend"
- **ROI Copy Language**: Changed from "2-3x gains" to "15-30% improvement" messaging
- **Testimonial Ordering**:
  - Position 1: Always Tony Robbins testimonial
  - Position 2: Always Alex Hormozi testimonial
  - Positions 3-4: Industry-matched testimonials
- **Guarantee Banner Styling**: Changed from bright button-like yellow to subtle warning box style (bg-yellow-100 with border)
- **Settings Testimonial Display**: Now shows ALL testimonials (removed "+X more" truncation)

### Fixed
- N/A

### Removed
- Large "15-30% Increase" headline from ROI section (kept only in body text)

---

## Phase Completion Log

### Phase 1: Foundation
**Status:** Complete
**Completed:** January 2026

- [x] Project initialized
- [x] Documentation complete
- [x] Tailwind configured

### Phase 2: Admin & Data Layer
**Status:** Complete
**Completed:** January 2026

- [x] Authentication working
- [x] Settings page functional
- [x] RAG uploads working
- [x] Pages list working
- [x] Testimonial bank with logo management
- [x] Page reload feature for regeneration

### Phase 3: Page Generation
**Status:** Complete
**Completed:** January 2026

- [x] Generation pipeline complete
- [x] Content quality approved
- [x] Mobile experience polished
- [x] 4 testimonials with fixed ordering (Tony Robbins, Alex Hormozi first)
- [x] ROI calculator with detailed breakdown
- [x] Headline focus on "Ad ROI & Scale"

### Phase 4: Polish & Production
**Status:** In Progress

- [ ] Deployed to Vercel
- [ ] Production approved

---

## Version History

*No releases yet*
