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

  return (
    <div className="min-h-screen bg-[#FBF8F2] pb-28">
      <header className="sticky top-0 z-40 border-b border-[#D9DDD5] bg-[#FBF8F2]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href={`/course/${course.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-[#D9DDD5] bg-[#F7F3EC] p-2 text-[#556B5D] transition hover:bg-[#EEE8DD]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#556B5D]">{course.name}</p>
            <h1 className="font-display text-xl font-semibold text-[#2F352F]">Hole {hole.number} Guide</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl space-y-4 px-4 pt-5">
        {hole.imageUrl ? (
          <section className="overflow-hidden rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
            <div className="relative h-[58vh] min-h-[320px] w-full bg-[#EFF3EC] sm:h-72">
              <Image
                src={hole.imageUrl}
                alt={`${course.name} hole ${hole.number} image`}
                fill
                className="object-contain sm:object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
              />
            </div>
          </section>
        ) : null}

        <section className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-xs font-semibold text-[#2F352F]">Par {hole.par}</span>
            <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-xs font-semibold text-[#2F352F]">{hole.yardage} yds (tips)</span>
            <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-xs font-semibold text-[#2F352F]">Handicap {hole.handicap}</span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-[#2F352F]">What this hole asks</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#4B524B]">{hole.keyFeature}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <article className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <h3 className="text-sm font-semibold text-[#2F352F]">Strategy</h3>
              <p className="mt-1 text-sm text-[#4B524B]">{hole.strategy}</p>
            </article>
            <article className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <h3 className="text-sm font-semibold text-[#2F352F]">Danger to avoid</h3>
              <p className="mt-1 text-sm text-[#4B524B]">{hole.danger}</p>
            </article>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <h2 className="text-base font-semibold text-[#2F352F]">Shot planner</h2>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <div className="inline-flex items-center gap-1 text-xs uppercase text-[#7B746C]">
                <Flag className="h-3.5 w-3.5 text-[#556B5D]" /> Tee yardages
              </div>
              <p className="mt-1 text-[#4B524B]">Tips: {metricValue(hole.teeYardages.tips)}</p>
              <p className="text-[#4B524B]">Member: {metricValue(hole.teeYardages.member)}</p>
              <p className="text-[#4B524B]">Forward: {metricValue(hole.teeYardages.forward)}</p>
            </div>
            <div className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <div className="inline-flex items-center gap-1 text-xs uppercase text-[#7B746C]">
                <Wind className="h-3.5 w-3.5 text-[#556B5D]" /> Wind cue
              </div>
              <p className="mt-1 text-[#4B524B]">{hole.wind}</p>
            </div>
            <div className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <div className="inline-flex items-center gap-1 text-xs uppercase text-[#7B746C]">
                <Gauge className="h-3.5 w-3.5 text-[#556B5D]" /> Green read
              </div>
              <p className="mt-1 text-[#4B524B]">{hole.greenNote}</p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3 text-sm text-[#4B524B]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#2F352F]">
              <Target className="h-4 w-4 text-[#556B5D]" /> Smart miss
            </span>
            <p className="mt-1">If in doubt, play to the fattest section and keep the next putt uphill.</p>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <h2 className="text-base font-semibold text-[#2F352F]">Quick jump</h2>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {course.holes.map((item) => (
              <Link
                key={item.number}
                href={`/course/${course.slug}/hole/${item.number}`}
                className={`flex min-h-10 items-center justify-center rounded-full px-2 text-sm font-semibold transition ${
                  item.number === hole.number
                    ? "bg-[#556B5D] text-[#F9F5EC]"
                    : "bg-[#E8EEE7] text-[#2F352F] hover:bg-[#dce6db]"
                }`}
              >
                {item.number}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#D9DDD5] bg-[#FBF8F2]/95 p-3 backdrop-blur">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-2">
          <Link
            href={`/course/${course.slug}/hole/${neighbors.prev}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl border border-[#D9DDD5] bg-[#E8EEE7] px-4 py-3 text-sm font-semibold text-[#2F352F]"
          >
            <ArrowLeft className="h-4 w-4" /> Hole {neighbors.prev}
          </Link>
          <Link
            href={`/course/${course.slug}/hole/${neighbors.next}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl bg-[#556B5D] px-4 py-3 text-sm font-semibold text-[#F9F5EC]"
          >
            Hole {neighbors.next} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
