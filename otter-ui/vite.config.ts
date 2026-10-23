import { defineConfig } from "vite";
export default defineConfig(({mode})=>({
  base: "./",
  build: {
    // Twitch reviewers must be able to read application code. Keep third-party code separate.
    minify: false,
    sourcemap: false,
    rollupOptions: {
      input: ["desktop.html"],
      output: {manualChunks: id => id.includes('node_modules') ? 'vendor-react' : undefined},
    },
  },
}));
