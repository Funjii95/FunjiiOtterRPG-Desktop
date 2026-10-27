import {defineConfig} from 'vite';
// Share all gameplay and assets with Windows, but authenticate through Twitch.
export default defineConfig({base:'./',build:{outDir:'dist-twitch',minify:false,sourcemap:false,rollupOptions:{input:['panel.html','mobile.html','config.html'],output:{manualChunks:id=>id.includes('node_modules')?'vendor-react':undefined}}}});
