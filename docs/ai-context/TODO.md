# TODO.md

Daftar TODO yang muncul dari audit source code dan status repo saat ini.

## Prioritas tinggi

- [x] Verifikasi logika quest, streak, dan challenge di backend
- [x] Menghubungkan event streak/challenge ke custom toast di frontend
- [x] Memisahkan test per domain fitur (`auth`, `quest`, dan lain-lain)
- [x] Membuat flow edit informasi user per row dengan modal dinamis dan integrasi API update-user
- [x] Tambahkan guard OTP abuse berbasis Redis dengan rate limit IP, cooldown email, daily cap, dan fail-closed saat Redis gagal
- [ ] Lakukan black-box testing manual pada fitur yang sudah dibuat di device/simulator aplikasi mobile
- [ ] Review controller/service `userController` dan `userQuestController` untuk konsistensi response dan edge case tambahan
- [ ] Verifikasi flow lengkap resend OTP terhadap endpoint dan controller konkret saat runtime Vercel/Upstash aktif

## Prioritas menengah

- [ ] Konfirmasi `user-quests` flow end-to-end: generate, list, finish, reward, dan persist ke database pada runtime nyata
- [ ] Audit validasi input di FE dan BE agar format payload konsisten
- [ ] Review apakah `DATABASE_URL`, `SECRET`, `EMAIL_SMTP_USER`, dan `GROQ_API_KEY` sudah ditetapkan di environment yang benar
- [ ] Verifikasi kalau semua route frontend benar-benar terhubung dengan API backend di runtime app
- [ ] Identifikasi apakah `mahasiswa.validation.ts` masih relevan atau merupakan sisa code legacy

## Prioritas rendah

- [ ] Periksa apakah ada fitur legacy yang bisa dihapus atau dipindahkan ke dokumentasi
- [ ] Dokumentasikan arsitektur rute FE secara lebih rinci untuk screen dan flow user
- [ ] Tambahkan catatan real-world testing untuk login, activation code, quest generation, streak, challenge, dan role user
- [ ] Tulis status feature per modul agar AI context lebih akurat untuk sesi berikutnya

## Catatan status

- backend core: ada dan sudah terverifikasi lewat source code dan test terfokus
- frontend core: ada dan sudah terhubung ke event toast
- integration antara FE dan BE: sebagian terverifikasi via logic, tapi runtime manual perlu validasi user
- docs AI context: sudah diperbarui sesuai status yang saat ini dapat dibuktikan

## Catatan penting

Dokumen ini harus terus diperbarui saat implementasi baru ditambahkan atau ketika status fitur berubah. Saat ini, pengujian black-box manual di aplikasi mobile diserahkan ke pengguna sebagai bagian dari verifikasi fisik tiap fitur.
