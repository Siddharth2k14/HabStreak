/*
  Warnings:

  - The values [PENDING,IN_PROGRESS,COMPLETED,ARCHIVED] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `link` on the `Task` table. All the data in the column will be lost.
  - Added the required column `position` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('TODO', 'DOING', 'IN_REVIEW', 'DONE');
ALTER TABLE "public"."Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "public"."TaskStatus_old";
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'TODO';
COMMIT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "link",
ADD COLUMN     "position" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'TODO';

-- CreateIndex
CREATE INDEX "Task_userId_status_position_idx" ON "Task"("userId", "status", "position");
