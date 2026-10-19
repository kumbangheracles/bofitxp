# TODO.md

Daftar TODO yang muncul dari audit source code dan status repo saat ini.

## Prioritas tinggi

- [ ] Verifikasi apakah `AGENTS.md` yang dihapus memang perubahan user atau artefak tidak sengaja
- [ ] Cek apakah `.github/copilot-instructions.md` masih konsisten dengan kebutuhan repo dan tidak bertentangan dengan dokumen AI context
- [ ] Review `AuthService.me` karena saat ini terlihat belum diimplementasikan
- [ ] Review controller/service `userController` dan `userQuestController` untuk konsistensi response dan edge case
- [ ] Jalankan build/test relevant untuk backend (`npm test`, `npm run build`) dan frontend (`npx expo lint` bila diperlukan)

## Prioritas menengah

- [ ] Konfirmasi `user-quests` flow end-to-end: generate, list, finish, reward, dan persist ke database
- [ ] Audit validasi input di FE dan BE agar format payload konsisten
- [ ] Review apakah `DATABASE_URL`, `SECRET`, `EMAIL_SMTP_USER` sudah ditetapkan di environment yang benar
- [ ] Verifikasi kalau semua route frontend benar-benar terhubung dengan API backend
- [ ] Identifikasi apakah `mahasiswa.validation.ts` masih relevan atau merupakan sisa code legacy

## Prioritas rendah

- [ ] Periksa apakah ada fitur legacy yang bisa dihapus atau dipindahkan ke dokumentasi
- [ ] Dokumentasikan arsitektur rute FE secara lebih rinci untuk screen dan flow user
- [ ] Tambahkan catatan real-world testing untuk login, activation code, quest generation, dan role user
- [ ] Tulis status feature per modul agar AI context lebih akurat untuk sesi berikutnya

## Catatan status

- backend core: ada
- frontend core: ada
- integration antara FE dan BE: perlu verifikasi runtime
- docs AI context: initialized and needs validation by maintainer

## Catatan penting

Dokumen ini harus terus diperbarui saat implementasi baru ditambahkan atau ketika status fitur berubah. Jangan menganggap TODO ini final sampai reviewer menyetujui status aktual repo.
