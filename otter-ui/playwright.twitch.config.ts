import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'twitch-current.spec.ts',workers:1,use:{baseURL:'http://localhost:8084'},webServer:{command:`node node_modules/vite/bin/vite.js preview --outDir ${process.env.TWITCH_TEST_DIST??'dist-twitch'} --port 8084 --strictPort`,url:'http://localhost:8084/panel.html',reuseExistingServer:false}});
