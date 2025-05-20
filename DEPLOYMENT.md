# Laravel Application Deployment Guide for Render

This guide explains the complete setup and deployment process of a Laravel application on Render using Docker, Nginx, and MySQL.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Configuration Files](#configuration-files)
3. [Docker Setup](#docker-setup)
4. [Web Server Configuration](#web-server-configuration)
5. [Database Configuration](#database-configuration)
6. [Deployment Process](#deployment-process)
7. [Troubleshooting](#troubleshooting)

## Project Structure

```
├── .render.yaml          # Render deployment configuration
├── Dockerfile           # Docker build instructions
├── docker/
│   └── nginx.conf      # Nginx web server configuration
├── config/
│   └── database.php    # Laravel database configuration
└── ... (other Laravel files)
```

## Configuration Files

### 1. .render.yaml
This file configures how your application is deployed on Render.

```yaml
services:
  - type: web
    name: union              # Your application name
    env: docker             # Using Docker deployment
    region: oregon          # Deployment region
    plan: free             # Service plan
    branch: main           # Git branch to deploy
    dockerfilePath: ./Dockerfile
    buildFilter:
      paths:
        - ./
    healthCheckPath: /
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
      - key: APP_KEY
        generateValue: true
      - key: DB_CONNECTION
        value: mysql
      - key: DB_HOST
        fromDatabase:
          name: union-db
          property: host
      - key: DB_PORT
        value: 3306
      - key: DB_DATABASE
        fromDatabase:
          name: union-db
          property: database
      - key: DB_USERNAME
        fromDatabase:
          name: union-db
          property: user
      - key: DB_PASSWORD
        fromDatabase:
          name: union-db
          property: password
```

### 2. Dockerfile
The Dockerfile defines how your application container is built.

```dockerfile
# Use PHP image with necessary extensions
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Install Node dependencies & build assets
RUN npm install && npm run build

# Install Nginx
RUN apt-get install -y nginx

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Expose port 80
EXPOSE 80

# Start Nginx and PHP-FPM
CMD service nginx start && php-fpm
```

### 3. Nginx Configuration (docker/nginx.conf)
Configures the web server to handle requests properly.

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Docker Setup

### Key Components
1. **Base Image**: PHP 8.2 with FPM
2. **Extensions**: 
   - pdo_mysql (MySQL support)
   - mbstring (String handling)
   - zip (File compression)
   - exif (Image metadata)
   - pcntl (Process control)
   - bcmath (Arbitrary precision math)

### Node.js Setup
- Installs Node.js 18.x
- Used for building frontend assets
- Required for Laravel Mix/Vite

### Composer Setup
- Installs PHP dependencies
- Optimized for production (`--no-dev --optimize-autoloader`)

### File Permissions
- Sets proper ownership (www-data)
- Configures correct permissions for:
  - storage directory
  - bootstrap/cache directory

## Web Server Configuration

### Nginx Features
1. **Security Headers**:
   - X-Frame-Options
   - X-Content-Type-Options

2. **PHP Processing**:
   - FastCGI configuration
   - PHP-FPM integration
   - Proper script handling

3. **Static Files**:
   - Efficient static file serving
   - Favicon and robots.txt handling
   - Hidden file protection

## Database Configuration

### MySQL Setup
1. **Connection Details**:
   - Host: Provided by Render
   - Port: 3306
   - Database: union-db
   - Credentials: Managed by Render

2. **Environment Variables**:
   - DB_CONNECTION=mysql
   - DB_HOST (from Render)
   - DB_PORT=3306
   - DB_DATABASE (from Render)
   - DB_USERNAME (from Render)
   - DB_PASSWORD (from Render)

## Deployment Process

### 1. Preparation
- Ensure all files are committed to Git
- Verify you're on the main branch
- Check that all configurations are correct

### 2. Render Setup
1. Create a new Web Service
2. Connect your Git repository
3. Select the main branch
4. Render will automatically:
   - Create a MySQL database
   - Build the Docker image
   - Deploy the application
   - Configure environment variables

### 3. Post-Deployment
1. Run database migrations:
   ```bash
   php artisan migrate
   ```
2. Clear application cache:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan view:clear
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify environment variables
   - Check database credentials
   - Ensure MySQL extension is installed

2. **Permission Issues**
   - Verify storage directory permissions
   - Check bootstrap/cache permissions
   - Ensure proper www-data ownership

3. **Nginx Issues**
   - Check Nginx error logs
   - Verify PHP-FPM is running
   - Ensure proper fastcgi configuration

4. **Build Issues**
   - Check Node.js version
   - Verify Composer dependencies
   - Ensure proper PHP extensions

### Logs
- Application logs: `storage/logs/laravel.log`
- Nginx logs: `/var/log/nginx/`
- PHP-FPM logs: `/var/log/php-fpm/`

## Best Practices

1. **Security**
   - Keep APP_DEBUG=false in production
   - Use strong database passwords
   - Enable security headers
   - Protect sensitive directories

2. **Performance**
   - Enable Composer optimization
   - Use production asset compilation
   - Configure proper caching
   - Optimize database queries

3. **Maintenance**
   - Regular dependency updates
   - Database backups
   - Log rotation
   - Security patches

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/) 