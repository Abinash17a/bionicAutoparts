-- Migration: 20260909000000_init_inventory
-- USA Used Auto Parts - Normalized Inventory Schema
-- Phase 2A Stage 2 Database Foundation

-- CreateTable: categories
CREATE TABLE "categories" (
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "warrantySummary" TEXT NOT NULL,
    "inspectionDetails" JSONB NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("slug")
);

-- CreateTable: makes
CREATE TABLE "makes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,

    CONSTRAINT "makes_pkey" PRIMARY KEY ("id")
);

-- CreateTable: models
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "makeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable: vehicles
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "trim" TEXT,
    "engineCode" TEXT,
    "transmissionCode" TEXT,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable: donor_vehicles
CREATE TABLE "donor_vehicles" (
    "id" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "vehicleSummary" TEXT NOT NULL,
    "mileageMiles" INTEGER NOT NULL,
    "mileageFormatted" TEXT NOT NULL,
    "runCondition" TEXT NOT NULL,

    CONSTRAINT "donor_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable: parts
CREATE TABLE "parts" (
    "id" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "donorVehicleId" TEXT,
    "partName" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "availability" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "shipping" TEXT NOT NULL,
    "fitmentNotes" TEXT NOT NULL,
    "primaryImageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: part_fitments
CREATE TABLE "part_fitments" (
    "id" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "yearStart" INTEGER,
    "yearEnd" INTEGER,
    "notes" TEXT,

    CONSTRAINT "part_fitments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: part_interchanges
CREATE TABLE "part_interchanges" (
    "id" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "interchangeType" TEXT NOT NULL,
    "interchangeNumber" TEXT NOT NULL,

    CONSTRAINT "part_interchanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable: part_images
CREATE TABLE "part_images" (
    "id" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "part_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "makes_slug_key" ON "makes"("slug");

-- CreateIndex
CREATE INDEX "models_makeId_slug_idx" ON "models"("makeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "models_makeId_slug_key" ON "models"("makeId", "slug");

-- CreateIndex
CREATE INDEX "vehicles_modelId_year_idx" ON "vehicles"("modelId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_modelId_year_trim_engineCode_transmissionCode_key" ON "vehicles"("modelId", "year", "trim", "engineCode", "transmissionCode");

-- CreateIndex
CREATE UNIQUE INDEX "donor_vehicles_vin_key" ON "donor_vehicles"("vin");

-- CreateIndex
CREATE INDEX "parts_categorySlug_idx" ON "parts"("categorySlug");

-- CreateIndex
CREATE INDEX "parts_availability_idx" ON "parts"("availability");

-- CreateIndex
CREATE INDEX "parts_categorySlug_availability_idx" ON "parts"("categorySlug", "availability");

-- CreateIndex
CREATE INDEX "part_fitments_vehicleId_idx" ON "part_fitments"("vehicleId");

-- CreateIndex
CREATE INDEX "part_fitments_partId_idx" ON "part_fitments"("partId");

-- CreateIndex
CREATE INDEX "part_fitments_yearStart_yearEnd_idx" ON "part_fitments"("yearStart", "yearEnd");

-- CreateIndex
CREATE UNIQUE INDEX "part_fitments_partId_vehicleId_key" ON "part_fitments"("partId", "vehicleId");

-- CreateIndex
CREATE INDEX "part_interchanges_interchangeNumber_idx" ON "part_interchanges"("interchangeNumber");

-- CreateIndex
CREATE INDEX "part_interchanges_partId_idx" ON "part_interchanges"("partId");

-- CreateIndex
CREATE INDEX "part_images_partId_displayOrder_idx" ON "part_images"("partId", "displayOrder");

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "makes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "categories"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_donorVehicleId_fkey" FOREIGN KEY ("donorVehicleId") REFERENCES "donor_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_fitments" ADD CONSTRAINT "part_fitments_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_fitments" ADD CONSTRAINT "part_fitments_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_interchanges" ADD CONSTRAINT "part_interchanges_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_images" ADD CONSTRAINT "part_images_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
