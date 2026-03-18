# Cassie Golf App

Next.js golf course navigator with Sanity CMS-backed content (with automatic local fallback).

## What is live now

- App reads courses from **Sanity** when environment variables are configured.
- App falls back to bundled local DMGCC data in `lib/data/dmgcc-local.json` if Sanity is not configured or fetch fails.
- Sanity schemas are set up for:
  - `region` documents
  - `course` documents
  - nested `hole` objects
  - strategy/playbook fields at course + hole level
  - optional image/map fields at course + hole level

## 1) Local app setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

If `.env.local` has valid `NEXT_PUBLIC_SANITY_*` values, app loads live CMS content. If not, it still works using fallback data.

## 2) Connect Sanity project

1. Create a Sanity project (if you don't already have one).
2. Put your project id/dataset in `.env.local`.
3. Start Studio:

```bash
npm run sanity:dev
```

## 3) Seed fallback content into Sanity

1. Create a Sanity API token with write access.
2. Add `SANITY_API_TOKEN` to `.env.local`.
3. Run:

```bash
npm run seed:sanity
```

This seeds 2 regions + current fallback courses and holes into Sanity.

## 4) Deploy Studio (optional but recommended)

```bash
npm run sanity:deploy
```

Sanity CLI prints the hosted Studio URL (share it with Cassie to edit content).

## Content model summary

### Region (`region`)
- title
- slug (`north` / `south`)
- subtitle
- sortOrder

### Course (`course`)
- core course metadata (name, slug, city, address, par/rating/slope/yardage, designer, year)
- `region` reference
- playbook fields (`summary`, `signaturePlan`, `localTips`)
- optional `image` + `mapImage`
- `holes[]`

### Hole (`hole` object)
- number/par/yardage/handicap
- playbook fields (`wind`, `keyFeature`, `danger`, `greenNote`, `strategy`)
- tee yardages (`tips`, `member`, `forward`)
- optional `image` + `mapImage`

## Notes

- The app is intentionally resilient: if Sanity is unavailable, fallback content keeps the app usable.
- Route behavior and UI are unchanged (`/north`, `/south`, `/course/[slug]`, `/course/[slug]/hole/[number]`).
