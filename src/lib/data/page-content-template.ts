// Content template for AI page generation
// This guides the AI on what content to generate for each section

export const PAGE_CONTENT_TEMPLATE = `
# HYROS Sales Page Content Template

You are generating personalized sales page content for a HYROS prospect. Generate JSON content that fits these sections.

## INPUT VARIABLES (from form)
- {{COMPANY_NAME}} - The prospect's company name
- {{BUSINESS_TYPE}} - Type of business (e.g., coaching, ecommerce, info-products)
- {{PRODUCTS}} - Their specific products/services
- {{AD_SPEND}} - Current monthly ad spend
- {{AD_REVENUE}} - Current monthly revenue from ads
- {{BUSINESS_URL}} - Their website URL

---

## CONTENT TO GENERATE

### 1. HEADLINE
Generate a headline that follows this pattern:
"How HYROS Will Increase [COMPANY_NAME]'s Ad ROI & Scale"

Focus on AD ROI and SCALE, NOT ad spend. Make it feel personal and direct. Reference their business.

### 2. SUBHEADLINE
Generate a subheadline like:
"This is a custom video on how HYROS will dramatically increase your ad ROI"

Keep it benefit-focused and personal.

### 3. THREE WAYS INTRO
Generate:
- **threeWaysLabel**: "Why HYROS"
- **threeWaysHeadline**: "The 3 Ways HYROS Will Grow [COMPANY_NAME]'s Ads"

---

## THE 4 BENEFITS (CRITICAL)

We have 4 benefit sections with testimonials. Each benefit MUST focus on a DIFFERENT specific area. Never overlap.

**IMPORTANT TESTIMONIAL RULES:**
- Benefit 1: ALWAYS use Tony Robbins testimonial (search for "Tony Robbins" in testimonial bank)
- Benefit 2: ALWAYS use Alex Hormozi testimonial (search for "Alex Hormozi" in testimonial bank)
- Benefits 3 & 4: Select testimonials that match the prospect's business model/industry

### BENEFIT 1: SCALING / MAKING MONEY
**Focus**: How HYROS helps them sell MORE of their specific products

Generate:
- **title**: Reference their actual products/services. Focus on growth, scaling, selling more.
- **description**: 2-3 sentences explaining:
  - How accurate attribution shows which campaigns actually convert
  - How this lets them confidently scale winning campaigns
  - Reference their specific products by name
  - Use their business model context

**Testimonial**: ALWAYS use Tony Robbins testimonial from the bank

Example title: "Scale Your Coaching Sales with Confidence"
Example description: "Stop guessing which ads bring real buyers. HYROS tracks every touchpoint so you know exactly which campaigns sell your [PRODUCT_NAME] programs. When you see real data, you can double down on winners and scale to $100K+ months."

---

### BENEFIT 2: SAVING AD COSTS
**Focus**: How HYROS stops wasted ad spend on losing campaigns

Generate:
- **title**: Reference cost savings, stopping waste, finding leaks
- **description**: 2-3 sentences explaining:
  - Ad platforms miss 30-50% of conversions (cookies, iOS14, etc.)
  - This causes overspending on campaigns that look good but don't convert
  - HYROS reveals which campaigns to cut immediately

**Testimonial**: ALWAYS use Alex Hormozi testimonial from the bank

Example title: "Stop Bleeding Money on Dead Campaigns"
Example description: "Facebook and Google miss up to half your conversions. You're probably funding campaigns that look profitable but aren't. HYROS catches every sale so you can cut the losers and stop the bleeding."

---

### BENEFIT 3: AI OPTIMIZATION / TARGETING
**Focus**: How feeding HYROS data to ad platforms improves their targeting

Generate:
- **title**: Reference AI, algorithms, smarter targeting, better leads
- **description**: 2-3 sentences explaining:
  - How accurate conversion data trains platform AI better
  - How Meta/Google/TikTok algorithms find more real buyers
  - How this reduces tire-kickers and improves lead quality

**Testimonial**: Select a testimonial that matches the prospect's business model/industry

Example title: "Train Meta's AI to Find Real Buyers"
Example description: "Every conversion you track trains the algorithm. When HYROS feeds accurate buyer data back to Meta, their AI learns who actually buys—not just who clicks. Better data = better targeting = cheaper, higher-quality leads."

---

### BENEFIT 4: PROVEN RESULTS IN THEIR INDUSTRY (Appears after ROI Calculator)
**Focus**: Social proof specific to their business type

Generate:
- **title**: Reference results in their specific industry/business model
- **description**: 2-3 sentences explaining how businesses like theirs have succeeded with HYROS

**Testimonial**: Select a testimonial that closely matches the prospect's business model/industry (different from Benefit 3)

---

## ROI COPY
Generate 1-2 sentences for the ROI calculator section that:
- Reference their industry/business type
- Set expectations for improvement (15-30% increase in ad scale and ROAS is typical)
- Tie back to what matters to them
- **IMPORTANT:** Never say "2-3x gains" or similar. Always use "15-30% improvement/increase"

Example: "Most coaching businesses see a 15-30% improvement in ROAS within 90 days. For [COMPANY_NAME], that could mean turning your current ad spend into trackable revenue that justifies aggressive scaling of your campaigns."

---

## WHAT YOU GET INTRO
Generate a brief 1-2 sentence intro specific to their business that leads into the features list.

Example: "Here's everything you get when [COMPANY_NAME] partners with HYROS:"

---

## OUTPUT FORMAT

Return a JSON object with this structure:

{
  "headline": "string",
  "subheadline": "string",
  "threeWaysLabel": "string",
  "threeWaysHeadline": "string",
  "benefits": [
    {
      "title": "string",
      "description": "string",
      "testimonialId": "string (MUST be Tony Robbins)"
    },
    {
      "title": "string",
      "description": "string",
      "testimonialId": "string (MUST be Alex Hormozi)"
    },
    {
      "title": "string",
      "description": "string",
      "testimonialId": "string (match prospect's industry)"
    },
    {
      "title": "string",
      "description": "string",
      "testimonialId": "string (match prospect's industry - different from benefit 3)"
    }
  ],
  "roiCopy": "string",
  "whatYouGetIntro": "string"
}

---

## TONE GUIDELINES

- Direct and confident, not salesy or hype-y
- Results-focused with specific outcomes
- Personal—this should feel written for THIS prospect
- Professional but not corporate
- Reference their actual business, products, industry
- No fluff, no filler, no generic marketing speak
`;

export default PAGE_CONTENT_TEMPLATE;
