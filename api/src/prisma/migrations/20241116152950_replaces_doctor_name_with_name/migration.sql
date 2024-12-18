/*
  Warnings:

  - You are about to drop the column `doctorName` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "doctorName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "patientName",
ADD COLUMN     "name" TEXT NOT NULL;
