# DATABASE.md

Dibuat berdasarkan `bofitxp-be/prisma/schema.prisma` pada 2026-10-19.

## 1. Engine dan koneksi

- database provider: MongoDB
- Prisma datasource: `datasource db { provider = "mongodb" url = env("DATABASE_URL") }`
- Prisma client output custom: `../src/generated/prisma`

## 2. Enumeration

Model enum yang terlihat:

- `Role`: `ADMIN`, `MEMBER`
- `TargetFinal`: `weight_loss`, `muscle_gain`, `maintain_fitness`, `endurance`
- `Gender`: `pria`, `wanita`
- `QuestType`: `cardio`, `lifting`, `thinking`, `meditating`, `unknown`
- `Difficulty`: `easy`, `medium`, `hard`
- `QuestCategory`: `daily`, `weekly`, `special`, `unknown`

## 3. Model `Users`

Field utama:

- `id`: `String @id @default(auto()) @map("_id") @db.ObjectId`
- `fullName`: `String`
- `username`: `String @unique`
- `email`: `String @unique`
- `password`: `String`
- `activationCode`: `String?`
- `isVerified`: `Boolean @default(false)`
- `level`: `Int? @default(0)`
- `streak`: `Int? @default(0)`
- `avatarUrl`: `String?`
- `xp`: `Int? @default(0)`
- `gender`: `Gender`
- `age`: `Int @default(0)`
- `body_weight`: `Float @default(0)`
- `body_height`: `Int @default(0)`
- `body_mass_index`: `Float?`
- `role`: `Role @default(MEMBER)`
- `target_final`: `TargetFinal @default(maintain_fitness)`
- `expireAt`: `DateTime?`
- `createdAt`: `DateTime @default(now())`
- `updatedAt`: `DateTime @updatedAt`

Relasi:

- `userQuests`: `UserQuest[]`

## 4. Model `Quests`

Field utama:

- `questId`: `String @id @default(auto()) @map("_id") @db.ObjectId`
- `title`: `String`
- `quest_type`: `QuestType @default(unknown)`
- `quest_category`: `QuestCategory @default(unknown)`
- `difficulty`: `Difficulty @default(easy)`
- `xp_reward`: `Int @default(0)`
- timestamps `createdAt`, `updatedAt`

Relasi:

- `userQuests`: `UserQuest[]`

## 5. Model `UserQuest`

Field utama:

- `id`: `String @id @default(auto()) @map("_id") @db.ObjectId`
- `userId`: `String @db.ObjectId`
- `questId`: `String @db.ObjectId`
- `is_finished`: `Boolean @default(false)`
- `finishedAt`: `DateTime?`
- `createdAt`: `DateTime @default(now())`
- `updatedAt`: `DateTime @updatedAt`

Kunci unik:

- `@@unique([userId, questId])`

Relasi:

- `user`: `Users`
- `quest`: `Quests`

## 6. Catatan domain business

Model ini mendukung fitur:

- registrasi pengguna
- verifikasi akun via activation code
- personalisasi target kesehatan
- pemberian XP dan level progression
- task/quest yang dikerjakan user
- quest generation berbasis profil dan AI

## 7. Keterbatasan yang terlihat

- Tidak ada model habit/exercise yang aktif di schema utama; kode yang dicomment-out menunjukkan kemungkinan fitur terencana tetapi belum aktif
- Schema belum menunjukkan table untuk leaderboard, achievements, atau notification yang jelas
- Belum ada bukti migrasi manual atau seed runtime yang dijalankan dalam audit ini

## 8. Kesimpulan

Skema database saat ini fokus pada core gamification: user profile, quest library, progress assignment, serta target kondisi fisik. Ini konsisten dengan flow auth dan generation quest AI yang sudah terlihat pada backend.
