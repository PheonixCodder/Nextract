-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserBalance" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "transactionId" TEXT NOT NULL DEFAULT '',
    "price" DECIMAL NOT NULL DEFAULT 0,
    "planId" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_UserBalance" ("credits", "userId") SELECT "credits", "userId" FROM "UserBalance";
DROP TABLE "UserBalance";
ALTER TABLE "new_UserBalance" RENAME TO "UserBalance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
