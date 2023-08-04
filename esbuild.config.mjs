import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import esbuildSvelte from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';

await build({
    platform: 'node',
    packages: 'external',
    target: 'es6',
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: './dist',
    entryPoints: ['./src/main.ts'],
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