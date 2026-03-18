import Link from "next/link";
import { ArrowRight, Flag, MapPinned, Sparkles, Wind } from "lucide-react";
import { getAllCourses } from "@/lib/courses";

const regionCards = [
  {
    key: "north",
    href: "/north",
    title: "North Des Moines",
    subtitle: "Classic lines, tree corridors, precision approaches",
    tone: "from-emerald-500 to-lime-500",
  },
  {
    key: "south",
    href: "/south",
    title: "South Des Moines",
    subtitle: "Big carries, exposed wind, championship finishes",
    tone: "from-teal-500 to-emerald-600",
  },
] as const;

export default async function HomePage() {
  const courses = await getAllCourses();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100/50 dark:from-zinc-950 dark:via-zinc-950 dark:to-emerald-950/40">
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8">
        <section className="rounded-3xl border border-emerald-200/80 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-zinc-900/80">
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
            <Flag className="h-3.5 w-3.5" /> Cassie Golf Guide
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight text-zinc-900 dark:text-zinc-100">
            Course + hole strategy for Des Moines rounds.
          </h1>
          <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
            Pick your region, open a course, then drill into every hole with wind reads, danger notes,
            and local strategy that actually helps you score.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-zinc-700 dark:bg-emerald-900/30 dark:text-zinc-200">
              <span className="font-semibold">{courses.length}</span> sample courses
            </div>
            <div className="rounded-xl bg-emerald-50 p-2 text-zinc-700 dark:bg-emerald-900/30 dark:text-zinc-200">
              <span className="font-semibold">{courses.length * 18}</span> hole briefs
            </div>
            <div className="rounded-xl bg-emerald-50 p-2 text-zinc-700 dark:bg-emerald-900/30 dark:text-zinc-200 col-span-2 sm:col-span-1">
              Mobile-first UI
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {regionCards.map((region) => (
            <Link
              key={region.key}
              href={region.href}
              className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-emerald-900 dark:bg-zinc-900"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${region.tone}`} />
              <div className="relative">
                <MapPinned className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
                <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">{region.title}</h2>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{region.subtitle}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-all group-hover:gap-2 dark:text-emerald-300">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200/80 bg-white p-4 dark:border-emerald-900 dark:bg-zinc-900/70">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">Deeper course detail</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Practice setup, pace targets, and local notes per course.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200/80 bg-white p-4 dark:border-emerald-900 dark:bg-zinc-900/70">
            <Wind className="h-5 w-5 text-emerald-600" />
            <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">Hole-by-hole reads</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Wind, carry danger, and green notes from tee to approach.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200/80 bg-white p-4 dark:border-emerald-900 dark:bg-zinc-900/70">
            <Flag className="h-5 w-5 text-emerald-600" />
            <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">Round-ready UX</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Large tap targets, sticky nav, and quick hole jumps on mobile.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
