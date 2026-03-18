import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Course Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "reference",
      to: [{ type: "region" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({ name: "par", title: "Par", type: "number" }),
    defineField({ name: "rating", title: "Rating", type: "number" }),
    defineField({ name: "slope", title: "Slope", type: "number" }),
    defineField({ name: "yardage", title: "Total Yardage", type: "number" }),
    defineField({ name: "designer", title: "Designer", type: "string" }),
    defineField({ name: "yearBuilt", title: "Year Built", type: "number" }),
    defineField({ name: "practice", title: "Practice Notes", type: "text", rows: 2 }),
    defineField({ name: "paceTarget", title: "Pace Target", type: "string" }),
    defineField({
      name: "walking",
      title: "Walking Profile",
      type: "string",
      options: {
        list: [
          { title: "Easy", value: "easy" },
          { title: "Moderate", value: "moderate" },
          { title: "Challenging", value: "challenging" },
        ],
      },
    }),
    defineField({ name: "summary", title: "Course Summary", type: "text", rows: 3 }),
    defineField({
      name: "signaturePlan",
      title: "Signature Plan",
      description: "Overall strategy/playbook for this course.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "localTips",
      title: "Local Tips",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "image",
      title: "Course Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "mapImage",
      title: "Course Map Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "holes",
      title: "Holes",
      type: "array",
      of: [defineArrayMember({ type: "hole" })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "region.title",
      media: "image",
    },
  },
});
