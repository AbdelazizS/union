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
    
    # Install dependencies
    RUN npm install
    
    # Copy application files (include both resources and shadcn components)
    COPY resources ./resources
    COPY components ./components  # For shadcn/ui components
    
    # Verify the directory structure (debugging)
    RUN echo "Verifying directories:" && \
        ls -la /app/components/ui && \
        ls -la /app/resources/js
    
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
    
    # Copy Laravel application files
    COPY . .
    
    # Install PHP dependencies
    RUN composer install --no-dev --optimize-autoloader
    
    # Set permissions
    RUN chown -R www-data:www-data /var/www/html \
        && chmod -R 775 storage bootstrap/cache
    
    # Configure Nginx
    COPY docker/nginx.conf /etc/nginx/sites-available/default
    
    # Expose port
    EXPOSE 80
    
    # Start services
    CMD service nginx start && php-fpm