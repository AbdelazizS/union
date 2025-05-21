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
    # Create a temporary jsconfig.json to help with path resolution
    echo '{"compilerOptions": {"baseUrl": ".", "paths": {"@/*": ["resources/js/*"]}}}' > jsconfig.json && \
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
