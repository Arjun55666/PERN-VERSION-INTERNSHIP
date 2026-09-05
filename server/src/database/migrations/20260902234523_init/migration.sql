-- CreateTable
CREATE TABLE "hardware_assets" (
    "id" SERIAL NOT NULL,
    "asset_id" VARCHAR(50) NOT NULL,
    "asset_model" VARCHAR(100) NOT NULL,
    "purchase_date" DATE NOT NULL,
    "serial_number" VARCHAR(100) NOT NULL,
    "area" VARCHAR(100) NOT NULL,
    "hardware_type" VARCHAR(100) NOT NULL,
    "is_sold" BOOLEAN NOT NULL DEFAULT false,
    "is_working" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hardware_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_assignments" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "employee_name" VARCHAR(100) NOT NULL,
    "employee_code" VARCHAR(50) NOT NULL,
    "assigned_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deactivated_at" TIMESTAMP(3),
    "qr_verified" BOOLEAN,
    "qr_verified_image" VARCHAR(255),
    "serial_verified_image" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_asset_counts" (
    "id" SERIAL NOT NULL,
    "location_name" VARCHAR(100) NOT NULL,
    "total_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "location_asset_counts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hardware_assets_asset_id_key" ON "hardware_assets"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "hardware_assets_serial_number_key" ON "hardware_assets"("serial_number");

-- CreateIndex
CREATE INDEX "hardware_assets_area_idx" ON "hardware_assets"("area");

-- CreateIndex
CREATE INDEX "hardware_assets_hardware_type_idx" ON "hardware_assets"("hardware_type");

-- CreateIndex
CREATE INDEX "asset_assignments_asset_id_is_active_idx" ON "asset_assignments"("asset_id", "is_active");

-- CreateIndex
CREATE INDEX "asset_assignments_department_idx" ON "asset_assignments"("department");

-- CreateIndex
CREATE UNIQUE INDEX "location_asset_counts_location_name_key" ON "location_asset_counts"("location_name");

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "hardware_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
