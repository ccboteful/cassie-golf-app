export type Region = "north" | "south";

import { isSanityConfigured, sanityClient, urlForImage } from "@/lib/sanity";

export type Hole = {
  number: number;
  par: number;
  yardage: number;
  handicap: number;
  wind: string;
  keyFeature: string;
  danger: string;
  greenNote: string;
  strategy: string;
  teeYardages: {
    tips: number;
    member: number;
    forward: number;
  };
  imageUrl?: string | null;
  mapImageUrl?: string | null;
};

export type Course = {
  slug: string;
  name: string;
  region: Region;
  city: string;
  address: string;
  par: number;
  rating: number;
  slope: number;
  yardage: number;
  designer: string;
  yearBuilt: number;
  practice: string;
  paceTarget: string;
  walking: "easy" | "moderate" | "challenging";
  summary: string;
  signaturePlan: string;
  localTips: string[];
  holes: Hole[];
  imageUrl?: string | null;
  mapImageUrl?: string | null;
};

const pars18 = [4, 5, 3, 4, 4, 5, 3, 4, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4];

const handicap18 = [11, 3, 15, 7, 9, 1, 17, 5, 13, 10, 2, 18, 8, 12, 4, 16, 6, 14];

function buildHoles(config: {
  baseYardages: number[];
  windPattern: string[];
  featurePattern: string[];
  dangerPattern: string[];
  greenPattern: string[];
  strategyPattern: string[];
}): Hole[] {
  return pars18.map((par, index) => {
    const number = index + 1;
    const yardage = config.baseYardages[index];
    return {
      number,
      par,
      yardage,
      handicap: handicap18[index],
      wind: config.windPattern[index],
      keyFeature: config.featurePattern[index],
      danger: config.dangerPattern[index],
      greenNote: config.greenPattern[index],
      strategy: config.strategyPattern[index],
      teeYardages: {
        tips: yardage,
        member: Math.max(95, yardage - 28),
        forward: Math.max(80, yardage - 63),
      },
    };
  });
}

