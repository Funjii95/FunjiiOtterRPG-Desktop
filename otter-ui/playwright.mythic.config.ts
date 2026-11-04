import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'mythic-role-layout.spec.ts',workers:1,use:{baseURL:'http://localhost:8086'},webServer:{command:'node node_modules/vite/bin/vite.js preview --outDir dist --port 8086 --strictPort',url:'http://localhost:8086/desktop.html',reuseExistingServer:false}});
