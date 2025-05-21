# -----------------------------
# Build Stage
# -----------------------------
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files and configs first for better caching
COPY package*.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY components.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY public ./public
COPY resources ./resources
COPY routes ./routes
COPY storage ./storage
COPY tests ./tests
COPY artisan ./
COPY composer.json ./
COPY composer.lock ./

# Verify the directory structure
RUN echo "Verifying directories:" && \
    ls -la /app/resources/js/components && \
    ls -la /app/resources/js/Pages

# Build the frontend assets
ENV NODE_ENV=production
RUN npm run build

# -----------------------------
# Production Stage
# -----------------------------
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev nginx \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy built assets from build stage
COPY --from=build /app/public/build ./public/build

# Copy all application files
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY public ./public
COPY resources ./resources
COPY routes ./routes
COPY storage ./storage
COPY tests ./tests
COPY artisan ./
COPY composer.json ./
COPY composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Configure Nginx
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Validate Nginx config at build time
RUN nginx -t

# Expose port
EXPOSE 80

# Start both Nginx and PHP-FPM in foreground for container
CMD php-fpm & nginx -g 'daemon off;' & tail -n 50 storage/logs/laravel.log