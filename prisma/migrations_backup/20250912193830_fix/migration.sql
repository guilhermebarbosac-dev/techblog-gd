/*
  Warnings:

  - You are about to drop the column `excerpt` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `tags` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_articles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "avatar" TEXT,
    CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_articles" ("authorId", "avatar", "content", "createdAt", "id", "title", "updatedAt") SELECT "authorId", "avatar", "content", "createdAt", "id", "title", "updatedAt" FROM "articles";
DROP TABLE "articles";
ALTER TABLE "new_articles" RENAME TO "articles";
CREATE TABLE "new_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tags" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
