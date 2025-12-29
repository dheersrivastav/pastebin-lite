-- CreateTable
CREATE TABLE "pastes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME,
    "max_views" INTEGER,
    "view_count" INTEGER NOT NULL DEFAULT 0
);
