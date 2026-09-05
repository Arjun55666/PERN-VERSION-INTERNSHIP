/*
  Warnings:

  - You are about to drop the column `purchase_date` on the `hardware_assets` table. All the data in the column will be lost.
  - You are about to alter the column `asset_model` on the `hardware_assets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `area` on the `hardware_assets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `hardware_type` on the `hardware_assets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to drop the `asset_assignments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date_purchased` to the `hardware_assets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "asset_assignments" DROP CONSTRAINT "asset_assignments_asset_id_fkey";

-- AlterTable
ALTER TABLE "hardware_assets" DROP COLUMN "purchase_date",
ADD COLUMN     "date_purchased" VARCHAR(10) NOT NULL,
ALTER COLUMN "asset_model" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "area" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "hardware_type" SET DATA TYPE VARCHAR(50);

-- DropTable
DROP TABLE "asset_assignments";

-- CreateTable
CREATE TABLE "asset_assignment" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "employee_name" VARCHAR(100) NOT NULL,
    "asset_model" VARCHAR(50) NOT NULL,
    "employee_code" VARCHAR(50) NOT NULL,
    "assigned_date" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deactivated_at" TIMESTAMP(3),
    "qr_verified" BOOLEAN,
    "qr_verified_image" VARCHAR(255),
    "serial_verified_image" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asset_assignment_asset_id_is_active_idx" ON "asset_assignment"("asset_id", "is_active");

-- CreateIndex
CREATE INDEX "asset_assignment_department_idx" ON "asset_assignment"("department");

-- AddForeignKey
ALTER TABLE "asset_assignment" ADD CONSTRAINT "asset_assignment_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "hardware_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
