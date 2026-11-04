# GitHub Actions CI/CD Learn Notes

## 1. GitHub Actions job bukan hanya untuk test

Workflow di GitHub Actions bisa berisi beberapa job, dan masing-masing job bisa menjalankan langkah yang berbeda:

- `test` untuk menjalankan unit/integration test
- `build` untuk compile project
- `lint` untuk pengecekan kualitas kode
- `deploy` untuk mengirim aplikasi ke environment tujuan

Artinya, job di GitHub Actions tidak selalu hanya untuk test. Ia bisa mencakup CI dan CD secara bersamaan.

## 2. CI vs CD

### CI (Continuous Integration)
Tujuan utama:

- install dependency
- generate artifact yang dibutuhkan
- run test
- build project
- memastikan kode siap untuk lanjut ke tahap berikutnya

### CD (Continuous Deployment / Delivery)
Tujuan utama:

- mengirim hasil build ke environment production atau staging
- biasanya berjalan setelah CI sukses
- sering memakai `needs: test-and-build` agar deployment hanya terjadi jika validasi dulu berhasil

## 3. Contoh pada project BoFitXP backend

File workflow utama:

- `.github/workflows/backend-ci-cd.yml`

Workflow ini memiliki dua job:

### Job 1: `test-and-build`
Langkahnya:

1. checkout repo
2. setup Node.js
3. install dependencies dengan `npm ci`
4. generate Prisma client
5. run Jest tests
6. build TypeScript project

Tujuan job ini adalah CI.

### Job 2: `deploy`
Langkahnya:

1. menunggu job `test-and-build` selesai
2. cek kondisi `push` ke branch `main`
3. deploy backend ke Vercel

Tujuan job ini adalah CD.

## 4. `npm ci` error dan artinya

Jika workflow gagal di step `Install dependencies`, itu berarti masalah dependency install, bukan bug aplikasi.

Contoh error yang umum:

- package.json dan package-lock.json tidak sinkron
- lockfile stale
- missing transitive dependency seperti `@emnapi/core` dan `@emnapi/runtime`

Pada kasus ini, solve-nya adalah:

- jalankan `npm install` di project directory
- komit update package-lock.json
- then push ulang ke GitHub

Karena `npm ci` membutuhkan lockfile yang benar-benar sinkron.

## 5. Pentingnya memahami konteks repository

Project BoFitXP terdiri dari beberapa bagian:

- backend di `bofitxp-be`
- frontend mobile di `bofitxp-fe`
- root repo memegang keduanya

Namun deployment bisa terpisah per project. Jadi repo bisa satu, tetapi tiap app bisa di-deploy secara terpisah. Ini berbeda dengan asumsi bahwa folder terpisah berarti otomatis “monorepo” atau “polyrepo” semata-mata.

Yang paling penting di GitHub Actions adalah:

- workflow ditempatkan di root `.github/workflows`
- command dijalankan di folder yang tepat dengan `working-directory` atau `cd`
- layer deploy diarahkan ke project yang benar

## 6. Kesimpulan

GitHub Actions job bukan hanya untuk test. Ia bisa mencakup:

- CI
- CD
- bahkan keduanya dalam satu workflow

Untuk backend BoFitXP, workflow utama memang berfungsi sebagai CI/CD pipeline, bukan hanya test runner.
