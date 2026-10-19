# ARCHITECTURE.md

Dibuat berdasarkan audit codebase pada 2026-10-19.

## 1. Arsitektur umum

Proyek ini adalah monorepo dengan dua aplikasi terpisah:

- `bofitxp-fe`: mobile app berbasis Expo / React Native
- `bofitxp-be`: API backend berbasis Express + TypeScript

Komunikasi antar layer utama adalah:

- frontend menyimpan JWT di `expo-secure-store`
- frontend memanggil API backend melalui endpoint REST
- backend memvalidasi token di middleware auth
- backend memakai Prisma untuk akses database MongoDB

## 2. Frontend

Bukti dari source code:

- `bofitxp-fe/src/app/_layout.tsx` menyiapkan provider global:
  - `AuthProvider`
  - `GlobalSatateProvider`
  - `QueryClientProvider`
  - theme provider
  - toast manager
  - stack navigator `Stack`
- `bofitxp-fe/src/context/AuthContext.tsx` menangani token, login, logout, dan pengecekan expiry token
- FE memakai Expo Router (`app/`), `@tanstack/react-query`, `styled-components`, `react-hook-form`, `zustand`

Arsitektur frontend yang terlihat:

- state auth global via context
- state app global via provider custom
- data fetching dan cache via React Query
- navigasi bersifat file-based routing expo-router

## 3. Backend

Struktur utama yang terlihat:

- `src/app.ts`: bootstrap Express app
- `src/routes/api.ts`: route utama API
- `src/controllers/*`: handler request
- `src/services/*`: operasi bisnis
- `src/middlewares/auth.middleware.ts`: guard autentikasi
- `src/validation/*`: validasi payload
- `src/utils/*`: helper JWT, Prisma, env, logger, encryption, verification code

Flow umum backend:

1. request masuk ke route
2. controller memanggil service
3. service akses Prisma
4. response dibungkus ke format standar `{ message, data }`

## 4. Auth flow

Bukti dari kode:

- route `POST /api/auth/register`
- route `POST /api/auth/login`
- route `POST /api/auth/activation`
- route `POST /api/auth/resend-activation`
- route `GET /api/auth/me` dengan middleware `authMiddleware`

`AuthService.login`:

- find user by email
- validasi password dengan `encrypt(password) === user.password`
- generate JWT melalui `generateToken(...)`

`auth.middleware.ts`:

- mengecek header `Authorization`
- memastikan format `Bearer <token>`
- verifikasi token dengan `jwt.verify`
- menempelkan `user` ke request

## 5. Business domain

Berdasarkan Prisma schema dan service, domain utama adalah:

- user profile, level, streak, xp, BMI, target final
- quest generation and tracking
- gamification progress via `UserQuest`

Quest generation menggunakan AI dari Groq di `UserQuestService.generateQuestWithAI` untuk menghasilkan quest berdasarkan:

- user BMI
- weight/height
- target final
- level dan xp
- category dan difficulty yang diizinkan

## 6. Perbedaan struktur yang jelas

- Frontend fokus ke UX mobile dan auth persistence
- Backend fokus ke API + business logic + database + email verification
- Database memakai MongoDB, bukan SQL relasional standard
- Validasi request dan auth token ditempatkan di layer yang berbeda

## 7. Catatan risiko/ketidakpastian

Beberapa hal masih belum dapat diverifikasi sepenuhnya tanpa menjalankan app:

- apakah semua screen mobile sudah terkoneksi dengan API
- apakah `AuthService.me` benar-benar diimplementasikan atau masih placeholder
- apakah semua controller/service konsisten terhadap response format
- apakah build FE/BE masuk dalam kondisi clean

## 8. Kesimpulan

Arsitektur saat ini adalah arsitektur aplikasi terpisah yang sudah cukup matang untuk MVP: mobile frontend, backend API, database MongoDB, autentikasi JWT, dan AI quest generation. Namun, status fungsional penuh masih harus divalidasi lewat runtime dan test yang lebih lengkap.
