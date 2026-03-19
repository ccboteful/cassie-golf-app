import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Flag, Gauge, Target, Wind } from "lucide-react";
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

const metricValue = (value: number) => (value > 0 ? value : "TBD");

const hasMeaningfulText = (value: string) => value.trim().length > 0;

const isSparseNote = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  if (["tbd", "n/a", "na", "none", "unknown", "not available"].includes(normalized)) return true;
  return normalized.length < 38;
};

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
  const dangerIsSparse = isSparseNote(hole.danger);

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
            <p className="text-[13px] uppercase tracking-[0.14em] text-[#7B746C]">{course.name}</p>
            <h1 className="font-display text-[30px] leading-tight text-[#2F352F]">Hole {hole.number} Guide</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl space-y-4 px-4 pt-5">
        <section className="overflow-hidden rounded-[20px] border border-[#D9DDD5] border-l-4 border-l-[#C2A56A] bg-[#F7F3EC] p-5 shadow-[0_5px_16px_rgba(47,53,47,0.05)]">
          {heroImage ? (
            <div className="relative -mx-5 -mt-5 mb-4 h-64 w-[calc(100%+2.5rem)] overflow-hidden border-b border-[#D9DDD5] bg-[#EEF2E9] sm:mx-0 sm:mt-0 sm:mb-5 sm:h-72 sm:w-full sm:rounded-[14px] sm:border">
              <Image
                src={heroImage}
                alt={`${course.name} hole ${hole.number} image`}
                fill
                className="object-contain sm:object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
              />
            </div>
          ) : null}

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-[13px] font-semibold uppercase tracking-wide text-[#2F352F]">
              Par {hole.par}
            </span>
            <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-[13px] font-semibold uppercase tracking-wide text-[#2F352F]">
              {hole.yardage} yds (tips)
            </span>
            <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-[13px] font-semibold uppercase tracking-wide text-[#2F352F]">
              Handicap {hole.handicap}
            </span>
          </div>

          <article className="rounded-2xl border border-[#D9DDD5] border-l-4 border-l-[#C2A56A] bg-[#F7F3EC] p-5">
            <h2 className="font-display text-[22px] font-semibold text-[#2F352F]">What this hole asks</h2>
            <p className="mt-3 text-base leading-[1.6] text-[#4B524B]">{hole.keyFeature}</p>
          </article>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <article className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-4">
              <h3 className="font-display text-[18px] font-semibold text-[#2F352F]">Strategy</h3>
              <p className="mt-2 text-base leading-[1.6] text-[#4B524B]">{hole.strategy}</p>
            </article>

            <article className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-4">
              <h3 className="font-display text-[18px] font-semibold text-[#2F352F]">Danger to avoid</h3>
              <p className="mt-2 text-base leading-[1.6] text-[#4B524B]">
                {dangerIsSparse
                  ? "No specific danger note is available yet. Default to the safer line and favor center-green outcomes."
                  : hole.danger}
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <h2 className="font-display text-[22px] font-semibold text-[#2F352F]">Shot planner</h2>

          <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
            <article className="min-w-[240px] snap-start rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-4 shadow-[0_2px_8px_rgba(47,53,47,0.06)] md:min-w-0">
              <div className="inline-flex items-center gap-1 text-[13px] uppercase tracking-[0.08em] text-[#7B746C]">
                <Flag className="h-3.5 w-3.5 text-[#556B5D]" /> Tee yardages
              </div>
              <p className="mt-2 text-base text-[#4B524B]">Tips: {metricValue(hole.teeYardages.tips)}</p>
              <p className="text-base text-[#4B524B]">Member: {metricValue(hole.teeYardages.member)}</p>
              <p className="text-base text-[#4B524B]">Forward: {metricValue(hole.teeYardages.forward)}</p>
            </article>

            <article className="min-w-[240px] snap-start rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-4 shadow-[0_2px_8px_rgba(47,53,47,0.06)] md:min-w-0">
              <div className="inline-flex items-center gap-1 text-[13px] uppercase tracking-[0.08em] text-[#7B746C]">
                <Wind className="h-3.5 w-3.5 text-[#556B5D]" /> Wind cue
              </div>
              <p className="mt-2 text-base leading-[1.6] text-[#4B524B]">
                {hasMeaningfulText(hole.wind) ? hole.wind : <span className="text-[#7B746C]">No wind cue available.</span>}
              </p>
            </article>

            <article className="min-w-[240px] snap-start rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-4 shadow-[0_2px_8px_rgba(47,53,47,0.06)] md:min-w-0">
              <div className="inline-flex items-center gap-1 text-[13px] uppercase tracking-[0.08em] text-[#7B746C]">
                <Gauge className="h-3.5 w-3.5 text-[#556B5D]" /> Green read
              </div>
              <p className="mt-2 text-base leading-[1.6] text-[#4B524B]">
                {hasMeaningfulText(hole.greenNote) ? hole.greenNote : <span className="text-[#7B746C]">No green read note yet.</span>}
              </p>
            </article>

            <article className="min-w-[240px] snap-start rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-4 shadow-[0_2px_8px_rgba(47,53,47,0.06)] md:min-w-0">
              <div className="inline-flex items-center gap-1 text-[13px] uppercase tracking-[0.08em] text-[#7B746C]">
                <Target className="h-3.5 w-3.5 text-[#556B5D]" /> Smart miss
              </div>
              <p className="mt-2 text-base leading-[1.6] text-[#4B524B]">
                If in doubt, play to the fattest section and keep the next putt uphill.
              </p>
            </article>
          </div>
        </section>

        <section
          id="hole-jump"
          className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]"
        >
          <h2 className="font-display text-[22px] font-semibold text-[#2F352F]">Quick jump</h2>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {course.holes.map((item) => (
              <Link
                key={item.number}
                href={`/course/${course.slug}/hole/${item.number}`}
                className={`flex min-h-10 items-center justify-center rounded-full border px-2 text-sm font-semibold transition ${
                  item.number === hole.number
                    ? "border-[#556B5D] bg-[#556B5D] text-[#F9F5EC]"
                    : "border-[#D9DDD5] bg-[#E8EEE7] text-[#2F352F] hover:bg-[#dce6db]"
                }`}
              >
                {item.number}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#D9DDD5] bg-[rgba(247,243,236,0.95)] p-3 backdrop-blur md:hidden">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-[auto,1fr,auto] items-center gap-2">
          <Link
            href={`/course/${course.slug}/hole/${neighbors.prev}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl border border-[#D9DDD5] bg-[#E8EEE7] px-3 py-2.5 text-sm font-semibold text-[#2F352F]"
          >
            <ArrowLeft className="h-4 w-4" /> Prev
          </Link>

          <Link
            href="#hole-jump"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] px-3 py-2.5 text-sm font-semibold text-[#2F352F]"
          >
            <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-[#556B5D] px-2 text-[13px] font-semibold text-[#F9F5EC]">
              {hole.number}
            </span>
            Quick jump
          </Link>

          <Link
            href={`/course/${course.slug}/hole/${neighbors.next}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl bg-[#556B5D] px-3 py-2.5 text-sm font-semibold text-[#F9F5EC]"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
