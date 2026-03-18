import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flag, Sparkles, Wind } from "lucide-react";
import { getAllCourses } from "@/lib/courses";

export default async function HomePage() {
  const courses = await getAllCourses();

  const northPreview = courses.find((course) => course.region === "north");
  const southPreview = courses.find((course) => course.region === "south");

  const regionCards = [
    {
      key: "north",
      href: "/north",
      title: "North Course",
      descriptor: "Tree-lined strategy with classic Midwest shaping.",
      imageUrl: northPreview?.imageUrl,
    },
    {
      key: "south",
      href: "/south",
      title: "South Course",
      descriptor: "A bolder routing with exposure to wind and longer asks.",
      imageUrl: southPreview?.imageUrl,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8">
        <section className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-5 shadow-[0_6px_20px_rgba(47,53,47,0.06)] sm:p-8">
          <div className="inline-flex items-center gap-1 rounded-full border border-[#D9DDD5] bg-[#FBF8F2] px-3 py-1 text-xs font-semibold text-[#556B5D]">
            <Flag className="h-3.5 w-3.5" /> Cassie Club Guide
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-[#2F352F] sm:text-4xl">
            Course and hole strategy for better rounds at DMGCC.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4B524B] sm:text-base">
            Pick a course, jump into any hole, and get practical local guidance on wind, misses,
            and scoring decisions—organized for fast use during a round.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-[#D9DDD5] bg-[#FBF8F2] px-3 py-1 text-xs font-medium text-[#2F352F]">
              {courses.length} DMGCC courses
            </span>
            <span className="inline-flex items-center rounded-full border border-[#D9DDD5] bg-[#FBF8F2] px-3 py-1 text-xs font-medium text-[#2F352F]">
              {courses.length * 18} hole briefs
            </span>
            <span className="inline-flex items-center rounded-full border border-[#D9DDD5] bg-[#FBF8F2] px-3 py-1 text-xs font-medium text-[#2F352F]">
              Mobile-first design
            </span>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {regionCards.map((region) => (
            <Link
              key={region.key}
              href={region.href}
              className="group overflow-hidden rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] shadow-[0_6px_20px_rgba(47,53,47,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(47,53,47,0.08)]"
            >
              {region.imageUrl ? (
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={region.imageUrl}
                    alt={`${region.title} hero image`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="h-44 w-full bg-gradient-to-br from-[#DDE5DA] to-[#EFF3EC]" />
              )}

              <div className="p-5">
                <h2 className="font-display text-2xl font-semibold text-[#2F352F]">{region.title}</h2>
                <p className="mt-1 text-sm text-[#4B524B]">{region.descriptor}</p>
                <span className="mt-4 inline-flex items-center gap-1 rounded-2xl bg-[#556B5D] px-4 py-2 text-sm font-semibold text-[#F9F5EC] transition-all group-hover:gap-2">
                  Explore Course <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-7 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EEE7] px-3 py-1.5 text-xs font-medium text-[#2F352F]">
            <Sparkles className="h-3.5 w-3.5 text-[#556B5D]" /> Local playing notes
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EEE7] px-3 py-1.5 text-xs font-medium text-[#2F352F]">
            <Wind className="h-3.5 w-3.5 text-[#556B5D]" /> Wind and carry cues
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EEE7] px-3 py-1.5 text-xs font-medium text-[#2F352F]">
            <Flag className="h-3.5 w-3.5 text-[#556B5D]" /> Fast hole jump
          </span>
        </section>
      </main>
    </div>
  );
}
