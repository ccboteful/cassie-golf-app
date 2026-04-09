import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import ZoomableImage from "@/components/ZoomableImage";
import { getAllCourses, getCourseBySlug, getHole, getHoleNeighbors } from "@/lib/courses";

export async function generateStaticParams() {
  const courses = await getAllCourses();

  return courses.flatMap((course) =>
    course.holes.map((hole) => ({
      slug: course.slug,
      number: String(hole.number),
    }))
  );
}

const metricValue = (value?: number) => (value && value > 0 ? value : "TBD");

const GREEN_NOTE_PLACEHOLDER = "Green contour details are included in the official hole description when provided.";

function buildCaddieStrategy(hole: {
  number: number;
  par: number;
  keyFeature: string;
  teeYardages: { bronze: number; red?: number };
}) {
  const scoringYardage = hole.teeYardages.red ?? hole.teeYardages.bronze;
  const teeLabel = hole.teeYardages.red ? "scoring" : "bronze";
  const feature = hole.keyFeature.toLowerCase();

  const openers = [
    "Caddie mode: ON 🎯",
    "Bag-drop briefing 🎯",
    "Boss-lady game plan 🎯",
    "Rosie caddie dispatch 🎯",
  ];
  const closers = [
    "Two putts, high-five, next tee. 😎",
    "Center-green energy all day and we cash the easy points. ✨",
    "No hero golf, just smart golf and swagger to the next box. 💃",
    "Fairways-and-fun protocol engaged. Let’s go. 🙌",
  ];

  const opener = openers[(hole.number - 1) % openers.length];
  const closer = closers[(hole.number - 1) % closers.length];

  const sideHint = feature.includes("right")
    ? "Favor the left-center window"
    : feature.includes("left")
      ? "Favor the right-center window"
      : "Take the widest center line";

  if (hole.par === 3) {
    const bunkerFront = Math.max(85, scoringYardage - 18);
    return `${opener} From the ${teeLabel} tee (~${scoringYardage}y), play your stock 130–150 shot with smooth tempo. ${
      feature.includes("bunker")
        ? `The bunker zone in the photo starts around ${bunkerFront}y, so fly that number and finish center-green.`
        : `Use the photo line and aim middle green first, flags second.`
    } If it’s between clubs, take the longer one and swing easy. ${closer}`;
  }

  const layup = Math.max(95, Math.min(140, scoringYardage - 35));
  const bunkerStart = Math.max(95, Math.min(130, scoringYardage - 55));
  const bunkerEnd = Math.max(bunkerStart + 15, Math.min(155, scoringYardage - 20));
  const approachLeft = Math.max(40, scoringYardage - 140);

  return `${opener} From the ${teeLabel} tee (~${scoringYardage}y), your 130–150 driver is perfect here. ${
    feature.includes("bunker")
      ? `The photo hazards look in play around ${bunkerStart}–${bunkerEnd}y, so ${sideHint.toLowerCase()} and keep it near ${layup}y.`
      : `${sideHint} and play for a comfy layup around ${layup}y.`
  } That leaves roughly ${approachLeft}-${approachLeft + 20}y in—pick your favorite short-iron/wedge and aim center-green. ${closer}`;
}

function buildBronzeGuidance(hole: { number: number; par: number; keyFeature: string; teeYardages: { bronze: number } }) {
  const bronze = hole.teeYardages.bronze;
  const firstShotTarget = Math.min(145, Math.max(120, bronze - 35));
  const feature = hole.keyFeature.toLowerCase();

  const bronzeOpeners = [
    "Bronze tee vibe check ✨",
    "Bronze-box pep talk ✨",
    "Bronze tee confidence note ✨",
    "Bronze lane game plan ✨",
  ];

  const bronzeOpener = bronzeOpeners[(hole.number - 1) % bronzeOpeners.length];

  const hazardHint = feature.includes("bunker")
    ? "Keep an eye on those bunkers in the hero photo and choose the side with more grass."
    : feature.includes("water")
      ? "Respect the water line in the photo—center-green is your happy place."
      : feature.includes("tree")
        ? "Use the tree lines in the photo as lane markers and stay in the wide corridor."
        : feature.includes("right")
          ? "The trouble leans right in this view, so favor left-center."
          : feature.includes("left")
            ? "The trouble leans left in this view, so favor right-center."
            : "Pick the widest landing window you can see in the photo and swing free.";

  if (hole.par === 3) {
    return `${bronzeOpener} At ~${bronze}y, this is usually one smooth full swing for your 130–150 range. ${hazardHint} Fun goal: middle of the green, happy dance, no hero shots needed.`;
  }

  return `${bronzeOpener} At ~${bronze}y, stripe one to about ${firstShotTarget}y and set up an easy second. ${hazardHint} Play smart, stay dry/sandy-free, and collect those stress-free wins.`;
}

