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
      href: northPreview ? `/course/${northPreview.slug}` : "/north",
      title: "North Course",
      descriptor: "Tree-lined strategy with classic Midwest shaping.",
      imageUrl: northPreview?.imageUrl,
      label: "Classic placement golf",
    },
    {
      key: "south",
      href: southPreview ? `/course/${southPreview.slug}` : "/south",
      title: "South Course",
      descriptor: "A bolder routing with exposure to wind and longer asks.",
      imageUrl: southPreview?.imageUrl,
      label: "Wind-forward decisions",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:pt-10">
        <section className="rounded-[24px] border border-[#D9DDD5] bg-[#F7F3EC] px-5 py-6 shadow-[0_8px_26px_rgba(47,53,47,0.06)] sm:px-8 sm:py-9">
          <div className="inline-flex items-center gap-1 rounded-full border border-[#D9DDD5] bg-[#FBF8F2] px-3 py-1 text-[13px] font-semibold text-[#556B5D]">
            <Flag className="h-3.5 w-3.5" /> Cassie Club Guide
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-[30px] font-semibold leading-[1.2] text-[#2F352F] sm:text-[34px]">
            Editorial course intelligence for sharper rounds at DMGCC.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-[1.6] text-[#4B524B]">
            Pick North or South and jump straight into the full playbook. Every hole is organized
            around the decision that matters most: where to start it, what to avoid, and the miss
            that still leaves you scoring.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center rounded-full border border-[#D9DDD5] bg-[#FBF8F2] px-3.5 py-1.5 text-[13px] font-medium text-[#2F352F]">
              {courses.length} DMGCC courses
            </span>
            <span className="inline-flex items-center rounded-full border border-[#D9DDD5] bg-[#FBF8F2] px-3.5 py-1.5 text-[13px] font-medium text-[#2F352F]">
              {courses.length * 18} hole briefs
            </span>
            <span className="inline-flex items-center rounded-full border border-[#D9DDD5] bg-[#FBF8F2] px-3.5 py-1.5 text-[13px] font-medium text-[#2F352F]">
              Mobile-first UI
            </span>
          </div>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2">
          {regionCards.map((region) => (
            <Link
              key={region.key}
              href={region.href}
              className="group overflow-hidden rounded-[22px] border border-[#D9DDD5] bg-[#F7F3EC] shadow-[0_8px_26px_rgba(47,53,47,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(47,53,47,0.09)]"
            >
              {region.imageUrl ? (
                <div className="relative h-52 w-full overflow-hidden sm:h-60">
                  <Image
                    src={region.imageUrl}
                    alt={`${region.title} hero image`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[rgba(247,243,236,0.94)] px-3 py-1 text-[13px] font-semibold text-[#556B5D] shadow-sm backdrop-blur">
                    {region.label}
                  </span>
                </div>
              ) : (
                <div className="h-52 w-full bg-gradient-to-br from-[#DDE5DA] to-[#EFF3EC] sm:h-60" />
              )}

              <div className="p-5 sm:p-6">
                <h2 className="font-display text-[22px] font-semibold text-[#2F352F]">{region.title}</h2>
                <p className="mt-2 text-base leading-[1.6] text-[#4B524B]">{region.descriptor}</p>
                <span className="mt-5 inline-flex items-center gap-1 rounded-2xl bg-[#556B5D] px-4 py-2.5 text-sm font-semibold text-[#FBF8F2] transition-all group-hover:gap-2">
                  Explore Course <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-7 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EEE7] px-3 py-1.5 text-[13px] font-medium text-[#2F352F]">
            <Sparkles className="h-3.5 w-3.5 text-[#556B5D]" /> Local playing notes
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EEE7] px-3 py-1.5 text-[13px] font-medium text-[#2F352F]">
            <Wind className="h-3.5 w-3.5 text-[#556B5D]" /> Wind and carry cues
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EEE7] px-3 py-1.5 text-[13px] font-medium text-[#2F352F]">
            <Flag className="h-3.5 w-3.5 text-[#556B5D]" /> Fast hole jump
          </span>
        </section>
      </main>
    </div>
  );
}
