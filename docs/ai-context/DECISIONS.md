# DECISIONS.md

Catatan keputusan desain yang didasarkan pada source code yang aktif sampai 2026-10-20.

## 1. Backend dan frontend dipisah secara jelas

Keputusan: repo memisahkan `bofitxp-be` dan `bofitxp-fe`.

Alasan terlihat dari struktur:

- FE memakai Expo React Native
- BE memakai Express TypeScript
- komunikasi via REST API dan JWT

## 2. JWT dipakai untuk auth

Keputusan: token JWT dipakai untuk sesi user.

Bukti:

- `generateToken` di `src/utils/jwt.ts`
- `auth.middleware.ts` memverifikasi header bearer token
- frontend menyimpan token di `expo-secure-store`

## 3. MongoDB dipakai sebagai primary data store

Keputusan: Prisma datasource memakai `mongodb`.

Implikasi:

- ID model memakai `@db.ObjectId`
- relasi antar `Users`, `Quests`, dan `UserQuest` mengikuti pola MongoDB document-based

## 4. AI quest generation dipasang di backend

Keputusan: generation quest tidak dilakukan di frontend.

Bukti:

- `UserQuestService.generateQuestWithAI` di backend
- Groq SDK dipanggil untuk menghasilkan quest berdasarkan profil user
- response dibatasi oleh JSON schema

## 5. Verifikasi email digunakan sebagai gate awal akun

Bukti:

- `activationCode` di pengguna
- `AuthService.register` membuat code dan mengirim email
- activation flow menandai user sebagai verified

## 6. State auth di FE disimpan secara lokal dan dikontrol via context

Bukti:

- `AuthContext` menyimpan token di Secure Store
- token expiry dicek di runtime
- `login` dan `logout` hanya menangani state lokal untuk sesi

## 7. Validasi request ditaruh di layer validation

Bukti:

- `src/validation/auth.validation.ts` dan `user.validation.ts` serta `mahasiswa.validation.ts`

Keputusan ini menjaga agar controller/service tidak menerima payload mentah tanpa guard.

## 8. Streak dan challenge dipandang sebagai event game loop

Keputusan: goal completion tidak hanya menghitung XP, tetapi juga menghasilkan event tambahan saat kombinasi syarat terpenuhi.

Bukti:

- `UserQuestService.resolveQuestEvent()` menilai streak dan challenge
- `finishedQuest()` mengembalikan `event` ke frontend
- `use-finished-quest.ts` memanggil custom toast saat event tersedia

Implikasi:

- reward bukan hanya per-quest biasa
- bonus multiplier dibuat eksplisit untuk syarat tertentu
- daftar event harus tetap mudah di-debug dan di-test per domain

## 9. Manual black-box testing tetap dipisahkan dari verifikasi automated

Keputusan yang dipakai saat ini:

- unit test fokus dipakai untuk logic per domain (auth, quest, streak)
- runtime/device testing tetap ditangani secara manual oleh pengguna untuk validasi UX dan screen flow

## 10. Kesimpulan

Keputusan arsitektur yang terlihat saat ini masuk akal untuk MVP gamified fitness app: auth JWT, MongoDB, AI quest generation di backend, dan mobile-first frontend. Dengan hadirnya logic combo/challenge dan toast event, repo sudah cukup maju untuk kebutuhan gamifikasi inti. Penilaian akhir UX dan end-to-end masih harus ditutup dengan black-box testing manual dari pengguna.
