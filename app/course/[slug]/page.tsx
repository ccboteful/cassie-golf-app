import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CircleGauge,
  Clock3,
  Flag,
  Route,
  Trees,
  Trophy,
  Waves,
} from "lucide-react";
import { getAllCourses, getCourseBySlug } from "@/lib/courses";

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

const metricValue = (value: number) => (value > 0 ? value : "TBD");

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100/50 pb-24 dark:from-zinc-950 dark:via-zinc-950 dark:to-emerald-950/40">
      <header className="sticky top-0 z-40 border-b border-emerald-200/80 bg-white/95 backdrop-blur dark:border-emerald-900 dark:bg-zinc-950/95">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href={`/${course.region}`}
            className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white p-2 text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-300"
            aria-label="Back to region"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300">{course.city}</p>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{course.name}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 pt-5">
        {course.imageUrl ? (
          <section className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-sm dark:border-emerald-900 dark:bg-zinc-900/75">
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={course.imageUrl}
                alt={`${course.name} overview image`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-zinc-900/75">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{course.summary}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-xl bg-emerald-50 p-2 dark:bg-emerald-900/30">
              <div className="text-[11px] uppercase text-zinc-500 dark:text-zinc-300">Par</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">{course.par}</div>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2 dark:bg-emerald-900/30">
              <div className="text-[11px] uppercase text-zinc-500 dark:text-zinc-300">Rating / slope</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">{metricValue(course.rating)} / {metricValue(course.slope)}</div>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2 dark:bg-emerald-900/30">
              <div className="text-[11px] uppercase text-zinc-500 dark:text-zinc-300">Tips yardage</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">{course.yardage}</div>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2 dark:bg-emerald-900/30">
              <div className="text-[11px] uppercase text-zinc-500 dark:text-zinc-300">Built</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">{course.yearBuilt}</div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300 sm:grid-cols-2">
            <p className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60"><Route className="mt-0.5 h-4 w-4 text-emerald-600" />{course.signaturePlan}</p>
            <p className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60"><Trophy className="mt-0.5 h-4 w-4 text-emerald-600" />{course.practice}</p>
            <p className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60"><Clock3 className="mt-0.5 h-4 w-4 text-emerald-600" />Pace target: {course.paceTarget}</p>
            <p className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60"><Trees className="mt-0.5 h-4 w-4 text-emerald-600" />Walking profile: {course.walking}</p>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-200/80 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-900/30">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Local notes</h2>
            <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              {course.localTips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-zinc-900/75">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Hole-by-hole playbook</h2>
            <Link
              href={`/course/${course.slug}/hole/1`}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Start on 1 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {course.holes.map((hole) => (
              <Link
                key={hole.number}
                href={`/course/${course.slug}/hole/${hole.number}`}
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-left transition hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50"
              >
                <div className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-300">Hole</div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{hole.number}</div>
                <div className="mt-1 text-xs text-zinc-700 dark:text-zinc-200">Par {hole.par}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">Hdcp {hole.handicap}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-zinc-900/75">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Address</h2>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{course.address}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-300">
            <span className="inline-flex items-center gap-1"><CircleGauge className="h-3.5 w-3.5 text-emerald-600" /> Designer: {course.designer}</span>
            <span className="inline-flex items-center gap-1"><Waves className="h-3.5 w-3.5 text-emerald-600" /> Region: {course.region}</span>
            <span className="inline-flex items-center gap-1"><Flag className="h-3.5 w-3.5 text-emerald-600" /> {course.holes.length} holes</span>
          </div>
        </section>
      </main>
    </div>
  );
}
