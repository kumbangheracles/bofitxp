# PROJECT.md

Dibuat berdasarkan audit sumber kode pada tanggal 2026-10-19.

## Ringkasan proyek

BoFitXP adalah aplikasi fitness/gamifikasi yang terdiri dari:

- frontend mobile: `bofitxp-fe` menggunakan Expo + React Native + Expo Router
- backend API: `bofitxp-be` menggunakan Express + TypeScript + Prisma + MongoDB
- database: MongoDB via Prisma ORM
- AI quest generation: backend memanggil Groq untuk menghasilkan quest yang disesuaikan dengan profil user

## Struktur repo

- `bofitxp-be/`: API backend, Prisma schema, servis, middleware, validasi, test
- `bofitxp-fe/`: aplikasi mobile Expo
- `docs/ai-context/`: dokumentasi konteks AI untuk lintas chat/sesi
- `uml/`: artefak diagram UML

## Bukti arsitektur yang terlihat dari code

- Backend bootstrap: `bofitxp-be/src/app.ts` mendaftarkan Express app, CORS, JSON parser, logging, dan route `/api`
- Frontend bootstrap: `bofitxp-fe/src/app/_layout.tsx` menyusun `AuthProvider`, query client, theme provider, toast, dan Stack navigator
- Autentikasi: `bofitxp-fe/src/context/AuthContext.tsx` menyimpan JWT di `expo-secure-store`
- Backend auth middleware: `bofitxp-be/src/middlewares/auth.middleware.ts` memvalidasi header `Authorization: Bearer ...`
- Schema database: `bofitxp-be/prisma/schema.prisma` mendefinisikan `Users`, `Quests`, dan `UserQuest`

## Lingkungan/variabel penting yang terlihat dari kode

Berdasarkan file yang dibaca, variabel yang relevan adalah:

- `DATABASE_URL` untuk Prisma MongoDB
- `SECRET` untuk JWT signing/verification
- `EMAIL_SMTP_USER` untuk pengiriman email aktivasi

Catatan: file `.env` tidak dibuka untuk alasan keamanan; hanya nama variabel yang dicatat dari kode yang dipindai.

## Status saat ini

Berdasarkan source code yang dapat diverifikasi:

- auth register/login/activation/resend activation sudah ada di backend
- middleware auth sudah ada
- endpoint user quest generation sudah ada
- frontend menyediakan provider auth dan routing utama
- test API tersedia untuk login dan activation

Belum bisa diverifikasi penuh:

- apakah semua flow FE sudah terhubung dengan real API
- apakah semua fitur selesai atau masih draft
- apakah build/deploy berjalan clean

## Perubahan repo yang perlu diwaspadai

Saat audit, git status menunjukkan perubahan yang belum di-commit:

- `AGENTS.md` terhapus
- `.github/` dan `docs/` ada sebagai perubahan baru

Tidak ada perubahan yang dihapus atau diubah secara sengaja pada repo oleh agen ini.
