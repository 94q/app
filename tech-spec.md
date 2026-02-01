# TEDx ICHB Colentina - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | React + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Animation | Framer Motion + GSAP |
| 3D Graphics | Three.js + React Three Fiber |
| Icons | Lucide React |
| State | React hooks |

## 2. Tailwind Configuration

```javascript
// tailwind.config.js extensions
{
  theme: {
    extend: {
      colors: {
        'bg-primary': '#000000',
        'bg-secondary': '#0a0a0a',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B3B3B3',
        'text-muted': '#808080',
        'accent-purple': '#7C3AED',
        'accent-purple-hover': '#6D28D9',
        'accent-gold': '#D4A853',
        'accent-cyan': '#22D3EE',
        'accent-pink': '#EC4899',
        'accent-teal': '#14B8A6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
}
```

## 3. Component Inventory

### Shadcn/UI Components (Pre-installed)
- Button (customized for CTA)

### Custom Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Navigation` | `scrolled: boolean` | Fixed nav with scroll behavior |
| `HeroSection` | - | Main hero with 3D brain |
| `ContentSection` | `title, subtitle, content, layout, brainPosition` | Reusable content section |
| `TextSection` | `lines: string[]` | Centered text-only section |
| `SpeakersSection` | - | Carousel with mystery speakers |
| `TeamSection` | - | Team members display |
| `CTASection` | - | Final call-to-action |
| `CookieBanner` | - | Cookie consent banner |
| `FloatingTriangles` | `density: 'low' | 'medium' | 'high'` | Background particle effect |
| `BrainVisualization` | `position: 'left' | 'right'` | 3D brain component |
| `SpeakerCard` | `locked: boolean` | Individual speaker card |
| `TeamMember` | `name, role, shapes` | Team member item |

## 4. Animation Implementation Plan

| Interaction | Tech | Implementation |
|-------------|------|----------------|
| Page Load Sequence | Framer Motion | `AnimatePresence` + staggered `motion.div` |
| Navigation Scroll | React + CSS | `useScroll` hook, toggle `scrolled` class |
| Hero Text Reveal | Framer Motion | `staggerChildren: 0.1`, `y: 30 -> 0`, `opacity: 0 -> 1` |
| 3D Brain Animation | Three.js | Rotating particle system, vertex shader |
| Floating Triangles | CSS + Framer | Random positions, `animate-float` keyframes |
| Section Scroll Reveal | GSAP ScrollTrigger | `scrub: true`, `start: "top 80%"` |
| Button Hover | Tailwind + FM | `whileHover={{ scale: 1.02 }}` |
| Link Underline | CSS | `::after` pseudo-element, width transition |
| Speakers Carousel | Framer Motion | `AnimatePresence` with slide variants |
| CTA Particle Effect | Canvas/Three.js | Particle explosion from center |
| Cookie Banner | Framer Motion | Slide up from bottom |

### Animation Timing Specs

```typescript
// Animation constants
const ANIMATION = {
  duration: {
    micro: 0.15,
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
    verySlow: 1.2,
  },
  easing: {
    default: [0.4, 0, 0.2, 1],
    bounce: [0.34, 1.56, 0.64, 1],
    smooth: [0.25, 0.1, 0.25, 1],
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
};
```

## 5. Project File Structure

```
/mnt/okcomputer/output/app/
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── Navigation.tsx
│   │   ├── CookieBanner.tsx
│   │   ├── FloatingTriangles.tsx
│   │   ├── BrainVisualization.tsx
│   │   ├── SpeakerCard.tsx
│   │   └── TeamMember.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ContentSection.tsx
│   │   ├── TextSection.tsx
│   │   ├── SpeakersSection.tsx
│   │   ├── TeamSection.tsx
│   │   └── CTASection.tsx
│   ├── hooks/
│   │   ├── useScrollPosition.ts
│   │   └── useInView.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── animations.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 6. Package Installation

```bash
# After project initialization
npm install framer-motion gsap @gsap/react three @react-three/fiber @react-three/drei
npm install -D @types/three
```

## 7. Implementation Order

1. **Setup**: Initialize project, configure Tailwind, install dependencies
2. **Global**: Create animation constants, hooks, floating triangles
3. **Navigation**: Build nav with scroll behavior
4. **Hero**: Implement hero section with 3D brain
5. **Content Sections**: Build reusable content section component
6. **Text Sections**: Create centered text sections
7. **Speakers**: Build carousel with mystery cards
8. **Team**: Create team section
9. **CTA**: Build final CTA with particle effect
10. **Cookie Banner**: Add cookie consent
11. **Polish**: Fine-tune animations, responsive design
12. **Build & Deploy**: Production build and deployment

## 8. Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Mobile | < 640px | Single column, stacked layout |
| Tablet | 640-1024px | Two columns with reduced spacing |
| Desktop | > 1024px | Full layout as designed |

## 9. Performance Considerations

- Lazy load 3D brain component
- Use `will-change` sparingly
- Implement `prefers-reduced-motion` checks
- Optimize particle count based on device
- Use `React.memo` for static components
