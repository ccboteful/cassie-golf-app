export default {
  name: "hole",
  title: "Hole",
  type: "object",
  fields: [
    {
      name: "number",
      title: "Hole Number",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(18),
    },
    {
      name: "par",
      title: "Par",
      type: "number",
      options: {
        list: [
          { title: "Par 3", value: 3 },
          { title: "Par 4", value: 4 },
          { title: "Par 5", value: 5 },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "yardage",
      title: "Yardage",
      type: "number",
    },
    {
      name: "handicap",
      title: "Handicap Rating",
      type: "number",
      options: {
        list: Array.from({ length: 18 }, (_, i) => ({
          title: `#${i + 1}`,
          value: i + 1,
        })),
      },
    },
    {
      name: "type",
      title: "Hole Type",
      type: "string",
      options: {
        list: [
          { title: "Par 3", value: "par-3" },
          { title: "Par 4", value: "par-4" },
          { title: "Par 5", value: "par-5" },
        ],
      },
    },
    {
      name: "description",
      title: "Hole Description",
      type: "text",
      rows: 2,
    },
    {
      name: "strategy",
      title: "Strategy & Tips",
      type: "text",
      rows: 3,
    },
    {
      name: "image",
      title: "Hole Map Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      number: "number",
      par: "par",
      yardage: "yardage",
    },
    prepare({ number, par, yardage }) {
      return {
        title: `Hole ${number}`,
        subtitle: `Par ${par} • ${yardage} yards`,
      };
    },
  },
};
