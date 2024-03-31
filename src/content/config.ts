import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    type: "content",
    // Type-check frontmatter using a schema
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        series: z.literal(false).default(false),
    }),
});

export const seriesMain = z.object({
    main: z.literal(true).default(true),
    title: z.string(),
    description: z.string(),
    groups: z
        .record(
            z.string().refine((group) => {
                const parts = group.split("-");

                if (parts.length > 2) return false;

                for (const part of parts) {
                    if (isNaN(parseInt(part))) return false;
                }
                return true;
            }),
            z.string()
        )
        .transform((value) => {
            const groups: Array<{ start: number; end: number; name: string }> = [];
            for (const key in value) {
                const parts = key.split("-");
                if (parts.length === 1) {
                    groups.push({
                        start: parseInt(parts[0]),
                        end: parseInt(parts[0]),
                        name: value[key],
                    });
                } else {
                    groups.push({
                        start: parseInt(parts[0]),
                        end: parseInt(parts[1]),
                        name: value[key],
                    });
                }
            }
            return groups;
        }),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    series: z.literal(true).default(true),
});
export const seriesEntry = z.object({
    main: z.literal(false).default(false),
    index: z.number().int(),
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    series: z.literal(true).default(true),
});
export type SeriesMain = z.infer<typeof seriesMain>;
export type SeriesEntry = z.infer<typeof seriesEntry>;

const series = defineCollection({
    type: "content",
    schema: z.union([seriesEntry, seriesMain]),
});

export const collections = { blog, series };
