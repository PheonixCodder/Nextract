/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "transactionId" TEXT NOT NULL DEFAULT '',
    "price" DECIMAL NOT NULL DEFAULT 0,
    "planId" TEXT NOT NULL DEFAULT '',
    "completedAt" DATETIME NOT NULL
);
INSERT INTO "new_Transaction" ("completedAt", "credits", "planId", "price", "transactionId", "userId") SELECT "completedAt", "credits", "planId", "price", "transactionId", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
