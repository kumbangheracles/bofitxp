# DATABASE.md

Dibuat dan diperbarui berdasarkan `bofitxp-be/prisma/schema.prisma` serta service logic yang sedang aktif pada 2026-10-20.

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
- quest assignment dan completion tracking
- streak combo dan challenge bonus yang dihitung dari history completion

## 7. Kejadian game-state yang saat ini dipakai

Dari service logic, model tetap mendukung:

- `finishedAt` untuk mencatat waktu selesai quest
- `Users.streak` untuk status streak harian / combo
- `Users.xp` dan `Users.level` untuk pengalaman dan progression
- `Quests.quest_category` dan `Quests.difficulty` untuk menentukan reward dan challenge threshold

## 8. Keterbatasan yang terlihat

- belum ada model spesifik untuk leaderboard/achievement/notification pada schema utama
- belum ada bukti penuh bahwa semua event streak/challenge disinkronkan dengan UI real-time di device
- runtime integration di database masih harus diverifikasi melalui black-box testing end-to-end

## 9. Kesimpulan

Skema database saat ini mendukung core gamification: user profile, quest library, completion assignment, serta progression XP/level. Dengan adanya field `finishedAt`, `streak`, dan logic `UserQuestService`, model ini juga benar-benar mendukung ordinary quest flow dan challenge event yang saat ini sudah dibuktikan via source code dan test terfokus.
