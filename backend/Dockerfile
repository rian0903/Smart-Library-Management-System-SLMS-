# =========================================
# Stage 1: Install PHP dependencies
# =========================================
FROM php:8.2-fpm-alpine AS deps

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    icu-dev \
    freetype-dev \
    nodejs \
    npm

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files first (for layer caching)
COPY composer.json composer.lock ./

# Install PHP dependencies (no dev)
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-autoloader \
    --prefer-dist

# Copy the rest of the application
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --no-dev

# =========================================
# Stage 2: Production image
# =========================================
FROM php:8.2-fpm-alpine AS production

# Install runtime dependencies only
RUN apk add --no-cache \
    libpng \
    libjpeg-turbo \
    libwebp \
    libzip \
    oniguruma \
    icu-libs \
    freetype \
    nginx \
    supervisor \
    curl \
    netcat-openbsd

# Install PHP extensions
RUN apk add --no-cache --virtual .build-deps \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
    && apk del .build-deps

# OPcache config for production
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
} > /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www

# Copy application from deps stage
COPY --from=deps /var/www /var/www

# Set correct permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy supervisord config
COPY docker/supervisord.conf /etc/supervisord.conf

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
