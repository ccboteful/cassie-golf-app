import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/lib/courses";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-[#D9DDD5] bg-[#F7F3EC] shadow-[0_6px_20px_rgba(47,53,47,0.05)]">
      {course.imageUrl ? (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={course.imageUrl}
            alt={`${course.name} overview image`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      ) : null}

      <div className="p-5">
        <h3 className="font-display text-2xl font-semibold text-[#2F352F]">{course.name}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-[#4B524B]">{course.summary}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-xs font-medium text-[#2F352F]">Private</span>
          <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-xs font-medium text-[#2F352F]">{course.designer}</span>
          <span className="rounded-full bg-[#E8EEE7] px-3 py-1 text-xs font-medium text-[#2F352F]">
            {course.holes.length} holes
          </span>
        </div>

        <Link
          href={`/course/${course.slug}`}
          className="mt-4 inline-flex items-center gap-1 rounded-2xl bg-[#556B5D] px-4 py-2 text-sm font-semibold text-[#F9F5EC] transition-all hover:gap-2"
        >
          Explore Course <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
