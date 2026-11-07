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
- profile edit flow for user fields including gender/age/target final: implemented in FE and wired to backend update-user API
- daily/weekly/special quest generation: implemented
- checked quest completion: implemented
- XP/level progression: implemented
- custom toast infrastructure: implemented
- streak business logic: implemented
- challenge event logic: implemented
- dark/light mode toggle via home header and account menu: implemented

## Perkembangan terbaru: theme system + home control

Tanggal: 2026-10-21

### Update UI yang sudah diverifikasi

- tema app sudah konsisten menggunakan token `darkTheme` / `lightTheme` di `bofitxp-fe/src/constants/theme.ts`
- pengaturan mode sekarang bisa di-trigger dari screen account dan dari home header agar user tidak perlu masuk ke settings
- tombol mode di header home ditempatkan di sisi kiri ikon bell dan menggunakan ikon `weather-sunny`/`weather-night` sesuai mode aktif
- `Appearance.setColorScheme(...)` dipakai untuk memicu perubahan tema global realtime

### Bukti utama

- `bofitxp-fe/src/constants/theme.ts`
- `bofitxp-fe/src/components/Account/index.tsx`
- `bofitxp-fe/src/app/private/(tabs)/home.tsx`

Status:

- theme toggle functional pada aplikasi frontend sudah terintegrasi
- validasi TypeScript akhir pada frontend juga telah berjalan tanpa error

## Perubahan terbaru yang sudah diverifikasi

### OTP abuse guard with Redis and fail-closed semantics

Masalah yang ditemukan:

- endpoint pengiriman kode OTP belum memiliki pembatasan rate limit yang konsisten di level IP dan email
- tidak ada mekanisme fail-closed saat Redis tidak tersedia
- request email publik bisa menembus spam/perulangan tanpa pembatasan distribusi serverless

Perbaikan yang sudah dibuat:

- dibuat utilitas pusat `otpGuard.ts` untuk normalisasi email, hashing email dengan HMAC-SHA256, IP extraction aman, dan konfigurasi limit OTP
- dibuat middleware `otpRateLimit.middleware.ts` untuk membatasi IP pada `5 request / 15 menit` dan mengembalikan `429` serta `Retry-After`
- dibuat reservation email dengan cooldown 60 detik dan quota rolling 24 jam sebanyak 10 request per email, menggunakan script Redis atomik
- service `UserService.sendOtpConfirmationCode()` memanggil reservation email sebelum mencari user dan sebelum mengirim email
- error `AppRateLimitError` dan `AppDependencyError` diarahkan ke response HTTP `429` dan `503` sesuai pola fail-closed
- semua secret dan OTP tidak di-log; key Redis hanya memakai hash email + namespace

Bukti utama:

- `bofitxp-be/src/utils/otpGuard.ts`
- `bofitxp-be/src/middlewares/otpRateLimit.middleware.ts`
- `bofitxp-be/src/services/user.service.ts`
- `bofitxp-be/src/routes/api.ts`
- `bofitxp-be/src/tests/otp-guard.test.ts`

Status:

- guard OTP dasar sudah masuk ke codebase dan sesuai with project requirement
- verifikasi automated testing fokus : utilitas guard OTP lulus
- build normal repo masih memunculkan issue lingkungan/Prisma (izin rename generated file) dan bukan sekadar bug patch OTP

### User profile edit integration via modal row action

Masalah yang ditemukan:

- screen edit informasi masih placeholder static
- field profil seperti gender, age, target final belum masuk ke flow update user
- backend update endpoint sudah ada, tetapi FE belum terhubung ke field dinamis per-row

Perbaikan yang sudah dibuat:

- list informasi pada screen edit dibuat dengan card style yang konsisten dengan menu akun
- tiap row bisa dibuka ke modal `AppModal`
- modal menampilkan form yang disesuaikan berdasarkan field yang dipilih
- field `gender`, `age`, `target_final` ditambahkan ke validasi dan tipe frontend
- hasil update disimpan ke `authUser` dan dikirim ke API `PATCH /user-update`

Bukti utama:

- `bofitxp-fe/src/components/Account/EditInformations/index.tsx`
- `bofitxp-fe/src/hooks/use-update-user.ts`
- `bofitxp-fe/src/utils/validation/user.validation.ts`
- `bofitxp-be/src/routes/api.ts`

Status:

- profile edit modal flow untuk row data user sudah masuk ke source code
- verifikasi runtime real-device manual masih belum dilakukan

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

## Perubahan terbaru yang sudah diverifikasi (2026-11-04): CI/CD workflow cleanup dan root cause runtime Vercel

