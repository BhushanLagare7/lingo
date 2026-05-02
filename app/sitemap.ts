import { MetadataRoute } from "next";

import { getCourses } from "@/db/queries";

export async function generateSitemaps() {
  // We can fetch the total number of courses and chunk them.
  // For demonstration, we just return one chunk.
  return [{ id: 0 }];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lingo-clone.example.com";
  
  // Fetch courses to add dynamic routes to the sitemap
  const courses = await getCourses();
  
  const courseEntries = courses.map((course) => ({
    url: `${baseUrl}/courses`, // Just pointing to /courses since course details are under /learn
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Chunking logic can go here (e.g., limit 50,000 per chunk based on the id).
  // For now, we just return the static pages and the courses.

  const staticEntries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quests`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  if (id === 0) {
    // deduplicate course entries if multiple courses point to the same URL
    return [...staticEntries, courseEntries[0]].filter(Boolean);
  }

  return [];
}
