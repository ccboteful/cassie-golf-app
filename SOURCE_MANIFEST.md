# Des Moines GCC Data + Image Source Manifest

Last updated: 2026-03-19

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
     - tee yardages shown for black/green/blue/bronze
     - hole descriptions
     - hole image URLs (`/images/dynamic/getImage.gif?ID=...`)
     - club address
     - "two 18-hole golf courses designed by Pete Dye" statement

## Image assets used
Downloaded from official DMGCC public image endpoints and stored locally under `public/images/dmgcc/`:

- `public/images/dmgcc/overview/club-golf-banner.jpg`
  - Source: https://dmgcc.org/images/dynamic/getImage.gif?ID=100117&width=2400
  - Note: this is the shared golf page hero image (club-level), not a dedicated per-course aerial.

- North hole images:
  - `public/images/dmgcc/north/hole-01.jpg` ... `hole-18.jpg`
  - Sources: `https://dmgcc.org/images/dynamic/getImage.gif?ID=100158&width=1600` ... `ID=100175&width=1600`

- South hole images:
  - `public/images/dmgcc/south/hole-01.jpg` ... `hole-18.jpg`
  - Sources: `https://dmgcc.org/images/dynamic/getImage.gif?ID=100177&width=1600` ... `ID=100194&width=1600`

### High-resolution refresh (2026-03-18)
- Prior hole assets were all `600x825` images from the same official IDs.
- Official endpoint supports width parameter (`&width=`) and returns larger public renditions.
- Hole assets were refreshed to `1600x2200` (same aspect ratio, sharper detail).
- Overview image refreshed from `1600x899` to `2400x1348`.
- Replacement audit report: `evidence/highres-replacement-report.json`.

Raw downloads were used during ingestion and are not required at runtime.

## What is complete
- North + South courses replaced sample/demo fallback content.
- 18 holes each (36 total) populated with official public par/handicap/tee yardage and official hole description text where available.
- Official hole images wired into hole pages.
- Shared official golf hero image wired as course overview image for both courses.
- Satellite/aerial view added to hole pages via USGS NAIP imagery viewer (public, no API key required).

## Third-party preview validation (2026-03-19)
Additional public previews were checked to validate whether any conservative updates were warranted:

- GolfLink North: https://www.golflink.com/golf-courses/ia/west-des-moines/des-moines-golf-country-club-2763
- GolfLink South: https://www.golflink.com/golf-courses/ia/west-des-moines/des-moines-golf-country-club-2764
- 18Birdies club listing: https://18birdies.com/golf-courses/club/b7a813a0-86ac-11e4-8c28-020000005b00/des-moines-country-club
- Arccos course map search: https://www.arccosgolf.com/pages/course-map-search (public endpoint observed: `https://api.arccosgolf.com/courseSearchPublic?...`)
- Garmin Golf course locator: https://www.garmin.com/en-US/golf-courses/ (public endpoint observed: `https://www.garmin.com/golf-courses/api/courses?...`)
- Golfify: searched, but no clearly attributable DMGCC North/South public listing found during this pass.

## Satellite/aerial imagery source (2026-03-19)
- USGS NAIP (National Agriculture Imagery Program) via The National Map image service
  - Service URL: https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer
  - Hole-page aerial preview source: `exportImage` endpoint with fixed North/South course bounding boxes in WGS84 (`bboxSR=4326`) and no API key.
  - Bounding boxes are aligned to the DMGCC property footprint (OSM geocoded golf-course envelope around 1600 Jordan Creek Pkwy) and split into north/south course-area views.
  - Interactive fallback viewer: https://apps.nationalmap.gov/viewer/
  - Notes:
    - NAIP imagery is public/free and can lag current conditions.
    - No paid dependency or API key required.
    - Current implementation is course-area aerial context (North vs South), not per-green precision georeferencing.

Outcome:
- Existing official DMGCC-derived hole data remained canonical.
- Added course-level local notes to flag routing/par conflicts visible on GolfLink previews.
- North totals in-app (Par 72, 7301) align with the 18Birdies preview; GolfLink currently shows conflicting totals.
- Arccos public mapped-course endpoint lists both DMGCC North/South as 18-hole courses with `par: 72`, supporting existing par context.
- Garmin public course locator endpoint lists both DMGCC North/South in West Des Moines as 18-hole courses, but does not expose per-tee yardage or handicap facts for conservative overwrite.
- South GolfLink preview also conflicts with official totals already in-app.

Evidence doc:
- `evidence/third-party-scorecard-crosscheck-2026-03-19.md`

### API/source practicality note (2026-03-19)
- Arccos exposes a public `courseSearchPublic` endpoint (used by their mapped-course page) that is useful for course presence and high-level metadata (e.g., holes/par), but it did not expose tee-by-tee yardage or handicap indexes in this pass.
- Garmin exposes public golf-courses listing endpoints (`/golf-courses/api/courses`, `/golf-courses/api/states`) that return course-list metadata; they did not expose scorecard-level yardage/handicap data in this pass.
- BlueGolf detailed-scorecard URLs for DMGCC North/South were tested but returned human-verification blocks (HTTP 405) in this environment, so they are not currently reliable for automated ingestion.
- No documented public API endpoint was identified for GolfLink / 18Birdies / Golfify course previews during this pass.
- Generic third-party golf APIs were discovered via search, but were not adopted because provenance/licensing for DMGCC-specific canonical facts was not verified.

## What is missing / uncertain (not fabricated)
1. **Dedicated per-course aerial/flyover image**
   - Public official page exposed only one shared golf hero image plus hole photos.
   - No distinct official public aerial image for North vs South was found during this pass.
   - Current strategy: shared official club golf image used as overview placeholder for each course.

2. **Official public USGA course rating/slope**
   - Not found on official DMGCC page at time of capture.
   - Fields are set to `0` in local fallback and rendered as `TBD` in UI.

3. **Source anomalies retained as-is**
   - North #12 uses split yardages (e.g., `160/194`) depending on pin/green section; app stores the back value for each tee (`194/138/138/129`) for single-number display consistency.
   - South #12 shows a blue-tee value that appears anomalous relative to black tees on the source page.
   - These were not "corrected" by guesswork.

## Reproducibility
Extraction helper script:
- `scripts/extract-dmgcc-official-data.py`

This script fetches `https://dmgcc.org/golf` with a browser user-agent and extracts hole data into JSON.