export const courses: Course[] = [
  {
    slug: "stratton-woods",
    name: "Stratton Woods Golf Club",
    region: "north",
    city: "Johnston",
    address: "10000 Stratton Woods Dr, Johnston, IA",
    par: 72,
    rating: 72.5,
    slope: 135,
    yardage: 7234,
    designer: "Robert Trent Jones II",
    yearBuilt: 2005,
    practice: "Double-ended range, 2 practice greens, short-game bunker complex",
    paceTarget: "4h 15m",
    walking: "challenging",
    summary:
      "Championship-style routing through rolling timber and creek corridors. Requires disciplined misses and confident approach distance control.",
    signaturePlan:
      "Play the back nine as a position game. Driver is only automatic on 11 and 15; otherwise favor the 3-wood and attack from fairway numbers.",
    localTips: [
      "Morning rounds usually play one club longer on exposed greens (holes 2, 6, 15).",
      "On 4 and 13, short-right of the pin leaves uphill chips. Long is dead.",
      "If the wind turns south after noon, hole 18 becomes a true three-shot par 4.5.",
    ],
    holes: buildHoles({
      baseYardages: [412, 545, 188, 436, 421, 572, 165, 448, 399, 428, 558, 173, 417, 393, 561, 196, 442, 430],
      windPattern: [
        "Crosswind L→R",
        "Into prevailing",
        "Quartering R→L",
        "Into prevailing",
        "Helping",
        "Into prevailing",
        "Swirl above trees",
        "Crosswind R→L",
        "Helping",
        "Into prevailing",
        "Helping",
        "Quartering L→R",
        "Crosswind L→R",
        "Helping",
        "Into prevailing",
        "Swirl near green",
        "Crosswind R→L",
        "Into prevailing",
      ],
      featurePattern: [
        "Right-center bunker pinch at 265",
        "Split fairway with left layup shelf",
        "Elevated tee over wetland pocket",
        "Dogleg left framed by mature oaks",
        "Creek crossing at 295",
        "Three-tier fairway landing zones",
        "Diagonal green with false front",
        "Narrow chute tee shot",
        "Bowl fairway feeding center",
        "Hidden left bunker complex",
        "Reachable in two from right plateau",
        "Long narrow green with back shelf",
        "Creek hugs right side from 140 in",
        "Short par 4 with crowned landing",
        "Par 5 wrapping around lake",
        "Deep green protected by front bunker",
        "Uphill approach to tabletop green",
        "Finishing hole with amphitheater green",
      ],
      dangerPattern: [
        "Miss left catches native fescue",
        "Second shot can run through into rough hollow",
        "Short-right falls 12 feet below putting surface",
        "Long approach leaves impossible downhill chip",
        "Aggressive line can bound into creek",
        "Over-clubbing second finds cross bunkers",
        "Back pin is one pace from slope",
        "Rough left blocks angle entirely",
        "Front bunker leaves 20-yard splash",
        "Bail-right blocked by sycamores",
        "Water starts at 90 yards out",
        "Anything long brings shaved runoff",
        "Right miss can plug in wet bank",
        "Driver through fairway leaves no stance",
        "Layup too far right blocks third",
        "Short misses spin back off false front",
        "Long-left brings deep rough and trees",
        "Nerves + water long left close match",
      ],
      greenPattern: [
        "Subtle back-to-front tilt",
        "Middle shelf separates front/back pins",
        "Strong right-to-left spine",
        "Fast surface running toward front-right",
        "Back tier 4 feet above center",
        "Two-tier with harsh front ridge",
        "Small green, firm in summer",
        "Wide but shallow from fairway",
        "Gentle bowl in center",
        "Rear shelf can reject long irons",
        "Large contours but fair speeds",
        "Pin-high left is ideal leave",
        "Firm approach can release 15+ yards",
        "Putts from above hole are defensive",
        "Long but receptive with spin",
        "Tilted hard from back-left",
        "Middle ridge causes severe break",
        "Front section often quickest on course",
      ],
      strategyPattern: [
        "Take 3-wood to the right edge of bunker; full wedge is better than half shot.",
        "Layup to 110 unless wind helps. Green in two only from left half of fairway.",
        "Favor center green regardless of pin. Take par and move on.",
        "Hybrid off tee to avoid running through fairway. Attack with controlled 8/9 iron.",
        "Commit to a line over left bunker and trust carry number.",
        "Three-shot mindset. Keep second short of cross bunkers and wedge close.",
        "One extra club with smooth tempo; misses short are punished.",
        "Hit a fade hold-up tee ball. Avoid left rough at all costs.",
        "Use slope to feed approach from right-center.",
        "Club down if front pin. Back pin accepts high flight only.",
        "If drive finds right plateau, green light with fairway wood.",
        "Play to heart of green; two putts are a win.",
        "Aim left-center on approach to stay clear of creek gravity.",
        "Pick a conservative club off tee and wedge from 85–105.",
        "Left layup line opens green; avoid heroic carry unless perfect lie.",
        "Trust front edge number and let shot release.",
        "Take less than driver and leave full approach uphill.",
        "Pick landing target, commit to tempo, and accept par as excellent.",
      ],
    }),
  },
  {
    slug: "tattersall-reserve",
    name: "Tattersall Reserve",
    region: "north",
    city: "Waukee",
    address: "9410 Tattersall Ln, Waukee, IA",
    par: 72,
    rating: 71.8,
    slope: 130,
    yardage: 7092,
    designer: "Keith Foster",
    yearBuilt: 2009,
    practice: "Large bentgrass putting green, heated bays, wedge targets 40-120 yards",
    paceTarget: "4h 05m",
    walking: "moderate",
    summary:
      "Playable off the tee but demanding around greens. Broad fairways hide strategic bunkering that determines scoring opportunities.",
    signaturePlan:
      "Win with wedges and conservative targets. Use the center of greens, then attack only when yardage + lie match perfectly.",
    localTips: [
      "Holes 1-4 play firmer in afternoon; approach landings need extra spin.",
      "The 10th and 13th greens are quicker than they look from fairway level.",
      "After rain, favor high side putts; drainage valleys stay slick.",
    ],
    holes: buildHoles({
      baseYardages: [398, 532, 171, 417, 401, 548, 183, 427, 386, 411, 536, 162, 429, 374, 552, 181, 438, 347],
      windPattern: [
        "Helping",
        "Crosswind R→L",
        "Into prevailing",
        "Helping",
        "Crosswind L→R",
        "Into prevailing",
        "Quartering L→R",
        "Helping",
        "Calm pocket",
        "Into prevailing",
        "Helping",
        "Swirl near trees",
        "Crosswind L→R",
        "Helping",
        "Into prevailing",
        "Quartering R→L",
        "Into prevailing",
        "Helping",
      ],
      featurePattern: [
        "Generous fairway with right bunker teeth",
        "Par 5 with centerline bunker at 300",
        "Island-like green visual from elevated tee",
        "S-curve fairway with left kick slope",
        "Straight hole with narrow green opening",
        "Wide landing then pinch at layup zone",
        "Long par 3 over native grasses",
        "Dogleg right around waste area",
        "Short par 4 with split-level fairway",
        "Uphill start to inward nine",
        "Reachable par 5 with center creek",
        "One-club par 3, wind exposed",
        "Dogleg left to elevated target",
        "Driveable look with severe front bunker",
        "Three-shot par 5 with angled green",
        "Par 3 to shallow tabletop",
        "Strong par 4 into slope",
        "Risk/reward finisher with water right",
      ],
      dangerPattern: [
        "Right rough blocks angle to left pins",
        "Bold second can kick into bunker lips",
        "Short is wet, long leaves touchy downhill chip",
        "Left kick can run through into rough",
        "Approach from rough can't hold back shelf",
        "Layup too long catches right pot bunker",
        "Missing right leaves impossible up-and-down",
        "Over-fade finds waste bunker",
        "Driver can run out into fairway bunker",
        "Pulling approach finds deep left trap",
        "Creek bisects layup and go zones",
        "Back pin is one step from edge",
        "Right miss tumbles 8 feet below surface",
        "Going for green often plugs in steep face",
        "Third from left rough blocked by bunker lip",
        "Anything short spins off front",
        "Long iron from rough won't hold putting surface",
        "Water right is in play from tee to green",
      ],
      greenPattern: [
        "Medium pace, subtle low point center-right",
        "Back half pitched toward fairway",
        "Strong crown center",
        "Wide but with hidden right shelf",
        "Small target with steep surrounds",
        "Front bowl can feed close",
        "Fastest green on front nine",
        "Gentle contours, true roll",
        "Narrow depth with front tongue",
        "Upper-left shelf rewards precision",
        "Center hump divides pin zones",
        "Firm surface with little spin grab",
        "Back tier narrow but scoreable",
        "Shallow green, front pin dangerous",
        "Large but segmented by spine",
        "Subtle left-to-right all day",
        "Backboard behind rear pins",
        "Sloped toward water on right edge",
      ],
      strategyPattern: [
        "Commit to center-right tee line, then fire at middle of green.",
        "Lay up to favorite wedge if drive is not perfect angle.",
        "Take one extra and aim center; short side is automatic bogey.",
        "Favor left-center fairway to open green entrance.",
        "Hit controlled draw to hold green from mid-iron range.",
        "Treat as positional par 5 and trust wedge game.",
        "Wind check at treetops before pulling club.",
        "Hybrid is often best from tee; keep bunker out of play.",
        "If unsure, lay back and attack with full wedge.",
        "Use front edge yardage and keep approach under hole.",
        "Choose go/no-go by lie, not by ego.",
        "Flighted shot holds line better than high spinner here.",
        "Take one more club and swing smooth up the hill.",
        "Unless downwind, play this as true two-shot hole.",
        "Left side layup gives easiest third shot angle.",
        "Land pin-high; long leaves near-impossible save.",
        "Accept green center target and two-putt par.",
        "Pick conservative line away from water and finish strong.",
      ],
    }),
  },
  {
    slug: "ankeny-country-club",
    name: "Ankeny Country Club",
    region: "north",
    city: "Ankeny",
    address: "314 SW Irvinedale Dr, Ankeny, IA",
    par: 72,
    rating: 70.8,
    slope: 125,
    yardage: 6948,
    designer: "Perry Maxwell Renovation Team",
    yearBuilt: 1963,
    practice: "Classic short-game area and flat putting lane for speed drills",
    paceTarget: "3h 58m",
    walking: "easy",
    summary:
      "Traditional parkland golf with tree-lined corridors and classic greens. Accuracy and short-game imagination matter more than raw power.",
    signaturePlan:
      "Play for angle over distance. Keep tee balls below the hole side and trust bump-and-run options around the greens.",
    localTips: [
      "Greens can be deceptively quick after 2 PM in summer.",
      "On 5 and 14, approaches from right half hold surface better.",
      "In spring, 17 usually plays softer than card suggests.",
    ],
    holes: buildHoles({
      baseYardages: [381, 518, 164, 404, 392, 533, 152, 416, 371, 403, 521, 168, 408, 366, 540, 175, 429, 387],
      windPattern: [
        "Calm pocket",
        "Helping",
        "Crosswind R→L",
        "Into prevailing",
        "Helping",
        "Quartering L→R",
        "Calm pocket",
        "Into prevailing",
        "Helping",
        "Crosswind L→R",
        "Helping",
        "Into prevailing",
        "Quartering R→L",
        "Helping",
        "Crosswind L→R",
        "Into prevailing",
        "Helping",
        "Quartering R→L",
      ],
      featurePattern: [
        "Narrow opening then generous landing",
        "Gentle dogleg right par 5",
        "Short iron par 3 over front bunker",
        "Tree-lined straightaway",
        "Par 4 with left fairway tilt",
        "Par 5 with creek at layup yardage",
        "Short one-shotter with tiny green",
        "Long par 4 with uphill finish",
        "Scoring hole with broad fairway",
        "Dogleg left framed by cottonwoods",
        "Reachable par 5 from right-center",
        "Mid-iron par 3 to deep green",
        "Slight dogleg right with bunker left",
        "Short par 4 demanding placement",
        "Classic three-shot par 5",
        "Par 3 over valley to angled green",
        "Strong par 4 with raised target",
        "Home hole through clubhouse corridor",
      ],
      dangerPattern: [
        "Pulling drive gets blocked by maples",
        "Second can run through fairway into rough",
        "Front bunker leaves steep explosion",
        "Long approach catches back rough knoll",
        "Left rough creates semi-blind approach",
        "Creek snags overly aggressive layups",
        "Short miss rolls 20 feet back",
        "Right miss finds deep bunker shelf",
        "Complacent drives can leak into trees",
        "Inside corner is out-of-bounds",
        "Attempting green in two from bad lie brings double",
        "Back shelf putts are lightning fast",
        "Left bunker blocks lower-flight approaches",
        "Driver through fairway reaches trouble",
        "Third shot from rough won't spin",
        "Any long miss leaves downhill chip",
        "Approach short-right funnels away",
        "Nerves cause pulled tee balls left",
      ],
      greenPattern: [
        "Gentle left-to-right tilt",
        "Front-to-back grade with soft backstop",
        "Small round target with little margin",
        "Middle tier can create big breaks",
        "Subtle bowl center-left",
        "Wide green with shallow front",
        "Firm and narrow",
        "Back-right shelf is premium target",
        "Large and friendly putting surface",
        "Classic Maxwell-style interior contours",
        "Big green with quiet movement",
        "Long green split by central spine",
        "Back section quick in summer",
        "Small target with strong perimeter runoff",
        "Receptive center section",
        "Top shelf only 8 paces deep",
        "Slight crown repels weak approaches",
        "Gentle closing green with audience feel",
      ],
      strategyPattern: [
        "Hybrid to fairway center sets up full wedge.",
        "Layup to 95-110 and attack with spin.",
        "Take dead-center line and trust distance.",
        "Middle of green is smart to avoid big number.",
        "Shape tee shot with fairway camber, not against it.",
        "Position second short of creek and wedge close.",
        "One-club extra with three-quarter swing works best.",
        "Fairway first; this hole rewards patience.",
        "Aggressive wedge can produce birdie look.",
        "Keep tee ball right of center to avoid OB corner.",
        "Go in two only from perfect lie and wind help.",
        "Play to tier nearest pin; distance control is everything.",
        "Take club that guarantees front edge carry.",
        "Pick placement club and commit; don't force driver.",
        "Third shot distance beats hero second every time.",
        "Aim middle and trust putter.",
        "Take one more club and swing smooth uphill.",
        "Focus on tempo and finish with center-green target.",
      ],
    }),
  },
  {
    slug: "indianola-country-club",
    name: "Indianola Country Club",
    region: "south",
    city: "Indianola",
    address: "1610 Country Club Rd, Indianola, IA",
    par: 72,
    rating: 71.5,
    slope: 130,
    yardage: 7104,
    designer: "Dick Nugent",
    yearBuilt: 1996,
    practice: "Range with fairway-like turf and target greens at 75/100/135",
    paceTarget: "4h 08m",
    walking: "moderate",
    summary:
      "Modern parkland layout with strategic water and elevated greens. Good rhythm and conservative misses lead to steady scoring.",
    signaturePlan:
      "Control spin into elevated greens and avoid short-sided misses. Most doubles start from forcing approaches at tucked pins.",
    localTips: [
      "Front nine greens are generally softer than the back after rain.",
      "Hole 12 often plays downwind despite what you feel on the tee.",
      "The rough around 18 is sticky; prioritize fairway from tee.",
    ],
    holes: buildHoles({
      baseYardages: [404, 541, 177, 423, 397, 559, 169, 435, 384, 419, 547, 163, 432, 378, 565, 186, 441, 399],
      windPattern: [
        "Into prevailing",
        "Helping",
        "Crosswind L→R",
        "Into prevailing",
        "Helping",
        "Crosswind R→L",
        "Quartering R→L",
        "Into prevailing",
        "Helping",
        "Crosswind L→R",
        "Helping",
        "Quartering R→L",
        "Into prevailing",
        "Helping",
        "Crosswind L→R",
        "Into prevailing",
        "Quartering L→R",
        "Helping",
      ],
      featurePattern: [
        "Opening par 4 with fairway squeeze",
        "Long par 5 with right-side pond",
        "One-shot hole to angled green",
        "Dogleg left around mature trees",
        "Straightaway par 4 with raised green",
        "Par 5 with layup creek",
        "Mid-length par 3 over bunker",
        "Demanding par 4 along tree line",
        "Short par 4 scoring chance",
        "Back nine opener with center bunker",
        "Par 5 climbing uphill",
        "Short par 3 with exposed wind",
        "Dogleg right with narrow throat",
        "Drive-and-pitch hole with tricky green",
        "Longest par 5 on property",
        "Long par 3 over valley",
        "Par 4 with downhill tee shot",
        "Finishing par 4 toward clubhouse lake",
      ],
      dangerPattern: [
        "Overcut drive reaches right rough pocket",
        "Second too aggressive finds pond",
        "Back-left miss leaves near-impossible chip",
        "Pulled tee shot blocked by oaks",
        "Approach short spins back down slope",
        "Creek catches indecisive layups",
        "Left bunker is deep and penal",
        "Right trees close approach window",
        "Over-driver can run through fairway",
        "Front bunker leaves blind explosion",
        "Second shot can kick left into rough",
        "Wind gusts punish high-spin shots",
        "Fairway bunker sits exactly at 260",
        "Long leaves putt/chip down severe slope",
        "Third from rough doesn't hold green",
        "Anything short rolls 15 yards back",
        "Left miss leaves hanging lie",
        "Water long-right in play on approach",
      ],
      greenPattern: [
        "Gentle slope to front-left",
        "Wide with subtle center ridge",
        "Narrow green with back shelf",
        "Medium speed with side tilt",
        "Raised target with runoff all sides",
        "Large but segmented putting surface",
        "Firm front edge in summer",
        "Back tier rewards precise distance",
        "Friendly center bowl",
        "Two-tier green with right shelf",
        "Receptive if approach is high",
        "Small target, tricky reads",
        "Shallow entrance, deep back",
        "Fastest green late afternoon",
        "Broad green split by ridge",
        "Long and narrow shape",
        "Upper-right pin shelf tiny",
        "Subtle breaks but quick downhill putts",
      ],
      strategyPattern: [
        "Take fairway finder and wedge from middle number.",
        "Three-shot plan unless drive is premium.",
        "Aim middle and trust lag putting.",
        "Play to fat side; avoid short-siding left.",
        "One extra club for elevated target.",
        "Lay to favorite wedge then attack.",
        "Flight it lower to control spin into wind.",
        "Hybrid off tee can be smarter than driver.",
        "Aggressive line only if fairway is firm and downwind.",
        "Center-left tee ball opens angle.",
        "Choose layup yardage intentionally.",
        "Commit to one shot shape and execute.",
        "Play for angle, not max distance.",
        "Club down for position and dial in wedge.",
        "Treat as true three-shotter.",
        "Take enough club and smooth tempo.",
        "Fairway first, then middle-green approach.",
        "Keep approach below hole for stress-free two-putt.",
      ],
    }),
  },
  {
    slug: "pleasant-hill-country-club",
    name: "Pleasant Hill Country Club",
    region: "south",
    city: "Pleasant Hill",
    address: "5300 Copper Creek Dr, Pleasant Hill, IA",
    par: 72,
    rating: 72.0,
    slope: 132,
    yardage: 7196,
    designer: "Hurdzan/Fry",
    yearBuilt: 2001,
    practice: "Excellent short-game park with shaved runoffs and bunker variety",
    paceTarget: "4h 12m",
    walking: "challenging",
    summary:
      "Big, bold visuals with dramatic elevation and water carries. Rewards committed swings and precise wedge spin control.",
    signaturePlan:
      "Pick conservative targets on forced carries, then score with wedges on 4, 9, 14, and 18.",
    localTips: [
      "Afternoon southwest wind heavily affects holes 6, 8, and 15.",
      "Back-left pins on 7 and 16 are sucker pins — center green is smart.",
      "Greens get noticeably faster after a dry stretch.",
    ],
    holes: buildHoles({
      baseYardages: [415, 548, 182, 409, 426, 571, 171, 444, 392, 423, 555, 166, 436, 361, 573, 189, 447, 388],
      windPattern: [
        "Crosswind R→L",
        "Into prevailing",
        "Helping",
        "Quartering L→R",
        "Into prevailing",
        "Crosswind L→R",
        "Helping",
        "Into prevailing",
        "Crosswind R→L",
        "Into prevailing",
        "Helping",
        "Quartering R→L",
        "Into prevailing",
        "Helping",
        "Crosswind L→R",
        "Into prevailing",
        "Quartering L→R",
        "Helping",
      ],
      featurePattern: [
        "Par 4 over rolling fairway",
        "Par 5 with creek guarding green",
        "Par 3 over ravine",
        "Short par 4 with split fairway",
        "Demanding par 4 uphill",
        "Par 5 bending around lake",
        "Mid-iron par 3 with deep bunker",
        "Long par 4 with narrow landing",
        "Scorable par 4 downhill",
        "Back-nine par 4 with center bunker",
        "Reachable par 5 if drive finds speed slot",
        "Par 3 with severe green tilt",
        "Dogleg left to elevated green",
        "Driveable-look par 4",
        "True three-shot par 5",
        "Long one-shotter over waste",
        "Par 4 with sloping fairway",
        "Risk/reward closer with water left",
      ],
      dangerPattern: [
        "Left rough blocks sightline",
        "Overzealous second reaches creek",
        "Short miss falls 25 feet",
        "Wrong fairway side removes green angle",
        "Long approach leaves impossible downhiller",
        "Water hugs layup and go lines",
        "Bunker lip can force sideways escape",
        "Right miss finds native area",
        "Driver can run through fairway",
        "Bunker at 265 catches draw line",
        "Second shot from rough brings double",
        "Back shelf putts can race away",
        "Pulling approach feeds into left hazard",
        "Long is dead over green",
        "Third shot from low lie launches too low",
        "Anything short is auto bogey",
        "Fairway tilt kicks balls into rough",
        "Water + nerves decide score here",
      ],
      greenPattern: [
        "Slight right-to-left at cup speed",
        "Three sections separated by ridges",
        "Small target with firm apron",
        "Front bowl and steep back",
        "Fast back-to-front run",
        "Wide but heavily contoured",
        "Compact putting surface",
        "Long green with subtle shelves",
        "Gentle and makeable",
        "Left shelf holds tougher pins",
        "Big target, but miss tier = three putt",
        "Strong tilt from left to right",
        "Elevated with shaved runoff",
        "Shallow front, deep back",
        "Large but split by diagonal ridge",
        "Firm and narrow",
        "Rear hump can kill pace",
        "Front section receptive, back is slick",
      ],
      strategyPattern: [
        "Commit to right-center line and avoid forced shape.",
        "Lay up to number unless wind and lie are perfect.",
        "Take enough club to clear front edge confidently.",
        "Choose side of fairway based on pin location.",
        "Play for middle and trust putter.",
        "Treat as placement hole first, power hole second.",
        "One extra club with smooth rhythm.",
        "Fairway wood off tee is often best score play.",
        "Attack with wedge if drive stays short of runout.",
        "Shape tee shot away from center bunker.",
        "Go only from clean lie and positive wind.",
        "Play to nearest tier and accept 20-footer.",
        "Take a club that carries all trouble.",
        "Position tee ball, then wedge below hole.",
        "Three-shot discipline beats heroics.",
        "Middle of green all day.",
        "Use fairway contour, don't fight it.",
        "Choose conservative line, then finish with commitment.",
      ],
    }),
  },
  {
    slug: "des-moines-country-club",
    name: "Des Moines Country Club",
    region: "south",
    city: "West Des Moines",
    address: "1600 Jordan Creek Pkwy, West Des Moines, IA",
    par: 72,
    rating: 73.5,
    slope: 140,
    yardage: 7398,
    designer: "Pete Dye Renovation",
    yearBuilt: 1947,
    practice: "Tour-level range, TrackMan bays, and dedicated tournament short-game greens",
    paceTarget: "4h 20m",
    walking: "challenging",
    summary:
      "Elite test with championship distance, deep bunkers, and high-pressure finishing stretch. Demands complete ball-striking and smart misses.",
    signaturePlan:
      "Play to fat zones, especially from 150-210 yards. Protect par on 10-13, then pick scoring spots on 14 and 18.",
    localTips: [
      "Evening rounds can get gusty at treetop level despite calm on the tee.",
      "On firm days, land approaches 5-8 yards short of front numbers.",
      "Bunkers are deep; avoid short-siding at all costs.",
    ],
    holes: buildHoles({
      baseYardages: [426, 565, 196, 441, 433, 584, 187, 457, 408, 439, 572, 205, 448, 397, 589, 214, 463, 414],
      windPattern: [
        "Into prevailing",
        "Crosswind L→R",
        "Helping",
        "Into prevailing",
        "Crosswind R→L",
        "Into prevailing",
        "Quartering L→R",
        "Into prevailing",
        "Helping",
        "Crosswind L→R",
        "Into prevailing",
        "Helping",
        "Crosswind R→L",
        "Into prevailing",
        "Crosswind L→R",
        "Into prevailing",
        "Quartering R→L",
        "Helping",
      ],
      featurePattern: [
        "Strong opener with flanking bunkers",
        "Long par 5 with split fairway landing",
        "Long par 3 to elevated green",
        "Dogleg right with creek right",
        "Tough par 4 with crowned fairway",
        "Massive par 5 with strategic layup shelves",
        "Par 3 over deep bunker complex",
        "Long par 4 to angled green",
        "Subtle scoring chance before turn",
        "Back-nine grinder with narrow corridor",
        "Par 5 with creek crossing third shot",
        "Championship par 3 over water",
        "Dogleg left with uphill finish",
        "Shorter par 4 with premium wedge target",
        "Monster par 5 with amphitheater green",
        "Brutal long par 3",
        "Long par 4 framed by grandstands",
        "Finale with water guarding left",
      ],
      dangerPattern: [
        "Miss right leaves hanging lie",
        "Second from rough reaches deep bunkers",
        "Short misses funnel into collection basin",
        "Creek right eats pushed approaches",
        "Drive too aggressive runs into rough canyon",
        "Layup too bold enters center bunkers",
        "Front-right bunker leaves near-vertical lip",
        "Any miss long leaves terrifying putt/chip",
        "Driver can leak into hidden cross bunker",
        "Trees both sides punish slight misses",
        "Third shot over-water decision causes doubles",
        "Water all front; no bailout short",
        "Left bunker blocks spin into green",
        "Wedge overdraw can spin off false edge",
        "Three shots still requires exact distance",
        "Short side short-right is almost dead",
        "Approach from rough rarely holds",
        "Pressure + water create volatile scores",
      ],
      greenPattern: [
        "True but quick championship speed",
        "Tiered with severe back section",
        "Narrow and firm",
        "Back-to-front with side contour",
        "Subtle but fast toward front",
        "Large with hidden interior breaks",
        "Compact and elevated",
        "Long with right shelf",
        "Friendly middle bowl",
        "Firm target requiring carry commitment",
        "Two distinct halves",
        "Fast and glassy in afternoons",
        "Raised green with runoff",
        "Small but receptive",
        "Big green split by diagonal ridge",
        "Very narrow entry",
        "Strong tilt toward front-right",
        "Closing green with multiple plateaus",
      ],
      strategyPattern: [
        "Fairway finder first, then center-green approach.",
        "Treat as controlled three-shotter unless ideal setup.",
        "Take enough club and avoid short miss at all costs.",
        "Aim left-center to stay clear of creek line.",
        "Favor position over distance from tee.",
        "Choose layup shelf that matches favorite wedge distance.",
        "Wind check twice; commit to one stock shot.",
        "Play for front edge and accept long birdie putt.",
        "Aggressive only with perfect angle and number.",
        "Take conservative line and keep bogey off card.",
        "Plan third shot yardage before teeing off.",
        "Middle green target every time.",
        "Use extra club uphill and trust tempo.",
        "Attack if in fairway, otherwise center.",
        "Three quality shots required; no freebies.",
        "Take one more club and choke down.",
        "Prioritize fairway even with less club.",
        "Pick a conservative target, breathe, and execute.",
      ],
    }),
  },
];

