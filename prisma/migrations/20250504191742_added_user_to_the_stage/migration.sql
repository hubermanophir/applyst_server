/*
  Warnings:

  - Added the required column `user_id` to the `Stage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Stage_user_id_idx" ON "Stage"("user_id");

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
