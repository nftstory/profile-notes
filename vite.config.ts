import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";
import manifest from "./src/manifest";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

const isDev = process.env.__DEV__ === "true";

export default defineConfig({
  plugins: [solidPlugin(), crx({ manifest }), WindiCSS()],
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir,
    },
  },
  publicDir,
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext', // you can also use 'es2020' here
    },
  },
  build: {
    outDir,
    target: 'esnext', // you can also use 'es2020' here
    sourcemap: 'inline',
    rollupOptions: {
      input: {
        import: 'src/pages/importpopup/index.html',
      },
    },
  },
});
