#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for database connection..."
while ! nc -z ${DB_HOST:-db} ${DB_PORT:-3306}; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Clear and cache configs
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start supervisord (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisord.conf