const cmsCourseQuery = `*[_type == "course"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  city,
  address,
  par,
  rating,
  slope,
  yardage,
  designer,
  yearBuilt,
  practice,
  paceTarget,
  walking,
  summary,
  signaturePlan,
  localTips,
  image,
  mapImage,
  "regionSlug": select(
    defined(region->slug.current) => region->slug.current,
    defined(region) => region,
    "north"
  ),
  "holes": coalesce(holes, holesArray)[] {
    number,
    par,
    yardage,
    handicap,
    wind,
    keyFeature,
    danger,
    greenNote,
    strategy,
    teeYardages,
    image,
    mapImage
  }
}`;

type SanityHole = {
  number?: number;
  par?: number;
  yardage?: number;
  handicap?: number;
  wind?: string;
  keyFeature?: string;
  danger?: string;
  greenNote?: string;
  strategy?: string;
  teeYardages?: { tips?: number; member?: number; forward?: number };
  image?: unknown;
  mapImage?: unknown;
};

type SanityCourse = {
  name?: string;
  slug?: string;
  regionSlug?: string;
  city?: string;
  address?: string;
  par?: number;
  rating?: number;
  slope?: number;
  yardage?: number;
  designer?: string;
  yearBuilt?: number;
  practice?: string;
  paceTarget?: string;
  walking?: "easy" | "moderate" | "challenging";
  summary?: string;
  signaturePlan?: string;
  localTips?: string[];
  image?: unknown;
  mapImage?: unknown;
  holes?: SanityHole[];
};

