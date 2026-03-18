import Link from "next/link";
import { ArrowLeft, Compass, Route } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { getCoursesByRegion, type Region } from "@/lib/courses";

const regionMeta: Record<Region, { title: string; subtitle: string }> = {
  north: {
    title: "North Des Moines",
    subtitle: "Tree-lined routing, strategic bunkering, and classic shot values.",
  },
  south: {
    title: "South Des Moines",
    subtitle: "Championship distance, wind-exposed holes, and pressure finishes.",
  },
};

export function RegionCoursesPage({ region }: { region: Region }) {
  const courses = getCoursesByRegion(region);
  const meta = regionMeta[region];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100/50 dark:from-zinc-950 dark:via-zinc-950 dark:to-emerald-950/30">
      <header className="sticky top-0 z-40 border-b border-emerald-200/80 bg-white/95 backdrop-blur dark:border-emerald-900 dark:bg-zinc-950/95">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white p-2 text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-300"
            aria-label="Back home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
              Region Guide
            </p>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{meta.title}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6">
        <section className="mb-6 rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm dark:border-emerald-900 dark:bg-zinc-900/70">
          <p className="text-sm text-zinc-700 dark:text-zinc-200">{meta.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200">
              <Compass className="h-3.5 w-3.5" /> {courses.length} courses
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Route className="h-3.5 w-3.5" /> 18-hole playbooks
            </span>
          </div>
        </section>

        <section className="grid gap-4">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </section>
      </main>
    </div>
  );
}
