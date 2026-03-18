# Cassie - Golf Course Navigator

A mobile-first web app for exploring Des Moines golf courses with interactive maps, hole-by-hole breakdowns, and strategic guidance.

## Project Overview

**Domain:** `golf.lakehouse-studios.com`  
**Concept:** Users choose North or South Des Moines courses, then explore individual courses with graphical maps, hole details, and strategic advice.

---

## MVP Definition

### Core Features (Must Have)

1. **Geographic Selection**
   - Home screen with two clear options: "North Des Moines" / "South Des Moines"
   - List of courses in selected region

2. **Course Explorer**
   - Course cards with key info (par, rating, slope, holes, location)
   - Click to view course details

3. **Hole Navigation**
   - Interactive graphical map of each course
   - Hole-by-hole breakdown (1-18)
   - Hole details: par, yardage, key features

4. **Strategy & Tips**
   - "How to Play" section for each course
   - Hole-specific strategy tips
   - Best practices for each hole

5. **Mobile-First UX**
   - App-like feel (PWA)
   - Touch-friendly navigation
   - Fast loading, smooth transitions
   - Offline capability (basic)

### Nice-to-Have (Phase 2)

- User favorites/bookmarks
- Score tracking
- Course reviews/ratings
- Weather integration
- GPS-based course finder
- Social sharing

---

## Recommended Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router) with React 19
- **Styling:** Tailwind CSS + shadcn/ui components
- **Maps:** Mapbox GL JS or Leaflet (lighter)
- **PWA:** Next.js PWA plugin, service workers
- **State:** Zustand (lightweight) or React Query
- **Animations:** Framer Motion for smooth transitions

### Backend/Hosting
- **Hosting:** Vercel (seamless Next.js deployment)
- **Database:** PostgreSQL (Supabase or Neon)
- **CMS:** Sanity.io or Contentful (for course/hole content)
- **Images:** Cloudinary or Vercel Blob Storage

### Why This Stack?
- **Next.js:** Excellent mobile performance, SEO, PWA support
- **Vercel:** Zero-config deployment, fast CDN
- **Sanity:** Flexible content modeling, great for structured course data
- **Mapbox:** Beautiful interactive maps, mobile-optimized

---

## Content/Data Model

### Course Schema (Sanity.io)

```javascript
{
  _type: "course",
  name: "Stratton Woods Golf Club",
  slug: "stratton-woods",
  region: "north", // "north" | "south"
  address: "10000 Stratton Woods Dr, Johnston, IA 50131",
  coordinates: {
    lat: 41.6892,
    lng: -93.6234
  },
  image: {
    asset: _ref to course map image
  },
  holes: 18,
  par: 72,
  rating: 72.5,
  slope: 135,
  yardage: 7234,
  designer: "Robert Trent Jones II",
  yearBuilt: 2005,
  website: "https://strattonwoodsgolf.com",
  description: "A challenging championship course...",
  strategy: "Long par-4s require accurate driving...",
  holes: [
    {
      number: 1,
      par: 4,
      yardage: 412,
      handicap: 14,
      type: "par-4",
      description: "Dogleg right with water on left...",
      strategy: "Aim for right side of fairway...",
      image: _ref to hole map
    },
    // ... holes 2-18
  ],
  lastUpdated: "2026-03-18"
}
```

### Course Regions

**North Des Moines:**
- Stratton Woods Golf Club
- Tattersall Golf Club
- Jordan Creek Country Club
- Valley West Country Club
- Ankeny Country Club
- Johnston Country Club

**South Des Moines:**
- Indianola Country Club
- Pleasant Hill Country Club
- Waukee Country Club
- Urbandale Country Club
- Des Moines Country Club
- East Des Moines Golf Club

---

## User Flow

```
┌─────────────────┐
│   HOME SCREEN   │
│  (North/South)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│ NORTH │ │ SOUTH│
└───┬───┘ └──┬───┘
    │         │
    └────┬────┘
         │
┌────────▼────────┐
│  COURSE LIST    │
│  (region)       │
└────────┬────────┘
         │
    ┌────┴────┐
    │  click  │
    ▼         ▼
┌─────────────────────┐
│   COURSE DETAIL     │
│  - Course info      │
│  - Interactive map  │
│  - Hole selector    │
└────────┬────────────┘
         │
    ┌────┴────┐
    │  click  │
    ▼         ▼
┌─────────────────────┐
│   HOLE DETAIL       │
│  - Hole map         │
│  - Par/yardage      │
│  - Strategy tips    │
│  - Key features     │
└─────────────────────┘
```

---

## Mobile UX Priorities

1. **Thumb-Friendly Navigation**
   - Bottom navigation for hole selection
   - Large touch targets (min 44px)
   - Swipe gestures for hole navigation

2. **Fast Performance**
   - Lazy load images
   - Preload course data
   - Optimistic UI updates

3. **Visual Clarity**
   - High contrast for outdoor use
   - Readable typography at small sizes
   - Clear visual hierarchy

4. **App-Like Feel**
   - Smooth page transitions
   - Loading states
   - Pull-to-refresh
   - Haptic feedback (if native)

5. **PWA Features**
   - Add to home screen
   - Offline caching for visited courses
   - Push notifications (Phase 2)

---

## Project Structure

```
golf-app/
├── app/
│   ├── layout.tsx          # Root layout, PWA meta tags
│   ├── page.tsx            # Home (North/South selection)
│   ├── north/
│   │   └── page.tsx        # North courses list
│   ├── south/
│   │   └── page.tsx        # South courses list
│   ├── course/
│   │   └── [slug]/
│   │       ├── page.tsx    # Course detail
│   │       └── hole/
│   │           └── [number]/
│   │               └── page.tsx  # Hole detail
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── CourseCard.tsx
│   ├── CourseMap.tsx
│   ├── HoleMap.tsx
│   ├── HoleSelector.tsx
│   ├── StrategyPanel.tsx
│   └── Navigation.tsx
├── lib/
│   ├── sanity.ts           # Sanity client
│   ├── courses.ts          # Data fetching
│   └── utils.ts
├── sanity/
│   ├── schemaTypes/
│   │   ├── course.ts
│   │   ├── hole.ts
│   │   └── index.ts
│   └── structure.ts
├── public/
│   ├── manifest.json       # PWA manifest
│   └── icons/
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Next Steps

1. **Setup Next.js project** with TypeScript, Tailwind
2. **Configure Sanity.io** project and schema
3. **Build core components** (CourseCard, CourseMap, HoleMap)
4. **Create sample data** for 2-3 courses
5. **Implement PWA** manifest and service worker
6. **Design course maps** (SVG or image-based)
7. **Deploy to Vercel** on staging subdomain
8. **Connect custom domain** (golf.lakehouse-studios.com)

---

## Open Questions for Cassie

1. **Course Maps:** Do you have existing course maps/images, or should we create new ones?
2. **Content Source:** Should we pull course data from an existing source (GolfNow, course websites), or manually curate?
3. **Interactive Maps:** How detailed should the hole maps be? Simple diagrams or detailed topographic-style?
4. **User Accounts:** Do users need to create accounts for favorites/score tracking, or keep it anonymous?
5. **Monetization:** Any plans for ads, premium features, or partnerships with courses?
6. **Branding:** Any specific color scheme or branding guidelines to follow?
7. **Timeline:** When do you need the MVP launched?

---

## Timeline Estimate

- **Week 1:** Project setup, Sanity configuration, core components
- **Week 2:** Course/hole data entry, map creation
- **Week 3:** PWA implementation, testing, refinement
- **Week 4:** Deployment, domain setup, launch

**Total:** ~4 weeks to MVP
