import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/settings", "/admin"],
      },
    ],
    sitemap: "https://hacchu.net/sitemap.xml",
  };
}
