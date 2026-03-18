# Des Moines GCC Data + Image Source Manifest

Last updated: 2026-03-18

## Repository scope
This app now uses real public content for:
- **Des Moines Golf & Country Club — North Course**
- **Des Moines Golf & Country Club — South Course**

Fallback/local seed data is stored in:
- `lib/data/dmgcc-local.json`

## Primary factual source (official)
1. DMGCC Golf page (official club website)
   - URL: https://dmgcc.org/golf
   - Used for:
     - hole-by-hole **par**
     - hole-by-hole **handicap** (men's index)
     - tee yardages shown for black/green/blue/gold
     - hole descriptions
     - hole image URLs (`/images/dynamic/getImage.gif?ID=...`)
     - club address
     - "two 18-hole golf courses designed by Pete Dye" statement

## Image assets used
Downloaded from official DMGCC public image endpoints and stored locally under `public/images/dmgcc/`:

- `public/images/dmgcc/overview/club-golf-banner.jpg`
  - Source: https://dmgcc.org/images/dynamic/getImage.gif?ID=100117
  - Note: this is the shared golf page hero image (club-level), not a dedicated per-course aerial.

- North hole images:
  - `public/images/dmgcc/north/hole-01.jpg` ... `hole-18.jpg`
  - Sources: `ID=100158` ... `ID=100175`

- South hole images:
  - `public/images/dmgcc/south/hole-01.jpg` ... `hole-18.jpg`
  - Sources: `ID=100177` ... `ID=100194`

Raw downloads were used during ingestion and are not required at runtime.

## What is complete
- North + South courses replaced sample/demo fallback content.
- 18 holes each (36 total) populated with official public par/handicap/tee yardage and official hole description text where available.
- Official hole images wired into hole pages.
- Shared official golf hero image wired as course overview image for both courses.

## What is missing / uncertain (not fabricated)
1. **Dedicated per-course aerial/flyover image**
   - Public official page exposed only one shared golf hero image plus hole photos.
   - No distinct official public aerial image for North vs South was found during this pass.
   - Current strategy: shared official club golf image used as overview placeholder for each course.

2. **Official public USGA course rating/slope**
   - Not found on official DMGCC page at time of capture.
   - Fields are set to `0` in local fallback and rendered as `TBD` in UI.

3. **Source anomalies retained as-is**
   - North #12 uses split yardages (e.g., `160/194`) depending on pin/green section.
   - South #12 shows a blue-tee value that appears anomalous relative to black tees on the source page.
   - These were not "corrected" by guesswork.

## Reproducibility
Extraction helper script:
- `scripts/extract-dmgcc-official-data.py`

This script fetches `https://dmgcc.org/golf` with a browser user-agent and extracts hole data into JSON.
