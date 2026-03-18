export type Region = "north" | "south";

import { isSanityConfigured, sanityClient, urlForImage } from "@/lib/sanity";
import dmgccLocalCourses from "@/lib/data/dmgcc-local.json";

export type Hole = {
  number: number;
  par: number;
  yardage: number;
  handicap: number;
  wind: string;
  keyFeature: string;
  danger: string;
  greenNote: string;
  strategy: string;
  teeYardages: {
    tips: number;
    member: number;
    forward: number;
  };
  imageUrl?: string | null;
  mapImageUrl?: string | null;
};

export type Course = {
  slug: string;
  name: string;
  region: Region;
  city: string;
  address: string;
  par: number;
  rating: number;
  slope: number;
  yardage: number;
  designer: string;
  yearBuilt: number;
  practice: string;
  paceTarget: string;
  walking: "easy" | "moderate" | "challenging";
  summary: string;
  signaturePlan: string;
  localTips: string[];
  holes: Hole[];
  imageUrl?: string | null;
  mapImageUrl?: string | null;
};

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function withBasePath(url?: string | null): string | null {
  if (!url) return null;
  if (/^(https?:)?\/\//.test(url)) return url;
  if (!PUBLIC_BASE_PATH) return url;
  if (url.startsWith(`${PUBLIC_BASE_PATH}/`)) return url;

  return url.startsWith("/") ? `${PUBLIC_BASE_PATH}${url}` : `${PUBLIC_BASE_PATH}/${url}`;
}

export const courses: Course[] = (dmgccLocalCourses as Course[]).map((course) => ({
  ...course,
  imageUrl: withBasePath(course.imageUrl),
  mapImageUrl: withBasePath(course.mapImageUrl),
  holes: course.holes.map((hole) => ({
    ...hole,
    imageUrl: withBasePath(hole.imageUrl),
    mapImageUrl: withBasePath(hole.mapImageUrl),
  })),
}));

const cmsCourseQuery = `*[_type == "course"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  city,
  address,
  par,
  rating,
  slope,
  yardage,
  designer,
  yearBuilt,
  practice,
  paceTarget,
  walking,
  summary,
  signaturePlan,
  localTips,
  image,
  mapImage,
  "regionSlug": select(
    defined(region->slug.current) => region->slug.current,
    defined(region) => region,
    "north"
  ),
  "holes": coalesce(holes, holesArray)[] {
    number,
    par,
    yardage,
    handicap,
    wind,
    keyFeature,
    danger,
    greenNote,
    strategy,
    teeYardages,
    image,
    mapImage
  }
}`;

type SanityHole = {
  number?: number;
  par?: number;
  yardage?: number;
  handicap?: number;
  wind?: string;
  keyFeature?: string;
  danger?: string;
  greenNote?: string;
  strategy?: string;
  teeYardages?: { tips?: number; member?: number; forward?: number };
  image?: unknown;
  mapImage?: unknown;
};

type SanityCourse = {
  name?: string;
  slug?: string;
  regionSlug?: string;
  city?: string;
  address?: string;
  par?: number;
  rating?: number;
  slope?: number;
  yardage?: number;
  designer?: string;
  yearBuilt?: number;
  practice?: string;
  paceTarget?: string;
  walking?: "easy" | "moderate" | "challenging";
  summary?: string;
  signaturePlan?: string;
  localTips?: string[];
  image?: unknown;
  mapImage?: unknown;
  holes?: SanityHole[];
};

function normalizeHole(hole: SanityHole, index: number): Hole {
  const number = hole.number ?? index + 1;
  const yardage = hole.yardage ?? 0;

  return {
    number,
    par: hole.par ?? 4,
    yardage,
    handicap: hole.handicap ?? Math.min(number, 18),
    wind: hole.wind ?? "",
    keyFeature: hole.keyFeature ?? "",
    danger: hole.danger ?? "",
    greenNote: hole.greenNote ?? "",
    strategy: hole.strategy ?? "",
    teeYardages: {
      tips: hole.teeYardages?.tips ?? yardage,
      member: hole.teeYardages?.member ?? Math.max(95, yardage - 28),
      forward: hole.teeYardages?.forward ?? Math.max(80, yardage - 63),
    },
    imageUrl: withBasePath(urlForImage(hole.image)),
    mapImageUrl: withBasePath(urlForImage(hole.mapImage)),
  };
}

function normalizeCourse(course: SanityCourse): Course | null {
  if (!course.slug || !course.name) return null;

  const normalizedRegion: Region = course.regionSlug === "south" ? "south" : "north";
  const normalizedHoles = (course.holes ?? [])
    .slice()
    .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
    .map(normalizeHole);

  return {
    slug: course.slug,
    name: course.name,
    region: normalizedRegion,
    city: course.city ?? "",
    address: course.address ?? "",
    par: course.par ?? 72,
    rating: course.rating ?? 0,
    slope: course.slope ?? 0,
    yardage: course.yardage ?? 0,
    designer: course.designer ?? "",
    yearBuilt: course.yearBuilt ?? 0,
    practice: course.practice ?? "",
    paceTarget: course.paceTarget ?? "",
    walking: course.walking ?? "moderate",
    summary: course.summary ?? "",
    signaturePlan: course.signaturePlan ?? "",
    localTips: course.localTips ?? [],
    holes: normalizedHoles,
    imageUrl: withBasePath(urlForImage(course.image)),
    mapImageUrl: withBasePath(urlForImage(course.mapImage)),
  };
}

let cachedCourses: Course[] | null = null;

export async function getAllCourses(): Promise<Course[]> {
  if (cachedCourses) return cachedCourses;

  if (!isSanityConfigured || !sanityClient) {
    cachedCourses = courses;
    return cachedCourses;
  }

  try {
    const cmsData = await sanityClient.fetch<SanityCourse[]>(cmsCourseQuery);
    const normalized = cmsData.map(normalizeCourse).filter((course): course is Course => Boolean(course));

    if (normalized.length > 0) {
      cachedCourses = normalized;
      return cachedCourses;
    }
  } catch (error) {
    console.warn("Failed to fetch Sanity content, falling back to local seed data.", error);
  }

  cachedCourses = courses;
  return cachedCourses;
}

export async function getCoursesByRegion(region: Region): Promise<Course[]> {
  const allCourses = await getAllCourses();
  return allCourses.filter((course) => course.region === region);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const allCourses = await getAllCourses();
  return allCourses.find((course) => course.slug === slug);
}

export function getHole(course: Course, number: number): Hole | undefined {
  return course.holes.find((hole) => hole.number === number);
}

export function getHoleNeighbors(number: number, total = 18) {
  const prev = number <= 1 ? total : number - 1;
  const next = number >= total ? 1 : number + 1;
  return { prev, next };
}
