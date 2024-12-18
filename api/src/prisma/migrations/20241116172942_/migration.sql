/*
  Warnings:

  - You are about to drop the column `ssn` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Patient_ssn_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "ssn",
ADD COLUMN     "cpf" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_cpf_key" ON "Patient"("cpf");
