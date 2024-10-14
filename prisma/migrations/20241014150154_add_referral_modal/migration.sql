-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "relationship" TEXT,
    "feedback" TEXT,
    "recommendation" TEXT,
    "contact_info" TEXT,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referrals_session_id_key" ON "referrals"("session_id");
