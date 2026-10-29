import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'trinket-layout.spec.ts',workers:1,use:{baseURL:'http://localhost:8085'},webServer:{command:'node node_modules/vite/bin/vite.js preview --outDir dist --port 8085 --strictPort',url:'http://localhost:8085/desktop.html',reuseExistingServer:false}});
