<script lang="ts">
    import { clsx } from "clsx";
    import { Moon, Sun } from "lucide-svelte";
    import { onMount } from "svelte";

    let timeout: NodeJS.Timeout | undefined = undefined;

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    function updateTheme(immediate = false) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

        if (timeout !== undefined) {
            clearTimeout(timeout);
        }

        if (localStorage.theme === "light") {
            selected = "light";
            if (immediate) {
                document.documentElement.classList.remove("dark");
                link.href = "/favicon-light.svg";
            } else {
                timeout = setTimeout(() => {
                    document.documentElement.classList.remove("dark");
                    link.href = "/faviconLight.png";
                }, 150);
            }
        } else {
            selected = "dark";
            if (immediate) {
                document.documentElement.classList.add("dark");
                link.href = "/favicon-dark.svg";
            } else {
                timeout = setTimeout(() => {
                    document.documentElement.classList.add("dark");
                    link.href = "/favicon-dark.svg";
                }, 150);
            }
        }
    }

    function toggleTheme() {
        const theme = selected === "dark" ? "light" : "dark";
        localStorage.theme = theme;

        updateTheme();
    }

    let selected: "light" | "dark" | undefined = undefined;

    onMount(() => {
        selected = document.documentElement.classList.contains("dark") ? "dark" : "light";
    });
</script>

<button
    class={clsx(
        "relative m-0.5 box-border flex gap-4 rounded-full border-2 border-base-500 p-2 shadow-sm",
        "hover:m-[0.0625rem] hover:border-[3px] hover:border-primary",
        selected === "light" ? "bg-base-300 text-base-700" : "bg-base-900 text-base-400",
        {
            "transition-colors": selected !== undefined,
        }
    )}
    title={`Toggle to ${selected === "dark" ? "light" : "dark"} mode`}
    on:click={() => toggleTheme()}
>
    <Moon class="z-10 h-5 w-5" />
    <Sun class="z-10 h-5 w-5" />
    <div
        class={clsx(
            "absolute left-1 top-1 h-7 w-7 rounded-full shadow-lg",
            selected === "light" ? "bg-base-100" : "bg-base-700",
            {
                "transition-[colors,transform]": selected !== undefined,
                "translate-x-9": selected === "light",
            }
        )}
    />
</button>
