/*
  Warnings:

  - You are about to drop the `Login` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Login" DROP CONSTRAINT "Login_doctorId_fkey";

-- DropTable
DROP TABLE "Login";
