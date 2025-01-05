import { defineCollection, z } from "astro:content";

export const blogSchema = z.object({
    published: z.boolean().default(false),
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
});
export type BlogPost = z.infer<typeof blogSchema>;

const blog = defineCollection({
    type: "content",
    schema: blogSchema,
});

export const seriesMain = blogSchema.extend({
    main: z.literal(true).default(true),
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
    series: z.literal(true).default(true),
});
export const seriesEntry = blogSchema.extend({
    main: z.literal(false).default(false),
    index: z.number().int(),
    series: z.literal(true).default(true),
});
export type SeriesMain = z.infer<typeof seriesMain>;
export type SeriesEntry = z.infer<typeof seriesEntry>;

const series = defineCollection({
    type: "content",
    schema: z.union([seriesEntry, seriesMain]),
});

export const collections = { blog, series };
