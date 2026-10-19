# DECISIONS.md

Catatan keputusan desain yang didasarkan pada sumber kode yang terlihat sampai 2026-10-19.

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
- `AuthService.activationCode` mengaktifkan akun

## 6. State auth di FE disimpan secara lokal dan dikontrol via context

Bukti:

- `AuthContext` menyimpan token di Secure Store
- token expiry dicek tiap 30 detik
- `login` dan `logout` hanya menangani state lokal untuk sesi

## 7. Validasi request ditaruh di layer validation

Bukti:

- `src/validation/auth.validation.ts` dan `user.validation.ts` serta `mahasiswa.validation.ts`

Keputusan ini menjaga agar controller/service tidak menerima payload mentah tanpa guard.

## 8. Catatan keputusan untuk masa depan

Belum ada bukti final bahwa keputusan berikut sudah disetujui dalam implementasi lengkap:

- apakah semua API response harus standard `message + data`
- apakah quest generation harus selalu AI-based atau ada fallback lokal
- apakah fitur user quest generation akan selalu dipicu manual atau otomatis saat login/refresh

## 9. Kesimpulan

Keputusan arsitektur yang terlihat adalah pendekatan yang masuk akal untuk MVP gamified fitness app: auth JWT, MongoDB, AI quest generation di backend, dan mobile-first frontend. Namun, keputusan yang lebih lanjut perlu dikonfirmasi lewat pengujian runtime dan review domain flow yang lebih luas.
