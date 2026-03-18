import { defineType, defineArrayMember } from "sanity";

/**
 * Export all schema types for Sanity CMS
 */
export const schemaTypes = [
  // Import all type definitions
  ...(await import("./course")).default,
  ...(await import("./hole")).default,
];
