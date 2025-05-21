# Build stage
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY vite.config.js ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
ENV NODE_ENV=production
ENV VITE_BASE_URL=/app
RUN cd /app && \
    # Create a temporary directory for the build
    mkdir -p /app/tmp && \
    # Copy the UI components to a temporary directory
    cp -r /app/resources/js/components/ui /app/tmp/ && \
    # Create a temporary vite config for the build
    echo 'import { defineConfig } from "vite"; \
    import laravel from "laravel-vite-plugin"; \
    import react from "@vitejs/plugin-react"; \
    import path from "path"; \
    export default defineConfig({ \
        plugins: [ \
            laravel({ \
                input: "resources/js/app.jsx", \
                ssr: "resources/js/ssr.jsx", \
                refresh: true, \
            }), \
            react(), \
        ], \
        resolve: { \
            alias: { \
                "@": path.resolve(__dirname, "resources/js"), \
                "~": path.resolve(__dirname, "resources"), \
                "@components": path.resolve(__dirname, "resources/js/components"), \
                "@layouts": path.resolve(__dirname, "resources/js/Layouts"), \
                "@pages": path.resolve(__dirname, "resources/js/Pages"), \
            }, \
        }, \
    });' > /app/vite.config.js && \
    # Run the build
    npm run build && \
    # Verify the build output exists
    ls -la public/build

# Production stage
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev nginx \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy the built assets from the build stage
COPY --from=build /app/public/build /var/www/public/build

# Copy the rest of the application
COPY . .

# Laravel: install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel: set correct permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Configure Nginx
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Expose HTTP
EXPOSE 80

# Start both Nginx and PHP-FPM
CMD service nginx start && php-fpm
