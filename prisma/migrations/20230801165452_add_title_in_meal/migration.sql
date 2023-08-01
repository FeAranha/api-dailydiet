/*
  Warnings:

  - Added the required column `title` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "title" TEXT NOT NULL;
