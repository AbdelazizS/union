# -----------------------------
# Build Stage
# -----------------------------
    FROM node:18 AS build

    # Set working directory
    WORKDIR /app
    
    # Copy package files and Vite config
    COPY package*.json vite.config.js ./
    
    # Install dependencies
    RUN npm install
    
    # First, copy only the resources directory to verify it exists
    COPY resources ./resources
    
    # Verify the resources directory structure (updated to match actual structure)
    RUN echo "Checking resources directory structure:" && \
        ls -la /app/resources && \
        echo "Checking js directory:" && \
        ls -la /app/resources/js
    
    # Now copy the rest of the application
    COPY . .
    
    # Build the frontend assets
    ENV NODE_ENV=production
    RUN npm run build
    
    # -----------------------------
    # Production Stage
    # -----------------------------
    FROM php:8.2-fpm
    
    # Set working directory
    WORKDIR /var/www
    
    # Install system dependencies and PHP extensions
    RUN apt-get update && apt-get install -y --no-install-recommends \
        git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev nginx \
        && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath \
        && apt-get clean && rm -rf /var/lib/apt/lists/*
    
    # Install Composer
    COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
    
    # Copy only built Vite assets
    COPY --from=build /app/public/build /var/www/public/build
    
    # Copy Laravel application
    COPY . .
    
    # Laravel: install PHP dependencies
    RUN composer install --no-dev --optimize-autoloader
    
    # Laravel: permissions
    RUN chown -R www-data:www-data /var/www \
        && chmod -R 755 /var/www/storage \
        && chmod -R 755 /var/www/bootstrap/cache
    
    # Configure Nginx
    COPY docker/nginx.conf /etc/nginx/sites-available/default
    
    # Expose HTTP
    EXPOSE 80
    
    # Start services
    CMD service nginx start && php-fpm