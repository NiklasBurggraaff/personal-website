import { getCollection, type CollectionEntry } from "astro:content";
import type { SeriesEntry, SeriesMain } from "./config";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export async function getSeries() {
    const series = await getCollection("series");

    const publishedSeries = series.filter((entry) => entry.data.published);

    const seriesMains = publishedSeries.filter((entry) => entry.data.main) as Overwrite<
        CollectionEntry<"series">,
        { data: SeriesMain }
    >[];

    const seriesTitles: { [index: string]: string } = {};
    for (const entry of seriesMains) {
        seriesTitles[entry.slug] = entry.data.title;
    }

    return publishedSeries.map((entry) => {
        const seriesSlug = entry.slug.split("/")[0];
        const seriesTitle = seriesTitles[seriesSlug];

        return {
            ...entry,
            data: {
                ...entry.data,
                seriesTitle,
                seriesSlug,
            },
        };
    });
}

export async function getSeriesEntries(name: string) {
    const series = await getSeries();

    const seriesMain = series.find((entry) => entry.data.main)! as Overwrite<
        CollectionEntry<"series">,
        { data: SeriesMain }
    >;

    const entries = series.filter(
        (entry) => !entry.data.main && entry.data.seriesTitle === name
    ) as Overwrite<CollectionEntry<"series">, { data: SeriesEntry }>[];
    entries.sort((a, b) => a.data.index - b.data.index);

    return {
        groups: seriesMain.data.groups,
        entries,
    };
}

export async function getBlogPosts() {
    const posts = await getCollection("blog");

    return posts.filter((entry) => entry.data.published);
}

export async function getMainPosts(): Promise<CollectionEntry<"blog" | "series">[]> {
    const blogsPromise = getBlogPosts();
    const seriesPromise = getSeries();

    const [blogs, series] = await Promise.all([blogsPromise, seriesPromise]);

    const seriesMain = series.filter((entry) => entry.data.main);

    return [...blogs, ...seriesMain];
}

export async function getAllPosts(): Promise<CollectionEntry<"blog" | "series">[]> {
    const blogs = getBlogPosts();
    const series = getSeries();

    const [blogsResult, seriesResult] = await Promise.all([blogs, series]);

    return [...blogsResult, ...seriesResult];
}
