import { redirect } from "next/navigation";
import { getCoursesByRegion } from "@/lib/courses";

export default async function SouthPage() {
  const [course] = await getCoursesByRegion("south");

  if (course) {
    redirect(`/course/${course.slug}`);
  }

  redirect("/");
}