Masalah yang ditemukan:

- workflow GitHub Actions dibuat duplikat di subfolder backend dan di root repository, sehingga struktur repo menjadi membingungkan
- GitHub hanya akan membaca workflow yang ada di root `.github/workflows`, bukan di folder aplikasi
- project backend dan frontend dipisah secara deployment, tetapi repository masih tetap satu source of truth untuk development dan CI/CD
- log runtime Vercel menunjukkan crash pada module Groq karena `GROQ_API_KEY` tidak tersedia di environment produksi

Perbaikan yang sudah dibuat:

- workflow aktif dipastikan berada di root repo: `.github/workflows/backend-ci-cd.yml`
- file workflow duplikat di `bofitxp-be/.github/workflow/` dibersihkan agar tidak ada konflik konfigurasi
- konfigurasi Jest dibuat eksplisit agar tidak memuat konfigurasi ganda serial `.js` dan `.ts`
- dokumentasi CI/CD dibuat di `docs/ai-context/CI-CD.md` agar alur test dan deploy dijelaskan secara eksplisit untuk sesi berikutnya
- inisialisasi Groq dibuat lazy agar server tidak crash saat key belum ada; error sekarang muncul hanya saat AI quest generation dipanggil dan key belum dikonfigurasi

Status:

- struktur workflow sudah konsisten dan hanya tersisa satu workflow utama yang valid
- validasi backend terhadap test suite dan build masih perlu dibedakan antara environment lokal Windows dan runner Ubuntu GitHub Actions

## Perubahan terbaru yang sudah diverifikasi (2026-11-07): AI Coach UI + routing + persistence flow

Fitur yang sudah ditambahkan dan diverifikasi dari source code:

- backend AI Coach sudah memiliki model `AiCoachSession`, `AiCoachMessage`, dan `AiCoachReminder` di `bofitxp-be/prisma/schema.prisma`
- flow chat dan reminder sudah dipisahkan dari business logic quest, dengan service layer yang fokus pada AI coaching dan reminder deduplication
- endpoint backend untuk session, message, dan reminder proses sudah terdaftar di `bofitxp-be/src/routes/api.ts`
- frontend memiliki hook `use-ai-coach.ts` dan service `aiCoach.service.ts` untuk mengakses session dan message dari API
- home screen menambahkan tombol `Open AI Coach` yang mengarah ke route `/private/ai-coach`
- screen chat AI Coach sudah dibuat dengan premium styling: gradient hero, avatar AI, tab sesi, bubble chat, input composer, dan indikator typing

Bukti utama:

- `bofitxp-be/src/services/aiCoach.service.ts`
- `bofitxp-be/src/controllers/aiCoach.controller.ts`
- `bofitxp-be/src/jobs/aiCoachReminder.job.ts`
- `bofitxp-fe/src/hooks/use-ai-coach.ts`
- `bofitxp-fe/src/services/aiCoach.service.ts`
- `bofitxp-fe/src/app/private/ai-coach.tsx`
- `bofitxp-fe/src/app/private/(tabs)/home.tsx`

Status:

- AI coach flow dari backend sampai frontend sudah masuk ke codebase dan terhubung
- validasi TypeScript frontend terbaru berhasil dijalankan tanpa error
- uji runtime actual di device/simulator masih perlu dilakukan untuk memastikan session creation, message send, dan reminder delivery berjalan di kondisi nyata
- pengiriman reminder push/notification production masih belum menjadi bagian dari scope saat ini dan perlu dipertimbangkan pada fase selanjutnya
- masalah aktif di Vercel adalah konfigurasi environment produksi, bukan pipeline CI/CD itu sendiri

## Perubahan terbaru yang sudah diverifikasi (2026-10-28): Swagger docs sectioning per domain

Masalah yang ditemukan:

- dokumentasi Swagger masih tersebar tanpa pemisahan domain yang jelas
- endpoint auth, user, dan user quests belum konsisten dalam label section di UI Swagger
- perubahan endpoint baru berisiko tidak tercatat saat pengembangan lanjutan

Perbaikan yang sudah dibuat:

- label Swagger dibagi per section: `Auth`, `User`, dan `User Quests`
- route yang relevan ditandai dengan `#swagger.tags` agar tampil sebagai kelompok terpisah di Swagger UI
- dokumentasi endpoint diperbarui dan di-generate ulang ke `bofitxp-be/src/docs/swagger_output.json`
- test coverage tambahan dibuat agar semua endpoint wajib ada di docs agar tidak regress ke belakang

Bukti utama:

- `bofitxp-be/src/routes/api.ts`
- `bofitxp-be/src/docs/swagger.ts`
- `bofitxp-be/src/docs/swagger_output.json`
- `bofitxp-be/src/tests/swagger-docs.test.ts`

Status:

- pola dokumentasi per domain sekarang sudah konsisten untuk auth, user, dan user quests
- langkah berikutnya adalah menjaga pola yang sama untuk endpoint baru agar dokumentasi tetap sinkron dengan source code

## Perubahan terbaru yang sudah diverifikasi (2026-10-28): Swagger grouping fix verified on localhost

Masalah yang ditemukan:

- hasil generate Swagger sebelumnya masih menempatkan semua endpoint ke section `default` karena tag tidak diterapkan secara konsisten pada output JSON
- endpoint yang memiliki prefix `/auth`, `/user`, dan `/user-quests` belum dibagi ke section yang benar di UI Swagger

Perbaikan yang sudah dibuat:

- generator Swagger di `bofitxp-be/src/docs/swagger.ts` diperbarui dengan `tags` global dan override `operation.tags` per route berdasarkan prefix endpoint
- output JSON dire-generate ke `bofitxp-be/src/docs/swagger_output.json` agar UI menampilkan section terpisah: Auth, User, dan User Quests
- dilakukan validasi langsung terhadap file JSON untuk memastikan route `/auth/register`, `/user/send-otp-confirmation-code`, dan `/user-quests` masuk ke tag yang sesuai
- test coverage endpoint Swagger dijalankan dan lulus untuk memastikan dokumentasi tetap memuat semua path yang ada

Bukti utama:

- `bofitxp-be/src/docs/swagger.ts`
- `bofitxp-be/src/docs/swagger_output.json`
- `bofitxp-be/src/tests/swagger-docs.test.ts`

Status:

- grouping section Swagger di localhost berhasil diperbaiki dan sudah diverifikasi
- dokumentasi backend sekarang konsisten untuk pembagian domain Auth, User, dan User Quests

## Perubahan terbaru yang sudah diverifikasi (2026-10-27): secure account update via OTP

Masalah yang ditemukan:

- alur edit email/password masih memakai pattern generic profile update, padahal kebutuhan bisnis menuntut validasi keamanan dan OTP khusus
- form edit email masih bisa lolos input tidak valid
- OTP untuk email baru tidak benar-benar dikirim karena flow hanya menyimpan kode di DB tanpa trigger email
- setelah konfirmasi email berhasil, UI masih menampilkan email lama karena auth state belum di-refresh

Perbaikan yang sudah dibuat:

- dibuat route dan controller terpisah untuk `requestEmailChange`, `confirmEmailChange`, dan `changePassword` di backend
- validasi email dilakukan di frontend sebelum masuk ke OTP: format email, cek apakah email kosong, cek duplikasi, cek apakah email sama dengan current email
- validasi password ditambahkan di modal: current password wajib, password minimal 8 karakter, confirm password wajib dan harus cocok
- OTP verify email memakai UX mirip activation screen dengan pola input 6 digit dan tombol resend
- backend `requestEmailChange()` sekarang memanggil `renderMailHtml` dan `sendMail` untuk mengirim OTP ke email baru
- backend `confirmEmailChange()` menghasilkan token baru dan mengembalikan payload user terbaru agar frontend langsung update `authUser`
- frontend `SendOtpIndex` memanggil `login(nextToken)` dan `setAuthUser(...)` setelah konfirmasi berhasil, sehingga screen edit informasi langsung menampilkan email baru
- back button pada OTP screen sekarang membersihkan state pending dan kembali ke layar sebelumnya

Bukti utama:

- `bofitxp-be/src/controllers/user.controller.ts`
- `bofitxp-be/src/services/user.service.ts`
- `bofitxp-be/src/routes/api.ts`
- `bofitxp-fe/src/components/Account/EditInformations/index.tsx`
- `bofitxp-fe/src/components/Account/SendOtp/index.tsx`
- `bofitxp-fe/src/context/GlobalStateContext.tsx`
- `bofitxp-fe/src/components/app-input.tsx`

Status:

- alur update email dan password dengan OTP telah berjalan sesuai kebutuhan bisnis dan telah diverifikasi melalui regression di backend
- validasi front-end dan back-end untuk email/password sudah masuk ke source code
- smoke test UI real device masih direkomendasikan untuk pengecekan visual akhir dan pengalaman pengguna di perangkat mobile

Bukti testing yang ada:

- `npm test -- --runInBand src/tests/user.test.ts`
- hasil: `Test Suites: 1 passed, 1 total` dan `Tests: 5 passed, 5 total`

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
