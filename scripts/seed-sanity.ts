import { createClient } from "@sanity/client";
import { courses } from "../lib/courses";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-18";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID).");
}

if (!token) {
  throw new Error("Missing SANITY_API_TOKEN. Create a token with write access in Sanity Manage.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

const regionDocs = [
  {
    _id: "region-north",
    _type: "region",
    title: "North Des Moines",
    slug: { _type: "slug", current: "north" },
    subtitle: "Tree-lined routing, strategic bunkering, and classic shot values.",
    sortOrder: 1,
  },
  {
    _id: "region-south",
    _type: "region",
    title: "South Des Moines",
    slug: { _type: "slug", current: "south" },
    subtitle: "Championship distance, wind-exposed holes, and pressure finishes.",
    sortOrder: 2,
  },
];

async function seed() {
  console.log(`Seeding ${regionDocs.length} regions...`);
  for (const doc of regionDocs) {
    await client.createOrReplace(doc);
  }

  console.log(`Seeding ${courses.length} courses...`);
  for (const course of courses) {
    const courseDoc = {
      _id: `course-${course.slug}`,
      _type: "course",
      name: course.name,
      slug: { _type: "slug", current: course.slug },
      region: { _type: "reference", _ref: `region-${course.region}` },
      city: course.city,
      address: course.address,
      par: course.par,
      rating: course.rating,
      slope: course.slope,
      yardage: course.yardage,
      designer: course.designer,
      yearBuilt: course.yearBuilt,
      practice: course.practice,
      paceTarget: course.paceTarget,
      walking: course.walking,
      summary: course.summary,
      signaturePlan: course.signaturePlan,
      localTips: course.localTips,
      holes: course.holes.map((hole) => ({
        _key: `${hole.number}`,
        _type: "hole",
        number: hole.number,
        par: hole.par,
        yardage: hole.yardage,
        handicap: hole.handicap,
        wind: hole.wind,
        keyFeature: hole.keyFeature,
        danger: hole.danger,
        greenNote: hole.greenNote,
        strategy: hole.strategy,
        teeYardages: {
          _type: "object",
          tips: hole.teeYardages.tips,
          member: hole.teeYardages.member,
          forward: hole.teeYardages.forward,
        },
      })),
    };

    await client.createOrReplace(courseDoc);
    console.log(`  ✓ ${course.name}`);
  }

  console.log("Done seeding Sanity content.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
