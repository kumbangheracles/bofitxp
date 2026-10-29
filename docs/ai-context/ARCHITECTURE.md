# ARCHITECTURE.md

Dibuat dan diperbarui berdasarkan audit source code dan verifikasi status fitur hingga 2026-10-20.

## 1. Arsitektur umum

Proyek ini adalah monorepo dengan dua aplikasi terpisah:

- `bofitxp-fe`: mobile app berbasis Expo/React Native
- `bofitxp-be`: API backend berbasis Express + TypeScript

Komunikasi antar layer utama adalah:

- frontend menyimpan JWT di `expo-secure-store`
- frontend memanggil API backend melalui endpoint REST
- backend memvalidasi token di middleware auth
- backend memakai Prisma untuk akses database MongoDB
- quest completion event diproses di backend lalu dikirim kembali ke frontend sebagai payload event untuk toast

## 2. Frontend

Bukti dari source code:

- `bofitxp-fe/src/app/_layout.tsx` menyiapkan provider global:
  - `AuthProvider`
  - `QueryClientProvider`
  - toast manager
  - stack navigator `Stack`
- `bofitxp-fe/src/context/AuthContext.tsx` menangani token, login, logout, dan expiry token
- `bofitxp-fe/src/hooks/use-finished-quest.ts` menangani completion quest dan memanggil custom toast
- `bofitxp-fe/src/components/CustomToastManager.tsx` menampilkan toast berdasarkan `type` dan message

Arsitektur frontend yang terlihat:

- state auth global via context
- state app global via provider custom
- data fetching/cache via React Query
- navigasi file-based via Expo Router
- feedback event global via toast provider

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
3. service melakukan validasi bisnis dan akses Prisma
4. response menggunakan format umum `{ message, data }`
5. untuk quest completion, service mengembalikan `event` payload untuk frontend

## 4. Pola controller-service dan clean code

Pemisahan antara controller dan service sudah ada di backend, dan mengikuti pola layered architecture yang umum dalam OOP/clean code:

- `controller` bertugas menangani HTTP request/response, validasi input dasar, dan delegasi ke service
- `service` memuat business logic, orchestration, dan akses data (Prisma)
- model/domain logic tidak dibenamkan di controller agar fungsi lebih fokus, mudah diuji, dan reusable

Bukti dari code:

- `bofitxp-be/src/controllers/auth.controller.ts` hanya memproses `req`/`res` dan memanggil `AuthService`
- `bofitxp-be/src/services/auth.service.ts` menangani login/register/activation logic dan access database
- `bofitxp-be/src/controllers/userQuest.controller.ts` bertindak sebagai adapter HTTP, sementara `UserQuestService` memegang flow generate/finish quest dan reward event

Konsep clean code yang paling tepat untuk pola ini adalah:

- Separation of Concerns (SoC): tiap layer punya tanggung jawab berbeda
- Single Responsibility Principle (SRP): satu class/service fokus pada satu domain behavior
- Layered Architecture: HTTP layer, service layer, data access layer

Dengan kata lain, pendekatan ini bukan hanya "OOP style" semata, tetapi pola desain clean code yang membuat kode lebih mudah dipelihara, diuji, dan dikembangkan secara modular.

## 5. Auth flow

Bukti dari kode:

- route auth register/login/activation/resend activation
- middleware auth memvalidasi bearer token
- frontend memprioritaskan token dari secure store

`AuthService.login`:

- mencari user by email
- validasi password
- generate JWT

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
- challenge events dan combo rewards

Quest generation menggunakan AI dari Groq di `UserQuestService.generateQuestWithAI` untuk menghasilkan quest berdasarkan:

- user BMI
- weight/height
- target final
- level dan xp
- category dan difficulty yang diizinkan

## 6. Streak/challenge system

Logika yang saat ini sudah diimplementasikan di backend:

- `resolveQuestEvent()` mengecek combo streak berdasarkan quest harian berturut-turut dalam 24 jam
- `finishedQuest()` menghitung event berdasarkan `recentCompletedCount`, difficulty, category, dan level user
- challenge multiplier aktif ketika quest lebih sulit dari level user
- event dikembalikan dalam payload untuk frontend toast

Frontend juga sudah menangkap event tersebut:

- `use-finished-quest.ts` memanggil custom toast saat `result.event.toast` ada
- `CustomToastManager.tsx` menampilkan visual berbeda untuk `success` dan `info`

## 7. Struktur keputusan desain

- Frontend fokus ke UX mobile dan auth persistence
- Backend fokus ke API + business logic + database + email verification
- Database memakai MongoDB, bukan SQL relasional standard
- Validasi request dan auth token ditempatkan di layer yang berbeda
- Feedback event dengan toast dibuat sebagai bagian dari game-loop completion, bukan sekadar notifikasi acak

## 8. Catatan risiko/ketidakpastian

Hal yang masih belum bisa dianggap final tanpa black-box/manual verification:

- apakah semua screen mobile terkoneksi dengan API real
- apakah semua route di FE benar-benar menjalankan flow yang diharapkan
- apakah edge case lainnya (duplikasi quest, expired token, streak reset, challenge threshold) memenuhi kebutuhan produk saat runtime

## 9. Kesimpulan

Arsitektur saat ini sudah cukup matang untuk MVP: mobile frontend, backend API, database MongoDB, autentikasi JWT, AI quest generation, dan game logic yang mencakup XP, level, streak, serta challenge event. Status fungsional yang sudah dibuktikan lewat source code dan test terfokus adalah kuat; verifikasi end-to-end UI tetap dibagi ke pengujian black-box pengguna.
