import Link from "next/link";
import { ArrowLeft, Compass, Route } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { getCoursesByRegion, type Region } from "@/lib/courses";

const regionMeta: Record<Region, { title: string; subtitle: string }> = {
  north: {
    title: "Des Moines GCC — North Course",
    subtitle: "Official public hole descriptions and yardages from DMGCC.",
  },
  south: {
    title: "Des Moines GCC — South Course",
    subtitle: "Official public hole descriptions and yardages from DMGCC.",
  },
};

export async function RegionCoursesPage({ region }: { region: Region }) {
  const courses = await getCoursesByRegion(region);
  const meta = regionMeta[region];

  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      <header className="sticky top-0 z-40 border-b border-[#D9DDD5] bg-[#FBF8F2]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-[#D9DDD5] bg-[#F7F3EC] p-2 text-[#556B5D] transition hover:bg-[#EEE8DD]"
            aria-label="Back home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#556B5D]">Region Guide</p>
            <h1 className="font-display text-xl font-semibold text-[#2F352F]">{meta.title}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-6">
        <section className="mb-6 rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <p className="text-sm text-[#4B524B]">{meta.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EEE7] px-3 py-1 font-medium text-[#2F352F]">
              <Compass className="h-3.5 w-3.5 text-[#556B5D]" /> {courses.length} courses
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EEE7] px-3 py-1 font-medium text-[#2F352F]">
              <Route className="h-3.5 w-3.5 text-[#556B5D]" /> 18-hole playbooks
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
