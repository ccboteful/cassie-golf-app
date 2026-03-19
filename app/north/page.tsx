import { redirect } from "next/navigation";
import { getCoursesByRegion } from "@/lib/courses";

export default async function NorthPage() {
  const [course] = await getCoursesByRegion("north");

  if (course) {
    redirect(`/course/${course.slug}`);
  }

  redirect("/");
}
