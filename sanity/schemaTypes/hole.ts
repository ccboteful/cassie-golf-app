import { defineField, defineType } from "sanity";

export default defineType({
  name: "hole",
  title: "Hole",
  type: "object",
  fields: [
    defineField({
      name: "number",
      title: "Hole Number",
      type: "number",
      validation: (rule) => rule.required().min(1).max(18),
    }),
    defineField({
      name: "par",
      title: "Par",
      type: "number",
      validation: (rule) => rule.required().min(3).max(5),
    }),
    defineField({
      name: "yardage",
      title: "Yardage",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "handicap",
      title: "Handicap",
      type: "number",
      validation: (rule) => rule.required().min(1).max(18),
    }),
    defineField({
      name: "wind",
      title: "Wind Cue",
      type: "string",
    }),
    defineField({
      name: "keyFeature",
      title: "Key Feature",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "danger",
      title: "Danger to Avoid",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "greenNote",
      title: "Green Note",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "strategy",
      title: "Strategy",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "teeYardages",
      title: "Tee Yardages",
      type: "object",
      fields: [
        defineField({ name: "tips", type: "number", validation: (rule) => rule.required().min(1) }),
        defineField({ name: "member", type: "number", validation: (rule) => rule.required().min(1) }),
        defineField({ name: "forward", type: "number", validation: (rule) => rule.required().min(1) }),
      ],
    }),
    defineField({
      name: "image",
      title: "Hole Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "mapImage",
      title: "Hole Map Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "number",
      par: "par",
      yardage: "yardage",
    },
    prepare({ title, par, yardage }) {
      return {
        title: `Hole ${title}`,
        subtitle: `Par ${par} • ${yardage} yards`,
      };
    },
  },
});
