# Third-party scorecard cross-check (DMGCC North/South)

Date: 2026-03-19

## Goal
Conservatively verify existing course facts (yardage by tee, par, handicap/routing context) in `lib/data/dmgcc-local.json` against public third-party listings.

## Sources checked
1. GolfLink — North
   - https://www.golflink.com/golf-courses/ia/west-des-moines/des-moines-golf-country-club-2763
2. GolfLink — South
   - https://www.golflink.com/golf-courses/ia/west-des-moines/des-moines-golf-country-club-2764
3. 18Birdies — Des Moines Country Club listing
   - https://18birdies.com/golf-courses/club/b7a813a0-86ac-11e4-8c28-020000005b00/des-moines-country-club
4. Arccos mapped-course search (public)
   - Landing page: https://www.arccosgolf.com/pages/course-map-search
   - Backing endpoint observed from page bundle:
     - `https://api.arccosgolf.com/courseSearchPublic?...&name=`
5. Garmin Golf course locator (public)
   - Landing page: https://www.garmin.com/en-US/golf-courses/
   - Backing endpoints observed from page app bundle/network:
     - `https://www.garmin.com/golf-courses/api/courses?...`
     - `https://www.garmin.com/golf-courses/api/states?...`
6. Golfify
   - Searched for public DMGCC North/South listings via web search; no clearly attributable Golfify page for these two specific DMGCC courses was found in this pass.

## Findings used

### North Course
- Existing app data already models North as **Par 72** and **7,301** tips yards.
- 18Birdies listing preview also shows **Length 7301 yds** and **TOT 72**, which supports retaining current North totals.
- Arccos public mapped-course search returns **Des Moines Golf and CC - North** with **par 72** and **18 holes**.
- Garmin Golf public course locator returns **Des Moines Golf & Country Club ~ North** in West Des Moines with **18 holes** (listing metadata only; no tee-yardage or handicap breakdown on this endpoint).
- GolfLink currently shows a conflicting **Par 73 / 7,200** presentation for North.

**Decision:** keep existing North totals and hole model from official DMGCC source; retain third-party values as cross-check context only.

### South Course
- Existing app data models South as **Par 72** and **7,347** tips yards.
- Arccos public mapped-course search returns **Des Moines Golf and CC - South** with **par 72** and **18 holes**.
- Garmin Golf public course locator returns **Des Moines Golf & Country Club ~ South** in West Des Moines with **18 holes** (listing metadata only; no tee-yardage or handicap breakdown on this endpoint).
- GolfLink currently shows **Par 73 / 7,103** for South, conflicting with official source data already used in the app.

**Decision:** keep existing South totals and hole model from official DMGCC source; retain third-party values as cross-check context only.

## Handicap + tee-yardage note
- Third-party handicap/tee breakdown displays are present but can differ by tee set and/or data vintage.
- Arccos public search output in this pass exposed course-level metadata (name/location/holes/par), but not per-tee yardage or handicap indexes.
- Garmin public golf-courses API in this pass exposed listing metadata (name/location/holes/contours/new/updated), but not scorecard-level tee yardage or handicap indexes.
- No cross-source consensus strong enough to justify replacing the existing per-hole values extracted from the official DMGCC page.
- Therefore this update did **not** overwrite hole-level handicap or tee-yardage values.

## Public API / machine-readable source check

Potential API-like or structured sources evaluated during this pass:

1. **Arccos course map search**
   - Landing page: https://www.arccosgolf.com/pages/course-map-search
   - Public endpoint observed in bundle and queried directly:
     - `https://api.arccosgolf.com/courseSearchPublic?latitude=...&longitude=...&distance=...&limit=...&name=...`
   - Result: endpoint returned DMGCC North/South entries with course-level metadata (including `par: 72` and `noOfHoles: 18`); no tee-by-tee yardage or handicap indexes were exposed by this endpoint.

2. **Garmin Golf course locator**
   - Landing page: https://www.garmin.com/en-US/golf-courses/
   - Public endpoints observed in app/network and queried directly:
     - `https://www.garmin.com/golf-courses/api/courses?...`
     - `https://www.garmin.com/golf-courses/api/states?...`
   - Result: endpoint returned DMGCC North/South listing records (name/city/address/holes/flags), but not scorecard-level yardage/par-by-tee/handicap detail.

3. **BlueGolf Course Database pages**
   - North: https://course.bluegolf.com/bluegolf/course/course/desmoinesgccnorth/detailedscorecard.htm
   - South: https://course.bluegolf.com/bluegolf/course/course/desmoinesgccsouth/detailedscorecard.htm
   - Result: blocked by Human Verification / HTTP 405 in this environment, so not reliably ingestible in an automated pipeline.

4. **18Birdies listing payload**
   - Public course page contains embedded structured state in HTML, but no documented public API endpoint was identified in this pass.
   - Practical use here: conservative preview cross-check only (North length/par context), not a canonical importer.

5. **GolfLink and Golfify**
   - No documented public API endpoint for these DMGCC previews was identified in this pass.
   - Golfify did not return a clearly attributable DMGCC North/South listing during search.

6. **Generic golf-course APIs (market services)**
   - Several vendor APIs appear publicly advertised (e.g., golfapi.io, golfcourseapi.com), but without prior vetting/licensing and direct DMGCC provenance they were not used for factual updates.

Decision:
- Keep official DMGCC source as canonical for hole facts.
- Use third-party previews only for conflict notes / sanity checks.

## Confidence summary
- High confidence: keeping existing official DMGCC-based hole data as canonical.
- Medium confidence: Arccos/Garmin public endpoints are useful for confirming course presence and high-level parity context only.
- Medium confidence: third-party routing context is useful for discrepancy warnings only.
- Low confidence: Golfify availability for these specific courses (no stable public listing found during this pass).
- Low confidence: practicality of BlueGolf as an automated source in this environment due verification blocking.
