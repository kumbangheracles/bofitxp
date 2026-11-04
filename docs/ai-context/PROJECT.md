# PROJECT.md

Dibuat dan diperbarui berdasarkan audit source code dan verifikasi terfokus pada 2026-10-20.

## Ringkasan proyek

BoFitXP adalah aplikasi fitness/gamifikasi yang terdiri dari:

- frontend mobile: `bofitxp-fe` berbasis Expo + React Native + Expo Router
- backend API: `bofitxp-be` berbasis Express + TypeScript + Prisma + MongoDB
- database: MongoDB lewat Prisma ORM
- AI quest generation: backend memanggil Groq untuk menghasilkan quest yang dipersonalisasi berdasarkan profil user
- gamification: quest completion, XP, level, streak, dan challenge bonus

## Struktur repo

- `bofitxp-be/`: API backend, Prisma schema, logic service, middleware, validasi, test
- `bofitxp-fe/`: aplikasi mobile Expo
- `docs/ai-context/`: dokumentasi AI context lintas chat/sesi
- `uml/`: artefak diagram UML

## Bukti arsitektur yang terlihat dari code

- Backend bootstrap: `bofitxp-be/src/app.ts` mendaftarkan Express app, CORS, JSON parser, logging, dan route `/api`
- Frontend bootstrap: `bofitxp-fe/src/app/_layout.tsx` menyiapkan provider auth, query client, toast, dan navigator
- Autentikasi: `bofitxp-fe/src/context/AuthContext.tsx` menyimpan JWT di `expo-secure-store`
- Backend auth middleware: `bofitxp-be/src/middlewares/auth.middleware.ts` memvalidasi header `Authorization: Bearer ...`
- Schema database: `bofitxp-be/prisma/schema.prisma` mendefinisikan `Users`, `Quests`, dan `UserQuest`
- Quest business logic: `bofitxp-be/src/services/userQuest.service.ts` mengelola generate, finish, XP, streak, dan challenge event
- Frontend toast: `bofitxp-fe/src/context/CostumToastProvider.tsx` dan `bofitxp-fe/src/components/CustomToastManager.tsx` menangani feedback global

## Lingkungan/variabel penting yang terlihat dari kode

Variabel yang relevan berdasarkan code:

- `DATABASE_URL` untuk Prisma MongoDB
- `SECRET` untuk JWT signing/verification
- `EMAIL_SMTP_USER` untuk pengiriman email aktivasi
- `GROQ_API_KEY` untuk generate quest AI

Catatan: file `.env` tidak dibuka untuk alasan keamanan; hanya nama variabel yang dicatat dari kode yang dipindai.

## Status yang terverifikasi berdasarkan source code

Fitur yang saat ini dapat dibuktikan telah ada:

- auth register/login/activation/resend activation
- middleware auth dan JWT protection
- CRUD profil dan update BMI/user info
- generation quest daily/weekly/special
- completion quest dengan `finishedAt`
- reward XP dan level progression
- streak combo logic dan challenge bonus logic
- toast event untuk combo/challenge di frontend

## Status yang masih harus diverifikasi secara manual

- runtime FE di mobile app / simulator / device
- integrasi end-to-end antara semua screen dan API real
- black-box testing masing-masing fitur per domain
- build/deploy clean di environment nyata

## Keputusan dokumentasi saat ini

- status core feature sudah cukup mapan untuk terus dikembangkan
- logika streak dan challenge sudah masuk ke source code dan test terfokus
- verifikasi real device / manual UI tetap diserahkan ke pengguna sebagai black-box testing per fitur

## Perubahan repo yang perlu diwaspadai

Saat terakhir audit, perubahan yang terlihat adalah pada file yang relevan untuk fitur quest/streak, dokumentasi AI context, dan test terpisah per domain. Tidak ada perubahan yang dihapus atau diubah tanpa pemeriksaan.
