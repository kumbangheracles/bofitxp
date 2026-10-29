Saya ingin menyiapkan persistent AI development context untuk repository BoFitXP agar development bisa dilanjutkan lintas chat, lintas sesi, dan lintas model GitHub Copilot tanpa kehilangan pemahaman proyek.

Repository ini memiliki frontend dan backend terpisah. Jangan berasumsi dokumentasi atau implementasi yang ada masih akurat sebelum memeriksa source code.

## Phase 1 — Repository Audit

1. Periksa struktur repository, package.json, konfigurasi, source code, route, controller, service, middleware, Prisma schema, dan konfigurasi testing yang relevan.
2. Periksa git status dan perubahan yang belum di-commit. Jangan mengubah atau menghapus perubahan pengguna.
3. Identifikasi arsitektur frontend-backend, autentikasi, API flow, database, validasi, error handling, dan aturan bisnis.
4. Identifikasi fitur yang sudah selesai, parsial, bermasalah, atau belum diimplementasikan. Gunakan bukti dari source code dan test, bukan asumsi.
5. Jangan membaca atau menyalin nilai rahasia dari file .env. Catat hanya nama variabel dan tujuannya bila diperlukan.

## Phase 2 — Persistent Documentation

Buat atau perbarui dokumen berikut:

- docs/ai-context/PROJECT.md
- docs/ai-context/ARCHITECTURE.md
- docs/ai-context/DATABASE.md
- docs/ai-context/API.md
- docs/ai-context/PROGRESS.md
- docs/ai-context/DECISIONS.md
- docs/ai-context/TODO.md

Buat juga atau perbarui .github/copilot-instructions.md agar Copilot selalu:

- Memeriksa dokumentasi dan source code sebelum melakukan perubahan signifikan.
- Mengikuti pola coding yang sudah digunakan.
- Menjaga kompatibilitas frontend, backend, dan database.
- Memegang prinsip clean code: Separation of Concerns, Single Responsibility Principle, dan layered architecture.
- Menjaga pemisahan tanggung jawab: controller hanya menangani HTTP/response, service menangani business logic, validation terpisah, dan data access di layer yang tepat.
- Menjalankan pemeriksaan yang relevan setelah perubahan.
- Memperbarui dokumentasi saat implementasi atau keputusan berubah.
- Melaporkan file yang berubah, hasil verifikasi, risiko, dan pekerjaan lanjutan.

## Phase 3 — Quality Control

1. Pastikan tidak ada klaim yang tidak didukung source code.
2. Bedakan implementasi aktual dengan rencana atau target masa depan.
3. Tandai informasi yang belum dapat diverifikasi.
4. Hindari duplikasi dokumentasi dan instruksi yang bertentangan.
5. Jangan melakukan refactor, mengubah schema, menginstal dependency, atau membuat commit dalam proses ini.
6. Untuk testing, tiap fitur atau domain fungsional harus dibuat file test tersendiri sesuai domain-nya, misalnya:
   - `auth.test.ts` untuk login/register/activation
   - `quest.test.ts` untuk quest generation, streak, challenge, completion
   - `user.test.ts` untuk profil, BMI, update user
   - `integration` atau `e2e` hanya jika memang dibutuhkan untuk alur lintas fitur
7. Jangan mencampur test auth dengan test quest atau user dalam satu file karena akan mengurangi fokus, debugging, dan maintainability.

## Final Report

Laporkan struktur dokumentasi yang dibuat, ringkasan arsitektur yang ditemukan, status fitur yang bisa diverifikasi, pertanyaan yang belum terjawab, dan cara memverifikasi bahwa instruksi Copilot aktif pada chat baru.