function normalizeHole(hole: SanityHole, index: number): Hole {
  const number = hole.number ?? index + 1;
  const yardage = hole.yardage ?? 0;

  return {
    number,
    par: hole.par ?? 4,
    yardage,
    handicap: hole.handicap ?? Math.min(number, 18),
    wind: hole.wind ?? "",
    keyFeature: hole.keyFeature ?? "",
    danger: hole.danger ?? "",
    greenNote: hole.greenNote ?? "",
    strategy: hole.strategy ?? "",
    teeYardages: {
      tips: hole.teeYardages?.tips ?? yardage,
      member: hole.teeYardages?.member ?? Math.max(95, yardage - 28),
      forward: hole.teeYardages?.forward ?? Math.max(80, yardage - 63),
    },
    imageUrl: urlForImage(hole.image),
    mapImageUrl: urlForImage(hole.mapImage),
  };
}

function normalizeCourse(course: SanityCourse): Course | null {
  if (!course.slug || !course.name) return null;

  const normalizedRegion: Region = course.regionSlug === "south" ? "south" : "north";
  const normalizedHoles = (course.holes ?? [])
    .slice()
    .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
    .map(normalizeHole);

  return {
    slug: course.slug,
    name: course.name,
    region: normalizedRegion,
    city: course.city ?? "",
    address: course.address ?? "",
    par: course.par ?? 72,
    rating: course.rating ?? 0,
    slope: course.slope ?? 0,
    yardage: course.yardage ?? 0,
    designer: course.designer ?? "",
    yearBuilt: course.yearBuilt ?? 0,
    practice: course.practice ?? "",
    paceTarget: course.paceTarget ?? "",
    walking: course.walking ?? "moderate",
    summary: course.summary ?? "",
    signaturePlan: course.signaturePlan ?? "",
    localTips: course.localTips ?? [],
    holes: normalizedHoles,
    imageUrl: urlForImage(course.image),
    mapImageUrl: urlForImage(course.mapImage),
  };
}

