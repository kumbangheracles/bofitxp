# API.md

Dibuat berdasarkan `bofitxp-be/src/routes/api.ts`, controller, service, dan middleware yang terlihat pada 2026-10-19.

## 1. Base path

Semua endpoint backend berada di bawah:

- `/api`

## 2. Auth endpoints

### `POST /api/auth/register`

Didefinisikan di `authController.register`.

Fungsi:

- registrasi user baru
- membuat activation code
- mengirim email verifikasi

Bukti dari service:

- `AuthService.register` membuat user dengan `activationCode`
- mengirim email `Account Verificaton`

### `POST /api/auth/login`

Fungsi:

- validasi email/password
- mengembalikan JWT jika sukses

Response terdeteksi dari test:

- status `200` jika login sukses
- body: `{ message: "Login success", data: "<token>" }`

### `POST /api/auth/activation`

Fungsi:

- validasi activation code
- menandai user `isVerified = true`
- menghapus `activationCode` dan `expireAt`

### `POST /api/auth/resend-activation`

Fungsi:

- generate activation code baru
- kirim ulang email aktivasi

### `GET /api/auth/me`

Proteksi:

- harus lewat middleware auth

Fungsionalitas:

- `authMiddleware` memvalidasi bearer token
- controller `me` dipanggil setelah validasi

## 3. User endpoints

### `PATCH /api/user-update`

Protected route.

Fungsionalitas:

- update data profile user
- dijalankan setelah token valid

## 4. Quest endpoints

### `POST /api/user-quests/generate`

Protected route.

Fungsi:

- generate quests baru berdasarkan profil user dan AI
- memasukkan data ke model `Quests` dan `UserQuest`

Bukti dari `UserQuestService`: quest generation mempertimbangkan:

- `fullName`, `level`, `xp`, `weight`, `height`, `BMI`, `target_final`
- `quest_category`
- `difficulty`
- Groq dan schema JSON response

### `GET /api/user-quests`

Protected route.

Fungsi:

- mengambil daftar quest user

### `PATCH /api/user-quests/:userQuestId/:questId`

Protected route.

Fungsi:

- menandai quest selesai (`is_finished`)
- menyimpan `finishedAt`

## 5. Auth middleware behavior

Dari `bofitxp-be/src/middlewares/auth.middleware.ts`:

- jika tidak ada header `Authorization`: response `403` dengan `{ message: "unauthorized", data: null }`
- jika format header bukan `Bearer <token>`: response `403`
- jika token tidak valid: response `403`

## 6. Response pattern umum

Berdasarkan source code dan test, pola response yang terlihat adalah:

```json
{
  "message": "...",
  "data": {...} || null || "<token>"
}
```

## 7. Catatan implementasi yang perlu dikonfirmasi

- `authController.me` belum dipelajari lebih lanjut untuk perilaku exact response
- `userController.updateUser` belum dibaca secara rinci dalam audit ini
- `AuthService.me` masih kosong; perlu diperiksa apakah fungsi ini sengaja dibiar placeholder atau belum selesai
- `AuthService` menandai beberapa error sebagai `Error("User not found")` walau konteksnya tidak selalu user absent

## 8. Kesimpulan

API backend saat ini setidaknya sudah memiliki skeleton autentikasi, user management, dan quest flow yang core. Rute utama relevan sudah dapat diidentifikasi dan dapat dijadikan dasar untuk dokumentasi lanjutan serta pengujian regresi.
