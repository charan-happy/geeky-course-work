# use official php image
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y git zip unzip

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY .env /var/www/html/.env

# copy app source
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Exposer Laravel's port
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
