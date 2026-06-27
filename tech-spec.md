# Lloyds Bank Clone - Technical Specification

## Project Architecture

```
/mnt/agents/output/app/
├── src/
│   ├── components/              # Shared/Reusable Components
│   │   ├── Navbar.tsx           # Top utility bar + Main navigation
│   │   ├── MobileMenu.tsx       # Full-screen flyout menu
│   │   ├── Footer.tsx           # Multi-column footer
│   │   ├── CookieBanner.tsx     # GDPR cookie consent
│   │   ├── QuickLinks.tsx       # Gray bar link strip
│   │   ├── ProductCard.tsx      # Horizontal carousel card
│   │   ├── SectionHeading.tsx   # Reusable section title
│   │   └── Logo.tsx             # Lloyds horse SVG
│   ├── sections/                # Page-specific sections
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AppSection.tsx
│   │   │   ├── ProductsCarousel.tsx
│   │   │   ├── GoGettersSection.tsx
│   │   │   ├── CustomerSupportSection.tsx
│   │   │   ├── CoServicingSection.tsx
│   │   │   ├── CashInOutSection.tsx
│   │   │   ├── CreditScoreSection.tsx
│   │   │   ├── OnlineBankingSection.tsx
│   │   │   ├── SurveyResultsSection.tsx
│   │   │   └── APPScamsSection.tsx
│   │   ├── business/
│   │   │   ├── BusinessHero.tsx
│   │   │   ├── BusinessQuickLinks.tsx
│   │   │   ├── MTDBanner.tsx
│   │   │   └── BusinessProducts.tsx
│   │   ├── private/
│   │   │   ├── PrivateHero.tsx
│   │   │   └── PrivateContent.tsx
│   │   └── international/
│   │       ├── InternationalHero.tsx
│   │       ├── InternationalQuickLinks.tsx
│   │       └── InternationalProducts.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BusinessPage.tsx
│   │   ├── PrivateBankingPage.tsx
│   │   └── InternationalPage.tsx
│   ├── hooks/
│   │   └── useScrollReveal.ts   # Intersection observer for scroll animations
│   ├── effects/
│   │   ├── InkCursor.tsx        # Canvas 2D ink trail effect
│   │   ├── HeadingPhysics.tsx   # VFX-JS text deformation
│   │   ├── BrandCarousel.tsx    # 3D CSS text ring
│   │   ├── AtmosphericDepth.tsx # Three.js refractive sphere
│   │   └── TiltMockup.tsx       # 3D CSS tilt container
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles, Tailwind, fonts
├── public/
│   └── images/                  # Generated/downloaded images
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "three": "^0.170.0",
    "@vfx-js/core": "^0.11.2",
    "lucide-react": "^0.460.0",
    "sass": "^1.80.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.170.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Component Inventory

### Layout Components (shared across all pages)

| Component | Source | Notes |
|---|---|---|
| Navbar | Custom | Fixed dual-layer: top black utility bar + white main nav. Handles scroll state and active tab highlighting |
| MobileMenu | Custom | Full-screen overlay with accordion submenus. Triggered by Menu button |
| Footer | Custom | 5-column dark green footer. Reused across all pages |
| CookieBanner | Custom | Fixed bottom-right GDPR banner with Accept/Reject |

### Section Components (page-specific)

| Section | Page | Key Features |
|---|---|---|
| HeroSection | Home | Split layout (45/55), CTA buttons, AtmosphericDepth overlay |
| AppSection | Home | 2-column, phone image with TiltMockup effect |
| ProductsCarousel | Home | Horizontal scroll container with ProductCard items |
| GoGettersSection | Home | 2-column, image left, content right |
| CustomerSupportSection | Home | Soft green bg, interactive accordion |
| CoServicingSection | Home | Green banner + 2-column grid |
| CashInOutSection | Home | 2-column, map pin icon |
| CreditScoreSection | Home | Gauge image, CTA button |
| OnlineBankingSection | Home | Phone mockup, QR code, feature list |
| SurveyResultsSection | Home | Percentage stats, dot bar chart |
| APPScamsSection | Home | Warning info, rankings table |
| BusinessHero | Business | Dark green hero, £200 promo graphic |
| BusinessQuickLinks | Business | 4-column gray bar |
| MTDBanner | Business | Software promo banner |
| BusinessProducts | Business | Product grid cards |
| PrivateHero | Private | Full-bleed image hero, centered text |
| PrivateContent | Private | Relationship banking content |
| InternationalHero | International | Travel image hero, overlay text |
| InternationalQuickLinks | International | 4-column green bar |
| InternationalProducts | International | 4 product cards grid |

### Effect Components

| Effect | Tech | Complexity |
|---|---|---|
| InkCursor | Canvas 2D, custom animation loop | High |
| HeadingPhysics | @vfx-js/core, WebGL shaders | High |
| BrandCarousel | CSS 3D transforms, keyframes | Medium |
| AtmosphericDepth | Three.js, CubeCamera, ShaderMaterial | High |
| TiltMockup | CSS 3D transforms, mouse tracking | Medium |

## Animation Implementation Table

| Animation | Library / Approach | Implementation | Complexity |
|---|---|---|---|
| Ink Cursor Trail | Canvas 2D API | Custom rAF loop, velocity-based quadratic curves, gradient fade | High |
| Heading Physics Deformation | @vfx-js/core + GLSL | Text texture → WebGL shader with scroll-driven sin displacement | High |
| 3D Sphere Pulse | Three.js + ShaderMaterial | Custom vertex/fragment shaders, CubeCamera reflections, mouse-driven rotation | High |
| Phone 3D Tilt | Vanilla JS + CSS | mousemove → rotateX/Y transforms, specular highlight overlay | Medium |
| Brand Carousel Spin | CSS 3D + @keyframes | rotateX per character, translateZ, infinite spin animation | Medium |
| Section Scroll Reveal | IntersectionObserver + CSS | Fade-up entrance on viewport intersection | Low |
| Accordion Expand | CSS max-height + transition | Smooth height transition on hover/click | Low |
| Link Underline Hover | CSS ::after pseudo | scaleX(0→1) from center on hover | Low |
| Nav Scroll Shadow | JS scroll listener | Add box-shadow when scrollY > 10 | Low |
| Button Hover States | CSS transitions | Background-color, scale transforms | Low |
| Mobile Menu Slide | CSS transform | translateX(-100%→0) with backdrop | Low |

## State & Logic Plan

### Navigation State
- Active tab stored in URL (React Router)
- Mobile menu open/close: local useState
- Menu accordion expanded item: local useState

### Scroll Behaviors
- Navbar shadow: scroll event listener, toggle class
- Scroll reveal: IntersectionObserver on section containers
- Heading physics: @vfx-js/core handles its own scroll tracking

### Effects Lifecycle
- InkCursor: Mount on App level, cleanup on unmount
- HeadingPhysics: Mount per-heading, cleanup on unmount
- AtmosphericDepth: Mount on HeroSection, cleanup on unmount
- TiltMockup: Mount on AppSection, cleanup on unmount

## Key Technical Decisions

1. **No shadcn/ui for main components** - The design is too bespoke; custom components are more appropriate. shadcn components may be used for basic primitives if needed.

2. **React Router for page navigation** - 4 main routes: `/`, `/business`, `/private-banking`, `/international`

3. **Three.js for sphere, not React Three Fiber** - Raw Three.js gives more control over CubeCamera and custom shaders

4. **CSS 3D transforms for carousel/tilt** - No GSAP needed; native CSS handles these well

5. **IntersectionObserver for scroll reveals** - Native API, no need for scroll libraries

6. **Canvas 2D for ink cursor** - Not WebGL; simple enough for 2D context

## Performance Considerations

- Lazy-load Three.js scene (only on pages with HeroSection)
- @vfx-js/core effects initialized only when elements are in viewport
- Image optimization: WebP format, lazy loading
- `will-change: transform` on tilt and animated elements
- `contain: layout style paint` on carousel container
- Debounce scroll handlers (16ms)
