import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Flag, Gauge, Target, Wind } from "lucide-react";
import { courses, getCourseBySlug, getHole, getHoleNeighbors } from "@/lib/courses";

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.holes.map((hole) => ({
      slug: course.slug,
      number: String(hole.number),
    }))
  );
}

export default async function HolePage({
  params,
}: {
  params: Promise<{ slug: string; number: string }>;
}) {
  const { slug, number } = await params;
  const holeNumber = Number(number);

  const course = getCourseBySlug(slug);
  if (!course || Number.isNaN(holeNumber)) notFound();

  const hole = getHole(course, holeNumber);
  if (!hole) notFound();

  const neighbors = getHoleNeighbors(hole.number, course.holes.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100/50 pb-28 dark:from-zinc-950 dark:via-zinc-950 dark:to-emerald-950/40">
      <header className="sticky top-0 z-40 border-b border-emerald-200/80 bg-white/95 backdrop-blur dark:border-emerald-900 dark:bg-zinc-950/95">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href={`/course/${course.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white p-2 text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300">{course.name}</p>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Hole {hole.number} Guide</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 pt-5">
        <section className="rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-zinc-900/75">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200">
              Par {hole.par}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
              {hole.yardage} yds (tips)
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
              Handicap {hole.handicap}
            </span>
          </div>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">What this hole asks</h2>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{hole.keyFeature}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <article className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/30">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Strategy</h3>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{hole.strategy}</p>
            </article>
            <article className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Danger to avoid</h3>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{hole.danger}</p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-zinc-900/75">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Shot planner</h2>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60">
              <div className="inline-flex items-center gap-1 text-xs uppercase text-zinc-500 dark:text-zinc-300">
                <Flag className="h-3.5 w-3.5 text-emerald-600" /> Tee yardages
              </div>
              <p className="mt-1 text-zinc-700 dark:text-zinc-200">Tips: {hole.teeYardages.tips}</p>
              <p className="text-zinc-700 dark:text-zinc-200">Member: {hole.teeYardages.member}</p>
              <p className="text-zinc-700 dark:text-zinc-200">Forward: {hole.teeYardages.forward}</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60">
              <div className="inline-flex items-center gap-1 text-xs uppercase text-zinc-500 dark:text-zinc-300">
                <Wind className="h-3.5 w-3.5 text-emerald-600" /> Wind cue
              </div>
              <p className="mt-1 text-zinc-700 dark:text-zinc-200">{hole.wind}</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60">
              <div className="inline-flex items-center gap-1 text-xs uppercase text-zinc-500 dark:text-zinc-300">
                <Gauge className="h-3.5 w-3.5 text-emerald-600" /> Green read
              </div>
              <p className="mt-1 text-zinc-700 dark:text-zinc-200">{hole.greenNote}</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50 p-3 text-sm text-zinc-700 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-zinc-200">
            <span className="inline-flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100">
              <Target className="h-4 w-4 text-emerald-600" /> Smart miss
            </span>
            <p className="mt-1">If in doubt, play to the fattest section and keep the next putt uphill.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-zinc-900/75">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Quick jump</h2>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {course.holes.map((item) => (
              <Link
                key={item.number}
                href={`/course/${course.slug}/hole/${item.number}`}
                className={`rounded-lg border p-2 text-center text-sm font-semibold transition ${
                  item.number === hole.number
                    ? "border-emerald-500 bg-emerald-600 text-white"
                    : "border-emerald-200 bg-emerald-50 text-zinc-800 hover:border-emerald-400 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-zinc-100"
                }`}
              >
                {item.number}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-200/80 bg-white/95 p-3 backdrop-blur dark:border-emerald-900 dark:bg-zinc-950/95">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-2">
          <Link
            href={`/course/${course.slug}/hole/${neighbors.prev}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
          >
            <ArrowLeft className="h-4 w-4" /> Hole {neighbors.prev}
          </Link>
          <Link
            href={`/course/${course.slug}/hole/${neighbors.next}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Hole {neighbors.next} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
