// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { siteUrl } from './src/config/site.ts';

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle every npm module that src/**/*.ts(x) imports. Vite's scan of .astro
    // pages misses modules only reached through hydrated React islands; the dev
    // server then discovers them on first hydration, re-optimizes, and serves
    // 504 "Outdated Optimize Dep" to the island, which never hydrates.
    // tests/dev-deps.test.mjs fails when a new client import is missing here.
    optimizeDeps: {
      include: [
        '@base-ui/react/dialog',
        '@base-ui/react/input',
        '@base-ui/react/menu',
        '@base-ui/react/merge-props',
        '@base-ui/react/popover',
        '@base-ui/react/preview-card',
        '@base-ui/react/scroll-area',
        '@base-ui/react/tabs',
        '@base-ui/react/use-render',
        '@vidstack/react',
        'class-variance-authority',
        'cn',
        'lucide-react',
        'yet-another-react-lightbox',
        'yet-another-react-lightbox/plugins',
      ],
    },
  },
});
