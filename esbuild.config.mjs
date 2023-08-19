import builtins from "builtin-modules";
import esbuild from 'esbuild';
import esbuildSvelte from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { copy } from 'esbuild-plugin-copy';

await esbuild.build({
    platform: 'browser',
    format: 'cjs',
    target: 'es6',
    bundle: true,
    treeShaking: true,
    minify: true,
    sourcemap: true,
    outdir: './dist',
    entryPoints: ['./src/main.ts'],
    external: [
        ...builtins,
        "electron",
        "obsidian"
    ],
    logLevel: "info",
    plugins: [
        copy({
            assets: [
                {
                    from: './manifest.json',
                    to: './manifest.json'
                },
            ],
            dryRun: false,
        }),
        esbuildSvelte({
            compilerOptions: { css: true },
            preprocess: sveltePreprocess(),
        }),
    ],
});
