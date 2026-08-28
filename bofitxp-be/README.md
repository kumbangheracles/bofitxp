# BofitXP Backend

Backend service untuk aplikasi **BofitXP**, dibangun menggunakan **Node.js, Express.js, TypeScript, Prisma, dan MongoDB**.

Backend menggunakan arsitektur modular dengan pemisahan antara konfigurasi aplikasi, HTTP server, routing, controller, service, database access, dan database initialization.

---

## 1. Tech Stack

| Technology  | Purpose                        |
| ----------- | ------------------------------ |
| Node.js     | JavaScript runtime             |
| TypeScript  | Programming language           |
| Express.js  | HTTP server & REST API         |
| Prisma      | Database ORM / database client |
| MongoDB     | Primary database               |
| ts-node-dev | Development server             |
| Jest        | Testing                        |
| Vercel      | Serverless deployment          |

---

# 2. Architecture Design

Secara high-level, sistem menggunakan arsitektur berlapis:

```text
                    ┌──────────────────────┐
                    │       Client         │
                    │ Web / Mobile / etc.  │
                    └──────────┬───────────┘
                               │
                               │ HTTP Request
                               ▼
                    ┌──────────────────────┐
                    │    Express.js App    │
                    │       app.ts         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Routes         │
                    │      /api/...        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Controller       │
                    │ Request / Response   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Service        │
                    │ Business Logic       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Prisma         │
                    │   Prisma Client      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │      Database        │
                    └──────────────────────┘
```

### Request Flow

Request dari client diproses dengan urutan:

```text
Client
  ↓
Express
  ↓
Router
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
MongoDB
```

Setiap layer mempunyai tanggung jawab yang berbeda.

### Express App

`src/app.ts` bertanggung jawab terhadap konfigurasi Express seperti:

* Middleware
* CORS
* Body parser
* Root endpoint
* API routes
* API documentation

`app.ts` **tidak menjalankan `app.listen()`**.

Hal ini memungkinkan Express application digunakan baik oleh traditional Node.js server maupun serverless platform seperti Vercel.

---

# 3. Project Structure

```text
bofitxp-be/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   │
│   ├── app.ts
│   ├── server.ts
│   ├── index.ts
│   ├── setup.ts
│   │
│   ├── controllers/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── jobs/
│   │   └── ttl_init_index.ts
│   │
│   ├── docs/
│   │
│   ├── utils/
│   │   └── prisma.ts
│   │
│   └── generated/
│       └── prisma/
│
├── package.json
├── tsconfig.json
└── vercel.json
```

## Directory Responsibilities

### `src/app.ts`

Konfigurasi utama Express application.

```text
Middleware
Routes
Documentation
Global configuration
```

---

### `src/server.ts`

Entry point untuk menjalankan traditional Node.js server.

```text
server.ts
   ↓
app.listen()
   ↓
HTTP Server
```

Digunakan terutama untuk development dan deployment traditional server seperti VPS, Docker, Railway, atau Render.

---

### `src/index.ts`

Entry point untuk serverless deployment.

```text
Vercel
   ↓
src/index.ts
   ↓
Express app
```

File ini tidak menggunakan `app.listen()` karena lifecycle HTTP request ditangani oleh Vercel.

---

### `src/controllers`

Menangani HTTP layer:

* Request
* Response
* HTTP status
* Validasi input tingkat controller
* Memanggil service

Controller sebaiknya tidak mengandung business logic yang kompleks.

---

### `src/services`

Berisi business logic aplikasi.

Contoh:

```text
UserService
AuthService
ProductService
```

Service berkomunikasi dengan database melalui Prisma.

---

### `src/routes`

Mendefinisikan endpoint API dan menghubungkan endpoint dengan controller.

Contoh:

```text
/api/users
/api/auth
/api/products
```

---

### `src/utils`

Berisi utility dan konfigurasi yang digunakan oleh berbagai bagian aplikasi.

