import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser-e2e',use:{baseURL:'http://127.0.0.1:5193',browserName:'chromium'},webServer:{command:'pnpm exec vite preview --host 127.0.0.1 --port 5193 --outDir dist-browser',url:'http://127.0.0.1:5193/browser.html',reuseExistingServer:false},reporter:'list'});
