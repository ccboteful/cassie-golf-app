export default {
  name: "course",
  title: "Golf Course",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Course Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "region",
      title: "Region",
      type: "string",
      options: {
        list: [
          { title: "North Des Moines", value: "north" },
          { title: "South Des Moines", value: "south" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "address",
      title: "Address",
      type: "string",
    },
    {
      name: "coordinates",
      title: "Coordinates",
      type: "object",
      fields: [
        {
          name: "lat",
          title: "Latitude",
          type: "number",
        },
        {
          name: "lng",
          title: "Longitude",
          type: "number",
        },
      ],
    },
    {
      name: "image",
      title: "Course Map Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "holes",
      title: "Number of Holes",
      type: "number",
      options: {
        min: 9,
        max: 27,
      },
    },
    {
      name: "par",
      title: "Par",
      type: "number",
    },
    {
      name: "rating",
      title: "Course Rating",
      type: "number",
    },
    {
      name: "slope",
      title: "Slope Rating",
      type: "number",
    },
    {
      name: "yardage",
      title: "Total Yardage",
      type: "number",
    },
    {
      name: "designer",
      title: "Course Designer",
      type: "string",
    },
    {
      name: "yearBuilt",
      title: "Year Built",
      type: "number",
    },
    {
      name: "website",
      title: "Website URL",
      type: "url",
    },
    {
      name: "description",
      title: "Course Description",
      type: "text",
      rows: 3,
    },
    {
      name: "strategy",
      title: "Course Strategy",
      type: "text",
      rows: 4,
    },
    {
      name: "holesArray",
      title: "Holes Details",
      type: "array",
      of: [
        {
          type: "hole",
        },
      ],
    },
    {
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
    },
  ],
  preview: {
    select: {
      title: "name",
      region: "region",
      media: "image",
    },
    prepare({ title, region, media }) {
      return {
        title: title,
        subtitle: `${region} • ${title}`,
        media: media,
      };
    },
  },
};
