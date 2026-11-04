# CI/CD.md

## Ringkasan hasil audit

Workflow backend asli di `bofitxp-be/.github/workflow/ci-cd.yaml` belum valid untuk GitHub Actions karena:

- GitHub hanya membaca workflow yang berada di `.github/workflows/` di root repository, bukan di subfolder aplikasi.
- repository ini adalah monorepo, jadi backend berada di `bofitxp-be/` dan membutuhkan `working-directory` agar `npm ci`, `prisma generate`, test, dan build berjalan dari folder yang benar.
- backend memakai Prisma dengan MongoDB, sehingga CI harus menyediakan container MongoDB dan `DATABASE_URL` yang valid untuk test.
- deploy ke Vercel untuk backend harus diarahkan ke subfolder `./bofitxp-be` agar project yang dipublish sesuai dengan app backend, bukan repo root.

## Arsitektur CI/CD yang benar

Alur yang dipakai saat ini adalah:

1. Trigger
   - `push` ke branch `main`
   - `pull_request` ke branch `main`
   - `workflow_dispatch` untuk eksekusi manual

2. Job `test-and-build`
   - checkout repo
   - setup Node.js 20
   - install dependency backend menggunakan `npm ci` di `bofitxp-be`
   - generate Prisma client agar schema MongoDB bisa dibangun sesuai dengan Prisma client
   - menjalankan test Jest di backend
   - menjalankan build TypeScript untuk memastikan aplikasi compile

3. Job `deploy`
   - dijalankan hanya saat event `push` ke `main`
   - menunggu `test-and-build` selesai dengan status sukses
   - deploy ke Vercel menggunakan secret `VERCEL_TOKEN`, `VERCEL_ORG_ID`, dan `VERCEL_PROJECT_ID`

## Variabel dan service yang dibutuhkan dalam CI

Variabel environment yang relevan untuk backend saat test:

- `DATABASE_URL` -> MongoDB test instance untuk Prisma
- `SECRET` -> JWT signing secret
- `PORT` -> port server lokal untuk runtime test
- `OTP_RATE_LIMIT_SECRET` -> secret untuk guard OTP rate limit
- `GROQ_API_KEY` -> dummy test key pada CI agar code yang memanggil Groq tidak gagal saat unit test

Service yang dipakai:

- MongoDB container via `mongo:7`
- port `27017` dipetakan ke host runner untuk simulasi database lokal

## Workflow yang aktif

Workflow aktif berada di:

- `.github/workflows/backend-ci-cd.yml`

Sedangkan file lama di `bofitxp-be/.github/workflow/ci-cd.yaml` berfungsi sebagai referensi lokal dan belum akan dipakai oleh GitHub karena lokasi foldernya tidak sesuai.

## Flow deploy backend ke Vercel

Deploy backend menggunakan Vercel action dengan konfigurasi:

- `working-directory: ./bofitxp-be`
- `vercel-org-id`, `vercel-project-id`, dan `vercel-token` dari secret GitHub
- penerapan hanya terjadi di branch `main` untuk mencegah deploy saat PR masih dalam review

## Keputusan serta risiko

- Workflow ini sudah dibuat agar sesuai dengan struktur monorepo dan backend service yang benar.
- Kualitas pipeline bergantung pada secret GitHub yang benar di repository.
- Jika project Vercel backend dibuat terpisah dari repo root, `vercel-project-id` harus mengarah ke project backend yang benar.
- Jika backend mulai menambah dependency baru atau environment baru, workflow perlu disesuaikan agar env CI mencerminkan kebutuhan runtime.

## Verifikasi yang disarankan setelah push

Setelah file workflow aktif di GitHub, verifikasi yang paling relevan adalah:

1. cek tab Actions di GitHub
2. pastikan job `test-and-build` sukses
3. pastikan build TypeScript selesai tanpa error
4. pastikan step deploy hanya berjalan pada `push` ke `main`
5. cek Vercel untuk project backend yang dipublikasikan
