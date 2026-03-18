import { defineArrayMember, defineConfig, defineSchema } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "Cassie Golf - Sanity CMS",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: "production",

  // Add plugins
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Golf Courses")
          .items([
            S.listItem()
              .title("Courses")
              .child(
                S.documentTypeList("course")
                  .title("All Courses")
                  .defaultOrdering([
                    { field: "name", direction: "asc" },
                  ])
              ),
            S.divider(),
            S.listItem()
              .title("North Des Moines")
              .child(
                S.documentList()
                  .title("North Courses")
                  .filter('_type == "course" && region == "north"')
                  .defaultOrdering([
                    { field: "name", direction: "asc" },
                  ])
              ),
            S.listItem()
              .title("South Des Moines")
              .child(
                S.documentList()
                  .title("South Courses")
                  .filter('_type == "course" && region == "south"')
                  .defaultOrdering([
                    { field: "name", direction: "asc" },
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  // Schema
  schema: {
    types: schemaTypes,
  },
});
