# PROGRESS.md

Status terakhir dicatat berdasarkan audit source code dan verifikasi terfokus pada 2026-10-20.

## Fitur yang sudah ada dan terverifikasi dari source code

### 1. Basic auth & user flow

- registrasi akun
- login dengan validasi password dan token JWT
- verifikasi akun via activation code
- pengiriman ulang activation code
- logout flow di frontend via AuthContext
- update profil / BMI melalui user update flow
- middleware autentikasi untuk protected route

Bukti utama:

- `bofitxp-be/src/services/auth.service.ts`
- `bofitxp-be/src/controllers/auth.controller.ts`
- `bofitxp-be/src/routes/api.ts`
- `bofitxp-be/src/middlewares/auth.middleware.ts`
- `bofitxp-fe/src/context/AuthContext.tsx`
- `bofitxp-fe/src/app/public/register.tsx`
- `bofitxp-fe/src/app/public/login.tsx`
- `bofitxp-fe/src/app/private/(tabs)/account.tsx`

### 2. Core quest system

- generate quest AI berdasarkan kategori `daily`, `weekly`, dan `special`
- quest dibuat dengan model `Quests` dan relasi `UserQuest`
- quest dapat ditandai selesai / checked quest
- reward XP berdasarkan difficulty quest
- level naik dihitung dari total XP user
- quest completion menyimpan `finishedAt` dan menilai event quest

Bukti utama:

- `bofitxp-be/src/services/userQuest.service.ts`
- `bofitxp-be/prisma/schema.prisma`
- `bofitxp-fe/src/services/userQuests.service.ts`
- `bofitxp-fe/src/hooks/use-user-quests.ts`
- `bofitxp-fe/src/hooks/use-finished-quest.ts`
- `bofitxp-fe/src/components/Home/ListTodayQuests.tsx`
- `bofitxp-fe/src/components/QuestCard.tsx`

### 3. Streak & challenge logic

Komponen ini sudah terimplementasi di backend dan dihubungkan ke frontend:

- combo streak x2 setelah 3 quest daily berturut-turut dalam 24 jam
- challenge boost x3 saat quest lebih sulit dari kemampuan user
- event reward dikembalikan dalam payload `event` lalu dipakai untuk toast
- `finishedQuest()` menambah XP dan menyesuaikan `streak` user

Bukti utama:

- `bofitxp-be/src/services/userQuest.service.ts`
- `bofitxp-be/src/tests/quest.test.ts`
- `bofitxp-fe/src/hooks/use-finished-quest.ts`
- `bofitxp-fe/src/components/CustomToastManager.tsx`

### 4. Frontend toast infrastructure

- `CustomToastProvider` sudah dipakai untuk toast global
- `custom-animated-toast.tsx` sudah ada untuk visual toast animasi
- manager global sudah terpasang di root layout
- toast sekarang dipakai untuk event streak/challenge completion

Bukti utama:

- `bofitxp-fe/src/context/CostumToastProvider.tsx`
- `bofitxp-fe/src/components/custom-animated-toast.tsx`
- `bofitxp-fe/src/components/CustomToastManager.tsx`
- `bofitxp-fe/src/app/_layout.tsx`

## Fitur yang sudah selesai dan terverifikasi (source + test terfokus)

- basic auth: implemented
- logout: implemented in frontend flow
- logout on expired JWT: fixed and verified in frontend session logic
- register + verification email: implemented
- BMI edit: implemented
- daily/weekly/special quest generation: implemented
- checked quest completion: implemented
- XP/level progression: implemented
- custom toast infrastructure: implemented
- streak business logic: implemented
- challenge event logic: implemented

## Perubahan terbaru yang sudah diverifikasi

### Expired JWT / automatic logout fix

Masalah yang ditemukan:
- frontend mengecek `expiresIn` padahal JWT standard punya `exp`
- storage cleanup memakai `localStorage` padahal project memakai `expo-secure-store`
- auth state tidak dibersihkan sepenuhnya saat token invalid/expired

Perbaikan yang sudah dibuat:
- validasi expiry memakai klaim JWT yang benar di `jwtDecode<JWTDecode>(token).exp`
- expired token diproses sebagai sesi tidak valid dan otomatis logout
- `SecureStore.deleteItemAsync("user_token")` dipakai untuk membersihkan session
- `authUser` di-reset ke `null` saat token expired atau tidak valid

Bukti utama:
- `bofitxp-fe/src/context/AuthContext.tsx`

Status:
- masalah login/expired-token yang teridentifikasi sudah diperbaiki
- file auth context tidak menunjukkan error pada pemeriksaan file yang relevan

## Fitur yang masih perlu diverifikasi manual / black-box

- runtime UI tiap screen di mobile app
- flow end-to-end antar layar dan API real
- edge-case produk seperti streak reset, repeated completion, quest duplication, threshold challenge yang dirasa terlalu agresif/terlalu longgar
- cover fitur tunggal per domain pada device nyata

## Bukti testing yang ada

File test yang diketahui:

- `bofitxp-be/src/tests/auth.test.ts`
- `bofitxp-be/src/tests/quest.test.ts`

Test yang sudah dibuktikan via `npm test -- --runInBand src/tests/quest.test.ts`:

- combo streak x2 aktif setelah 3 daily quest berturut-turut
- challenge boost x3 aktif untuk quest yang melebihi kemampuan user

Catatan:

- test auth dan test quest dipisah per domain fitur agar coverage lebih jelas
- runtime manual FE / device testing masih menjadi tugas black-box pengguna

## Status umum

Status paling akurat saat ini:

- basic auth: implemented
- logout: implemented
- register + verification: implemented
- user profile/BMI: implemented
- daily/weekly/special quest generation: implemented
- checked quest completion: implemented
- XP/level progression: implemented
- toast infrastructure: implemented
- streak/challenge logic: implemented
- full product verification on device: belum selesai, ditugaskan ke testing manual user

## Kesimpulan

Fitur utama BoFitXP sudah terbentuk dengan bukti konkret di source code dan test yang terfokus. Logika streak dan challenge secara teknis sudah ada dan terhubung ke toast UI. Verifikasi real-device / black-box masih diperlukan untuk menutup gap end-to-end di layer mobile app.
