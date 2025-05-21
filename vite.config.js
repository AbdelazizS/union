import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/app/resources/js',
            '~': '/app/resources',
            '@components': '/app/resources/js/components',
            '@layouts': '/app/resources/js/Layouts',
            '@pages': '/app/resources/js/Pages',
        },
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/],
        },
    },
});
