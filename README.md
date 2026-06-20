# Meltalcare

Meltalcare adalah aplikasi fullstack dengan frontend Next.js dan backend Laravel.

## Struktur Folder

```txt
meltalcare/
  frontend/   # Next.js app
  backend/    # Laravel API
  docs/       # Dokumen laporan dan presentasi
```

## Menjalankan Project

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
