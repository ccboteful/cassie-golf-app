import Link from "next/link";
import { ArrowRight, Compass, Flag, Mountain, Timer } from "lucide-react";
import type { Course } from "@/lib/courses";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/course/${course.slug}`}
      className="group rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-emerald-900 dark:bg-emerald-950/30"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            {course.city}
          </p>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{course.name}</h3>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
          {course.walking}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-900/30">
        <div>
          <p className="text-[11px] uppercase text-zinc-500 dark:text-zinc-300">Par</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{course.par}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-zinc-500 dark:text-zinc-300">Rate</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{course.rating}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-zinc-500 dark:text-zinc-300">Slope</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{course.slope}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-zinc-500 dark:text-zinc-300">Yards</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{(course.yardage / 1000).toFixed(1)}k</p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">{course.summary}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center gap-1.5">
          <Flag className="h-3.5 w-3.5 text-emerald-600" />
          <span>{course.holes.length} holes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-emerald-600" />
          <span>{course.designer}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mountain className="h-3.5 w-3.5 text-emerald-600" />
          <span>Built {course.yearBuilt}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5 text-emerald-600" />
          <span>{course.paceTarget}</span>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-all group-hover:gap-2 dark:text-emerald-300">
        Open course guide <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
