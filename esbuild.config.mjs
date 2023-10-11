import builtins from "builtin-modules";
import esbuild from 'esbuild';
import esbuildSvelte from 'esbuild-svelte';
import { copy } from 'esbuild-plugin-copy';
import sveltePreprocess from './svelte.config.js';

await esbuild.build({
    platform: 'browser',
    format: 'cjs',
    target: 'es6',
    bundle: true,
    treeShaking: true,
    minify: true,
    sourcemap: process.env['NODE_ENV'] === 'development' ? 'inline' : false,
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
            compilerOptions: { css: 'injected' },
            preprocess: sveltePreprocess.preprocess,
        }),
    ],
});
