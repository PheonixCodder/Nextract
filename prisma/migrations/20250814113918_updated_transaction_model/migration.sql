/*
  Warnings:

  - Added the required column `completedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "transactionId" TEXT NOT NULL DEFAULT '',
    "price" DECIMAL NOT NULL DEFAULT 0,
    "planId" TEXT NOT NULL DEFAULT '',
    "completedAt" DATETIME NOT NULL
);
INSERT INTO "new_Transaction" ("credits", "planId", "price", "transactionId", "userId") SELECT "credits", "planId", "price", "transactionId", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