let cachedCourses: Course[] | null = null;

export async function getAllCourses(): Promise<Course[]> {
  if (cachedCourses) return cachedCourses;

  if (!isSanityConfigured || !sanityClient) {
    cachedCourses = courses;
    return cachedCourses;
  }

  try {
    const cmsData = await sanityClient.fetch<SanityCourse[]>(cmsCourseQuery);
    const normalized = cmsData.map(normalizeCourse).filter((course): course is Course => Boolean(course));

    if (normalized.length > 0) {
      cachedCourses = normalized;
      return cachedCourses;
    }
  } catch (error) {
    console.warn("Failed to fetch Sanity content, falling back to local seed data.", error);
  }

  cachedCourses = courses;
  return cachedCourses;
}

export async function getCoursesByRegion(region: Region): Promise<Course[]> {
  const allCourses = await getAllCourses();
  return allCourses.filter((course) => course.region === region);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const allCourses = await getAllCourses();
  return allCourses.find((course) => course.slug === slug);
}

export function getHole(course: Course, number: number): Hole | undefined {
  return course.holes.find((hole) => hole.number === number);
}

export function getHoleNeighbors(number: number, total = 18) {
  const prev = number <= 1 ? total : number - 1;
  const next = number >= total ? 1 : number + 1;
  return { prev, next };
}
