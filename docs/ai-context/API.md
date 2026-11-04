# API.md

Dibuat dan diperbarui berdasarkan route, controller, dan service yang terlihat aktif pada 2026-10-20.

## 1. Base path

Semua endpoint backend berada di bawah:

- `/api`

## 2. Auth endpoints

### `POST /api/auth/register`

Fungsi:

- registrasi user baru
- membuat activation code
- mengirim email aktivasi

### `POST /api/auth/login`

Fungsi:

- validasi email/password
- mengembalikan JWT jika sukses

### `POST /api/auth/activation`

Fungsi:

- validasi activation code
- menandai user `isVerified = true`

### `POST /api/auth/resend-activation`

Fungsi:

- generate activation code baru
- kirim ulang email aktivasi

### `GET /api/auth/me`

Proteksi:

- harus lewat middleware auth

## 3. User endpoints

### `PATCH /api/user-update`

Protected route.

Fungsionalitas:

- update data profil user
- update BMI + data personal lainnya

## 4. Quest endpoints

### `POST /api/user-quests/generate`

Protected route.

Fungsi:

- generate quest baru berdasarkan profil user dan AI
- memasukkan data ke model `Quests` dan `UserQuest`

### `GET /api/user-quests`

Protected route.

Fungsi:

- mengambil daftar quest user

### `PATCH /api/user-quests/:userQuestId/:questId`

Protected route.

Fungsi:

- menandai quest selesai (`is_finished = true`)
- menyimpan `finishedAt`
- menghitung reward XP, level, event combo/challenge

## 5. Quest completion response contract

Saat quest selesai, service mengembalikan payload yang mencakup:

- `quest`
- `xp`
- `streak`
- `challenge`
- `event`

`event` berisi:

```json
{
  "streak": {
    "triggered": true,
    "currentCombo": 3,
    "threshold": 3,
    "multiplier": 2,
    "resetsIn24Hours": true
  },
  "challenge": {
    "triggered": true,
    "multiplier": 3,
    "reason": "hard quest beyond user capability"
  },
  "toast": {
    "title": "🔥 Combo Streak x2",
    "subtitle": "3 quest daily berturut-turut aktif • bonus +2x",
    "type": "success"
  }
}
```

Ini adalah payload yang dipakai frontend untuk menampilkan toast khusus.

## 6. Auth middleware behavior

Dari `bofitxp-be/src/middlewares/auth.middleware.ts`:

- jika tidak ada header `Authorization`: response `403`
- jika format header bukan `Bearer <token>`: response `403`
- jika token tidak valid: response `403`

## 7. Response pattern umum

Berdasarkan source code dan test, pola response yang terlihat adalah:

```json
{
  "message": "...",
  "data": {...} || null || "<token>"
}
```

## 8. Catatan implementasi yang perlu diperhatikan

- `AuthService.me` masih perlu diperiksa lebih lanjut jika ada kebutuhan untuk response endpoint me yang lebih rinci
- status route dan controller harus tetap diverifikasi saat runtime manual testing dilakukan
- end-to-end FE/BE perlu black-box testing pada screen dan alur quest yang nyata

## 9. Kesimpulan

API backend saat ini sudah memiliki skeleton autentikasi, user management, dan quest flow yang core. Logika quest completion juga sudah menjadi lebih lengkap karena mencakup XP, level, streak, dan challenge event. Rute utama relevan sudah cukup jelas untuk pengembangan lanjutan dan pengujian regresi.
