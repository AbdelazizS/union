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
            '@': path.resolve(__dirname, 'resources/js'),
            '~': path.resolve(__dirname, 'resources'),
            '@components': path.resolve(__dirname, 'resources/js/components'),
            '@layouts': path.resolve(__dirname, 'resources/js/Layouts'),
            '@pages': path.resolve(__dirname, 'resources/js/Pages'),
        },
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/],
        },
    },
});
