import type { MetadataRoute } from "next";

const BASE_URL = "https://vespermag.co";
const ROUTES = ["", "/about", "/membership", "/apply", "/faq"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
