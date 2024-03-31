import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    type: "content",
    // Type-check frontmatter using a schema
    schema: z.object({
        name: z.string(),
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        series: z.boolean().default(false),
        // heroImage: z.string().optional(),
    }),
});

export const collections = { blog };
