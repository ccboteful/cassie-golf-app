import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CircleGauge, Clock3, Flag, Route, Trees, Trophy, Waves } from "lucide-react";
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
    <div className="min-h-screen bg-[#FBF8F2] pb-24">
      <header className="sticky top-0 z-40 border-b border-[#D9DDD5] bg-[#FBF8F2]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href={`/${course.region}`}
            className="inline-flex items-center justify-center rounded-xl border border-[#D9DDD5] bg-[#F7F3EC] p-2 text-[#556B5D] transition hover:bg-[#EEE8DD]"
            aria-label="Back to region"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#556B5D]">{course.city}</p>
            <h1 className="font-display text-xl font-semibold text-[#2F352F]">{course.name}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl space-y-4 px-4 pt-5">
        {course.imageUrl ? (
          <section className="overflow-hidden rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
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

        <section className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <p className="text-sm leading-relaxed text-[#4B524B]">{course.summary}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <div className="text-[11px] uppercase tracking-wide text-[#7B746C]">Par</div>
              <div className="text-base font-semibold text-[#2F352F]">{course.par}</div>
            </div>
            <div className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <div className="text-[11px] uppercase tracking-wide text-[#7B746C]">Tips yardage</div>
              <div className="text-base font-semibold text-[#2F352F]">{course.yardage}</div>
            </div>
            <div className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <div className="text-[11px] uppercase tracking-wide text-[#7B746C]">Designer</div>
              <div className="text-base font-semibold text-[#2F352F]">{course.designer}</div>
            </div>
            <div className="rounded-2xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <div className="text-[11px] uppercase tracking-wide text-[#7B746C]">Rating / slope</div>
              <div className="text-base font-semibold text-[#2F352F]">
                {metricValue(course.rating)} / {metricValue(course.slope)}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-[#4B524B] sm:grid-cols-2">
            <p className="flex items-start gap-2 rounded-xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <Route className="mt-0.5 h-4 w-4 text-[#556B5D]" />
              {course.signaturePlan}
            </p>
            <p className="flex items-start gap-2 rounded-xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <Trophy className="mt-0.5 h-4 w-4 text-[#556B5D]" />
              {course.practice}
            </p>
            <p className="flex items-start gap-2 rounded-xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-[#556B5D]" />
              Pace target: {course.paceTarget}
            </p>
            <p className="flex items-start gap-2 rounded-xl border border-[#D9DDD5] bg-[#FBF8F2] p-3">
              <Trees className="mt-0.5 h-4 w-4 text-[#556B5D]" />
              Walking profile: {course.walking}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-[#D9DDD5] border-l-4 border-l-[#C2A56A] bg-[#FBF8F2] p-4">
            <h2 className="text-base font-semibold text-[#556B5D]">Local notes</h2>
            <ul className="mt-2 space-y-2 text-sm leading-7 text-[#4B524B]">
              {course.localTips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-[11px] h-1.5 w-1.5 rounded-full bg-[#C2A56A]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold text-[#2F352F]">Hole-by-hole playbook</h2>
            <Link
              href={`/course/${course.slug}/hole/1`}
              className="inline-flex items-center gap-1 rounded-2xl bg-[#556B5D] px-4 py-2 text-sm font-semibold text-[#F9F5EC] hover:opacity-95"
            >
              Start on 1 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {course.holes.map((hole) => (
              <Link
                key={hole.number}
                href={`/course/${course.slug}/hole/${hole.number}`}
                className="flex min-h-10 items-center justify-center rounded-full bg-[#E8EEE7] px-3 text-sm font-semibold text-[#2F352F] transition hover:bg-[#dce6db]"
              >
                Hole {hole.number}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] p-4 shadow-[0_4px_14px_rgba(47,53,47,0.05)]">
          <h2 className="text-base font-semibold text-[#2F352F]">Address</h2>
          <p className="mt-1 text-sm text-[#4B524B]">{course.address}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#4B524B]">
            <span className="inline-flex items-center gap-1">
              <CircleGauge className="h-3.5 w-3.5 text-[#556B5D]" /> Designer: {course.designer}
            </span>
            <span className="inline-flex items-center gap-1">
              <Waves className="h-3.5 w-3.5 text-[#556B5D]" /> Region: {course.region}
            </span>
            <span className="inline-flex items-center gap-1">
              <Flag className="h-3.5 w-3.5 text-[#556B5D]" /> {course.holes.length} holes
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