export default async function HolePage({
  params,
}: {
  params: Promise<{ slug: string; number: string }>;
}) {
  const { slug, number } = await params;
  const holeNumber = Number(number);

  const course = await getCourseBySlug(slug);
  if (!course || Number.isNaN(holeNumber)) notFound();

  const hole = getHole(course, holeNumber);
  if (!hole) notFound();

  const neighbors = getHoleNeighbors(hole.number, course.holes.length);
  const heroImage = hole.imageUrl || course.imageUrl;
  const cleanedGreenNote = hole.greenNote?.trim() === GREEN_NOTE_PLACEHOLDER ? "" : hole.greenNote;
  const caddieStrategy = buildCaddieStrategy(hole);
  const bronzeGuidance = buildBronzeGuidance(hole);

  const aerialBBoxByRegion: Record<typeof course.region, string> = {
    north: "-93.8280,41.5932,-93.8090,41.6004",
    south: "-93.8280,41.5873,-93.8090,41.5940",
  };

  const aerialImageUrl = `https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage?bbox=${aerialBBoxByRegion[course.region]}&bboxSR=4326&size=2200,1600&format=jpgpng&interpolation=RSP_BilinearInterpolation&f=image`;
  const aerialMapUrl = `https://apps.nationalmap.gov/viewer/`;

  return (
    <div className="min-h-screen bg-[#FBF8F2] pb-32 md:pb-12">
      <header className="sticky top-0 z-40 border-b border-[#D9DDD5] bg-[#FBF8F2]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href={`/course/${course.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-[#D9DDD5] bg-[#F7F3EC] p-2 text-[#556B5D] transition hover:bg-[#EEE8DD]"
            aria-label="Back to course"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9A9186]">{course.name}</p>
            <h1 className="font-display text-[32px] leading-tight font-bold text-[#2A302A] sm:text-[36px]">Hole {hole.number} Guide</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl space-y-4 px-4 pt-5">
        <section className="overflow-hidden rounded-[20px] border border-[#DDD7CB] border-l-4 border-l-[#B5903A] bg-[#F5F0E7] p-5 shadow-[0_5px_16px_rgba(47,53,47,0.05)]">
          {heroImage ? (
            <div className="-mx-5 -mt-5 mb-5 border-b border-[#E5E1D9] bg-white p-5 sm:mx-0 sm:mt-0 sm:mb-5 sm:rounded-[14px] sm:border sm:p-3">
              <div className="h-64 w-full overflow-hidden rounded-[12px] border border-[#D9DDD5] bg-white sm:h-72">
                <ZoomableImage
                  src={heroImage}
                  alt={`${course.name} hole ${hole.number} image`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
                  containerClassName="relative"
                  imageClassName="object-contain sm:object-cover"
                />
              </div>
            </div>
          ) : null}

          <article className="rounded-2xl border border-[#DDD7CB] border-l-4 border-l-[#B5903A] bg-[#F7EDD4] p-5">
            <h2 className="font-display text-[24px] font-bold text-[#2A302A]">What this hole asks</h2>
            <p className="mt-3 text-base leading-[1.7] text-[#52514A]">{hole.keyFeature}</p>
          </article>

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#DDD7CB] bg-[#E4EBE2] px-3 py-1.5 text-[13px] font-semibold uppercase tracking-wide text-[#2A302A]">
                Par {hole.par}
              </span>
            </div>

            <div className="rounded-2xl border border-[#DDD7CB] bg-[#F5F0E7] p-3.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9A9186]">Tee Yardages</p>
              <div className="mt-2 grid grid-cols-5 overflow-hidden rounded-xl border border-[#DDD7CB]">
                <div className="border-r border-[#DDD7CB] bg-[#2C3A2E] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F9F6EF]">Black</div>
                <div className="border-r border-[#DDD7CB] bg-[#2C3A2E] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F9F6EF]">Green</div>
                <div className="border-r border-[#DDD7CB] bg-[#2C3A2E] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F9F6EF]">Blue</div>
                <div className="border-r border-[#DDD7CB] bg-[#2C3A2E] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F9F6EF]">Bronze</div>
                <div className="bg-[#2C3A2E] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[#F9F6EF]">Scoring</div>

                <div className="border-r border-t border-[#DDD7CB] bg-[#F5F0E7] px-2 py-2 text-center text-[15px] font-semibold text-[#2A302A]">{metricValue(hole.teeYardages.black)}</div>
                <div className="border-r border-t border-[#DDD7CB] bg-[#F5F0E7] px-2 py-2 text-center text-[15px] font-semibold text-[#2A302A]">{metricValue(hole.teeYardages.green)}</div>
                <div className="border-r border-t border-[#DDD7CB] bg-[#F5F0E7] px-2 py-2 text-center text-[15px] font-semibold text-[#2A302A]">{metricValue(hole.teeYardages.blue)}</div>
                <div className="border-r border-t border-[#DDD7CB] bg-[#F5F0E7] px-2 py-2 text-center text-[15px] font-semibold text-[#2A302A]">{metricValue(hole.teeYardages.bronze)}</div>
                <div className="border-t border-[#DDD7CB] bg-[#F5F0E7] px-2 py-2 text-center text-[15px] font-semibold text-[#2A302A]">{metricValue(hole.teeYardages.red)}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#DDD7CB] bg-[#F5F0E7] p-3.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9A9186]">Stroke Index</p>
              <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-xl border border-[#DDD7CB]">
                <div className="border-r border-[#DDD7CB] bg-[#2C3A2E] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#F9F6EF]">
                  Men
                </div>
                <div className="border-r border-[#DDD7CB] bg-[#2C3A2E] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#F9F6EF]">
                  Ladies
                </div>
                <div className="bg-[#2C3A2E] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#F9F6EF]">
                  Scoring
                </div>

                <div className="border-r border-t border-[#DDD7CB] bg-[#F5F0E7] px-3 py-2 text-center text-[16px] font-semibold text-[#2A302A]">
                  {hole.handicap}
                </div>
                <div className="border-r border-t border-[#DDD7CB] bg-[#F5F0E7] px-3 py-2 text-center text-[16px] font-semibold text-[#2A302A]">
                  {hole.ladiesHandicap ?? "TBD"}
                </div>
                <div className="border-t border-[#DDD7CB] bg-[#F5F0E7] px-3 py-2 text-center text-[16px] font-semibold text-[#2A302A]">
                  {hole.scoringHandicap ?? "TBD"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <article className="rounded-2xl border border-[#DDD7CB] bg-[#F5F0E7] p-4">
              <h3 className="font-display text-[19px] font-bold text-[#2A302A]">Strategy</h3>
              <p className="mt-2 text-base leading-[1.65] text-[#52514A]">{caddieStrategy}</p>
              <p className="mt-3 border-t border-[#DDD7CB] pt-3 text-[15px] leading-[1.6] text-[#3D5449]">{bronzeGuidance}</p>
            </article>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#DDD7CB] bg-[#F5F0E7] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <h2 className="font-display text-[24px] font-bold text-[#2A302A]">Satellite view</h2>
          <div className="mt-3 rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[#556B5D]" />
              <div className="flex-1">
                {hole.satelliteImageUrl ? (
                  <>
                    <Link
                      href={hole.satelliteImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-xl border border-[#D9DDD5] bg-white"
                      aria-label="Open full-resolution satellite image"
                    >
                      <img
                        src={hole.satelliteImageUrl}
                        alt={`${course.name} hole ${hole.number} satellite view`}
                        className="h-auto max-h-[460px] w-full object-contain"
                        loading="lazy"
                      />
                    </Link>
                    <p className="mt-2 text-xs text-[#7B746C]">Tap the image to open full-resolution satellite view.</p>
                  </>
                ) : (
                  <>
                    <p className="text-base leading-[1.6] text-[#52514A]">
                      Public USGS NAIP aerial imagery for the {course.region === "north" ? "North" : "South"} course area.
                    </p>
                    <p className="mt-2 text-sm text-[#7B746C]">
                      Note: imagery recency varies by capture cycle and may lag current course conditions.
                    </p>

                    <Link
                      href={aerialImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block overflow-hidden rounded-xl border border-[#D9DDD5] bg-white"
                      aria-label="Open full-resolution aerial image"
                    >
                      <img
                        src={aerialImageUrl}
                        alt={`${course.name} aerial view (USGS NAIP)`}
                        className="h-auto max-h-[460px] w-full object-contain"
                        loading="lazy"
                      />
                    </Link>
                    <p className="mt-2 text-xs text-[#7B746C]">Tap the image to open full-resolution aerial view.</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={aerialImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#556B5D] px-4 py-2.5 text-sm font-semibold text-[#F9F5EC] transition hover:bg-[#4B524B]"
                      >
                        <MapPin className="h-4 w-4" />
                        Open aerial map
                      </Link>
                      <Link
                        href={aerialMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#D9DDD5] bg-[#F7F3EC] px-4 py-2.5 text-sm font-semibold text-[#2F352F] transition hover:bg-[#EEE8DD]"
                      >
                        Open USGS viewer
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#DDD7CB] bg-[#F5F0E7] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <h2 className="font-display text-[24px] font-bold text-[#2A302A]">Green Read</h2>

          <article className="mt-3 rounded-2xl border border-[#DDD7CB] bg-[#F5F0E7] p-4 shadow-[0_2px_8px_rgba(47,53,47,0.06)]">
            {cleanedGreenNote ? <p className="text-base leading-[1.6] text-[#52514A]">{cleanedGreenNote}</p> : null}
            {hole.mapImageUrl ? (
              <Link
                href={hole.mapImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block overflow-hidden rounded-xl border border-[#D9DDD5] bg-white"
                aria-label="Open full-resolution green map"
              >
                <img
                  src={hole.mapImageUrl}
                  alt={`${course.name} hole ${hole.number} green map`}
                  className="h-auto w-full object-contain"
                  loading="lazy"
                />
              </Link>
            ) : null}
          </article>
        </section>

        <section
          id="hole-jump"
          className="rounded-[20px] border border-[#DDD7CB] bg-[#F5F0E7] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]"
        >
          <h2 className="font-display text-[24px] font-bold text-[#2A302A]">Quick jump</h2>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {course.holes.map((item) => (
              <Link
                key={item.number}
                href={`/course/${course.slug}/hole/${item.number}`}
                className={`flex min-h-10 items-center justify-center rounded-full border px-2 text-sm font-semibold transition ${
                  item.number === hole.number
                    ? "border-[#2C3A2E] bg-[#2C3A2E] text-[#FDFAF4]"
                    : "border-[#DDD7CB] bg-[#E4EBE2] text-[#2A302A] hover:bg-[#8FA693]"
                }`}
              >
                {item.number}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-t-[#B5903A] bg-[rgba(247,243,236,0.95)] p-3 backdrop-blur md:hidden">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-[auto,1fr,auto] items-center gap-2">
          <Link
            href={`/course/${course.slug}/hole/${neighbors.prev}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl border border-[#DDD7CB] bg-[#E4EBE2] px-3 py-2.5 text-sm font-semibold text-[#2A302A]"
          >
            <ArrowLeft className="h-4 w-4" /> Prev
          </Link>

          <Link
            href="#hole-jump"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DDD7CB] bg-[#F5F0E7] px-3 py-2.5 text-sm font-semibold text-[#2A302A]"
          >
            <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-[#2C3A2E] px-2 text-[13px] font-semibold text-[#FDFAF4]">
              {hole.number}
            </span>
            Quick jump
          </Link>

          <Link
            href={`/course/${course.slug}/hole/${neighbors.next}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl bg-[#2C3A2E] px-3 py-2.5 text-sm font-semibold text-[#FDFAF4]"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
