# Use PHP base image with required extensions
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev nginx \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath

# Install Node.js (for Vite)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy package files first for better caching
COPY package*.json ./
COPY vite.config.js ./

# Install Node dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Laravel: install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel: set correct permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Build frontend assets
ENV NODE_ENV=production
ENV VITE_BASE_URL=/var/www
RUN cd /var/www && \
    npm run build && \
    # Verify the build output exists
    ls -la public/build

# Configure Nginx
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Expose HTTP
EXPOSE 80

# Start both Nginx and PHP-FPM
CMD service nginx start && php-fpm