Contohnya Prisma Client:

```text
src/utils/prisma.ts
```

---

### `src/jobs`

Berisi proses yang berkaitan dengan database/system jobs.

Saat ini digunakan untuk konfigurasi MongoDB TTL Index.

---

# 4. Database Architecture

Backend menggunakan:

```text
Prisma
   ↓
MongoDB
```

Konfigurasi database berada pada:

```text
prisma/schema.prisma
```

Datasource:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

Prisma Client diinisialisasi melalui:

```text
src/utils/prisma.ts
```

```ts
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

---

# 5. MongoDB TTL Index

Sistem menggunakan MongoDB TTL Index untuk menghapus data berdasarkan field `expireAt`.

Model `Users` memiliki:

```prisma
expireAt DateTime?
```

TTL Index:

```text
expireAt
    ↓
MongoDB TTL Index
    ↓
Document otomatis dihapus
```

Index dibuat melalui:

```text
src/jobs/ttl_init_index.ts
```

Konfigurasi:

```text
expireAfterSeconds: 0
```

Artinya document akan eligible untuk dihapus ketika waktu pada `expireAt` telah tercapai.

---

# 6. Database Setup

Database initialization dipisahkan dari HTTP server.

```text
src/setup.ts
       │
       ▼
JobService
       │
       ▼
MongoDB
       │
       ▼
TTL Index
```

Setup database dijalankan menggunakan:

```bash
npm run db:setup
```

Proses ini tidak dijalankan pada setiap HTTP request.

---

# 7. Development Workflow

Development menggunakan:

```text
npm run dev
```

Script:

```json
"dev": "ts-node-dev --respawn --transpile-only src/server.ts"
```

Flow:

```text
Developer
    │
    ▼
npm run dev
    │
    ▼
src/server.ts
    │
    ▼
Express app
    │
    ▼
Local HTTP Server
    │
    ▼
Prisma
    │
    ▼
MongoDB
```

`ts-node-dev` akan memonitor perubahan source code dan melakukan restart server secara otomatis.

---

# 8. Initial Development Setup

Setelah project di-clone:

```bash
git clone <repository-url>
cd bofitxp-be
npm install
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Push schema ke MongoDB:

```bash
npm run db:push
```

Setup database dan TTL Index:

```bash
npm run db:setup
```

Jika membutuhkan sample data:

```bash
npm run db:seed
```

Kemudian jalankan development server:

```bash
npm run dev
```

---

# 9. Development Commands

| Command                   | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `npm run dev`             | Menjalankan development server            |
| `npm run prisma:generate` | Generate Prisma Client                    |
| `npm run db:push`         | Sinkronisasi schema Prisma dengan MongoDB |
| `npm run db:setup`        | Setup database / TTL Index                |
| `npm run db:seed`         | Memasukkan sample data                    |
| `npm test`                | Menjalankan test                          |

---

# 10. Production Build

Production build menggunakan TypeScript compiler.

```bash
npm run build
```

Script:

```json
"build": "prisma generate && tsc"
```

Workflow:

```text
Source Code
     │
     ▼
Prisma Generate
     │
     ▼
TypeScript Compiler
     │
     ▼
dist/
```

Setelah build selesai, server traditional dapat dijalankan menggunakan:

```bash
npm start
```

dengan script:

```json
"start": "node dist/server.js"
```

Architecture:

```text
dist/server.js
      │
      ▼
Express
      │
      ▼
Prisma
      │
      ▼
MongoDB
```

---

# 11. Production Deployment dengan Vercel

Untuk Vercel, backend menggunakan serverless function.

Entry point:

```text
src/index.ts
```

Berbeda dengan `server.ts`, file ini tidak menjalankan:

```ts
app.listen()
```

Vercel yang menangani HTTP server dan lifecycle function.

Architecture:

