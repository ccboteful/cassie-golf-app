import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flag, Sparkles, Wind } from "lucide-react";
import { getAllCourses } from "@/lib/courses";
import GolfWeather from "@/components/GolfWeather";

export default async function HomePage() {
  const courses = await getAllCourses();

  const northPreview = courses.find((course) => course.region === "north");
  const southPreview = courses.find((course) => course.region === "south");
  const heroImage = northPreview?.imageUrl ?? southPreview?.imageUrl;

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
        <section className="relative overflow-hidden rounded-[26px] border border-[#D6DACE] bg-[#F3EFE7] px-5 py-7 shadow-[0_12px_28px_rgba(20,28,38,0.11)] sm:px-9 sm:py-10">
          {heroImage ? (
            <>
              <Image
                src={heroImage}
                alt="DMGCC hero"
                fill
                className="object-cover opacity-[0.22]"
                sizes="(max-width: 1024px) 100vw, 960px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(28,42,30,0.60)] via-[rgba(28,42,30,0.40)] to-[rgba(243,239,231,0.58)]" />
            </>
          ) : null}

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 rounded-full border border-[#C8A24A] bg-[#F0E4BE] px-3 py-1 text-[13px] font-semibold text-[#7A6020] backdrop-blur">
              <Flag className="h-3.5 w-3.5" /> Cassie Club Guide
            </div>

            <h1 className="mt-5 max-w-3xl font-display text-[38px] font-bold leading-[1.14] text-[#FBF8F2] sm:text-[48px]">
              Editorial course intelligence for sharper rounds at DMGCC.
            </h1>

            <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-[#F1EEE7] sm:text-[17px]">
              Pick North or South and jump straight into the full playbook. Every hole is organized
              around the decision that matters most: where to start it, what to avoid, and the miss
              that still leaves you scoring.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center rounded-full border border-[#D6DACE] bg-[rgba(251,248,242,0.92)] px-3.5 py-1.5 text-[13px] font-medium text-[#2A302A]">
                {courses.length} DMGCC courses
              </span>
              <span className="inline-flex items-center rounded-full border border-[#D6DACE] bg-[rgba(251,248,242,0.92)] px-3.5 py-1.5 text-[13px] font-medium text-[#2A302A]">
                {courses.length * 18} hole briefs
              </span>
              <a
                href="https://www.canva.com/design/DAG6803RGuY/dNDEOaeaRv6ShbXqqAOeUg/view?utm_content=DAG6803RGuY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha3cdb7851f"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-[#D6DACE] bg-[rgba(251,248,242,0.92)] px-3.5 py-1.5 text-[13px] font-medium text-[#2A302A] transition hover:-translate-y-0.5 hover:bg-white"
              >
                2026 Ladies Golf Handbook
              </a>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-5 sm:grid-cols-2">
          {regionCards.map((region) => (
            <Link
              key={region.key}
              href={region.href}
              className="group overflow-hidden rounded-[24px] border border-[#D4D9CF] bg-[#F7F3EC] shadow-[0_12px_28px_rgba(20,28,38,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(20,28,38,0.15)]"
            >
              {region.imageUrl ? (
                <div className="relative h-60 w-full overflow-hidden sm:h-64">
                  <Image
                    src={region.imageUrl}
                    alt={`${region.title} hero image`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,42,30,0.72)] via-[rgba(28,42,30,0.3)] to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-[#C8A24A] bg-[#F0E4BE] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7A6020] shadow-sm backdrop-blur">
                    {region.label}
                  </span>
                </div>
              ) : (
                <div className="h-60 w-full bg-gradient-to-br from-[#DDE5DA] to-[#EFF3EC] sm:h-64" />
              )}

              <div className="p-6 sm:p-7">
                <h2 className="font-display text-[28px] font-bold text-[#2A302A]">{region.title}</h2>
                <p className="mt-2 text-[16px] leading-[1.7] text-[#52514A]">{region.descriptor}</p>
                <span className="mt-6 inline-flex items-center gap-1 rounded-2xl border border-[#2C3A2E] bg-[#2C3A2E] px-4 py-2.5 text-sm font-semibold text-[#FDFAF4] transition-all group-hover:gap-2 group-hover:bg-[#3D5449]">
                  Explore Course <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-7 rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-5 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <h2 className="font-display text-[24px] font-semibold text-[#2A302A]">What is stroke index?</h2>
          <p className="mt-2 text-base leading-[1.7] text-[#52514A]">
            Stroke Index ranks hole difficulty within a course: <span className="font-semibold">1 is hardest</span>,
            <span className="font-semibold"> 18 is easiest</span>. Men&rsquo;s, Ladies&rsquo;, and Scoring Tee indexes can differ.
          </p>
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

        <GolfWeather />
      </main>
    </div>
  );
}
