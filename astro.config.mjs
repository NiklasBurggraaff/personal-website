import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    site: "https://niklas-burggraaff.vercel.app/",
    integrations: [mdx(), sitemap(), tailwind(), svelte(), icon()],
    image: {
        remotePatterns: [{ protocol: "https" }],
    },
});