```text
                    Vercel
                      │
                      ▼
               src/index.ts
                      │
                      ▼
                  app.ts
                      │
                      ▼
                   Routes
                      │
                      ▼
                Controllers
                      │
                      ▼
                  Services
                      │
                      ▼
                   Prisma
                      │
                      ▼
                 MongoDB
```

---

# 12. Development vs Production

Project menggunakan dua entry point karena kebutuhan environment berbeda.

### Development

```text
npm run dev
      │
      ▼
src/server.ts
      │
      ▼
app.listen()
      │
      ▼
Express Server
```

### Traditional Production

```text
npm run build
      │
      ▼
dist/server.js
      │
      ▼
npm start
      │
      ▼
Express Server
```

### Vercel Production

```text
Vercel
   │
   ▼
src/index.ts
   │
   ▼
Express Application
   │
   ▼
Prisma
   │
   ▼
MongoDB
```

---

# 13. Environment Variables

Application membutuhkan environment variable:

```env
DATABASE_URL=
```

Contoh struktur `.env`:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database"
```

File `.env` **tidak boleh di-commit ke repository**.

Untuk deployment Vercel, environment variable harus dikonfigurasi melalui:

```text
Vercel Project
    ↓
Settings
    ↓
Environment Variables
    ↓
DATABASE_URL
```

---

# 14. Recommended Development Lifecycle

Workflow pengembangan yang digunakan:

```text
1. Pull / Clone Repository
          ↓
2. npm install
          ↓
3. Configure .env
          ↓
4. npm run prisma:generate
          ↓
5. npm run db:push
          ↓
6. npm run db:setup
          ↓
7. npm run dev
          ↓
8. Develop Feature
          ↓
9. Test
          ↓
10. Commit
```

---

# 15. Recommended Production Lifecycle

Sebelum deployment:

```text
Source Code
     │
     ▼
Run Tests
     │
     ▼
Prisma Generate
     │
     ▼
TypeScript Build
     │
     ▼
Deployment
```

Untuk traditional server:

```text
npm run build
     ↓
npm start
```

Untuk Vercel:

```text
Git Push
   ↓
Vercel Build
   ↓
Prisma Generate
   ↓
TypeScript Build
   ↓
Serverless Function
   ↓
MongoDB
```

---

# 16. Design Principles

Project ini menggunakan beberapa prinsip untuk menjaga maintainability.

### Separation of Concerns

Setiap layer memiliki tanggung jawab masing-masing:

```text
Route       → Routing
Controller  → HTTP handling
Service     → Business logic
Prisma      → Database access
MongoDB     → Data persistence
```

### Reusable Application

Express application dipisahkan dari HTTP server:

```text
app.ts
  ↓
Express Application
```

sehingga dapat digunakan oleh:

```text
server.ts
```

maupun:

```text
index.ts
```

### Database Initialization Terpisah

Database setup seperti TTL Index tidak ditempatkan di dalam request handler.

```text
Database Setup
      ≠
HTTP Request
```

Hal ini mencegah pekerjaan initialization dijalankan berulang kali pada setiap request.

---

# 17. Summary Architecture

Secara keseluruhan:

```text
                         CLIENT
                           │
                           │ HTTP
                           ▼
                  ┌─────────────────┐
                  │    Express      │
                  │     app.ts      │
                  └────────┬────────┘
                           │
                           ▼
                     ┌───────────┐
                     │   Routes  │
                     └─────┬─────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Controller    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    Service      │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     Prisma      │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     MongoDB     │
                  └─────────────────┘


        DEVELOPMENT                 PRODUCTION / VERCEL
             │                              │
             ▼                              ▼
       server.ts                       index.ts
             │                              │
             ▼                              ▼
        app.listen()                  Serverless Function
             │                              │
             └──────────────┬───────────────┘
                            ▼
                         app.ts
```

Dengan desain ini, **application layer tetap sama**, sementara entry point HTTP dapat berbeda sesuai environment. Development menggunakan traditional Node.js server, sedangkan Vercel menggunakan serverless function.
