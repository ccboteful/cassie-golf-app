import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-18";

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

const imageBuilder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: unknown): string | null {
  if (!imageBuilder || !source) return null;

  try {
    return imageBuilder.image(source as never).auto("format").fit("max").url();
  } catch {
    return null;
  }
}
