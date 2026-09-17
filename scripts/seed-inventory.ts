// scripts/seed-inventory.ts
/**
 * Deterministic Database Seed Script for USA Used Auto Parts
 * 
 * Migrates existing category taxonomy and verified inventory records from
 * src/app/data/inventoryData.ts into the PostgreSQL database via Prisma ORM.
 * 
 * Guarantees 100% data fidelity:
 * - Existing inventory IDs (SKUs) are preserved as primary keys
 * - Prices stored as precise Decimals
 * - Donor VINs and mileages separated into numeric and formatted fields
 * - Zero artificial or fake inventory generated
 */

import { PrismaClient } from '@prisma/client';
import { CATEGORIES, INVENTORY_ITEMS } from '../src/app/data/inventoryData';

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not defined.');
    console.error('Please configure DATABASE_URL before running the seed script.');
    process.exit(1);
  }

  console.log('--- STARTING INVENTORY DATABASE SEED ---');

  // 1. Seed Categories
  console.log('\n[1/5] Seeding Categories...');
  for (const cat of Object.values(CATEGORIES)) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        title: cat.title,
        shortTitle: cat.shortTitle,
        metaTitle: cat.metaTitle,
        metaDescription: cat.metaDescription,
        heroDescription: cat.heroDescription,
        imageUrl: cat.image,
        warrantySummary: cat.warrantySummary,
        inspectionDetails: cat.inspectionDetails,
      },
      create: {
        slug: cat.slug,
        title: cat.title,
        shortTitle: cat.shortTitle,
        metaTitle: cat.metaTitle,
        metaDescription: cat.metaDescription,
        heroDescription: cat.heroDescription,
        imageUrl: cat.image,
        warrantySummary: cat.warrantySummary,
        inspectionDetails: cat.inspectionDetails,
      },
    });
    console.log(`  ✓ Category: ${cat.slug}`);
  }

  // 2. Track unique Makes and Models
  console.log('\n[2/5] Seeding Makes & Models...');
  const makeMap = new Map<string, string>(); // slug -> id
  const modelMap = new Map<string, string>(); // `${makeSlug}:${modelSlug}` -> id

  for (const item of INVENTORY_ITEMS) {
    // Upsert Make
    if (!makeMap.has(item.makeSlug)) {
      const make = await prisma.make.upsert({
        where: { slug: item.makeSlug },
        update: { name: item.make },
        create: {
          slug: item.makeSlug,
          name: item.make,
          logoUrl: `/car-logos/${item.makeSlug}.png`,
        },
      });
      makeMap.set(item.makeSlug, make.id);
      console.log(`  ✓ Make: ${item.make} (${item.makeSlug})`);
    }

    // Upsert Model
    const makeId = makeMap.get(item.makeSlug)!;
    const modelKey = `${item.makeSlug}:${item.modelSlug}`;
    if (!modelMap.has(modelKey)) {
      const model = await prisma.model.upsert({
        where: {
          makeId_slug: {
            makeId: makeId,
            slug: item.modelSlug,
          },
        },
        update: { name: item.model },
        create: {
          makeId: makeId,
          slug: item.modelSlug,
          name: item.model,
        },
      });
      modelMap.set(modelKey, model.id);
      console.log(`  ✓ Model: ${item.make} ${item.model} (${item.modelSlug})`);
    }
  }

  // 3. Seed Vehicles & Donor Vehicles
  console.log('\n[3/5] Seeding Vehicles & Donor Vehicles...');
  const donorMap = new Map<string, string>(); // vin -> id

  for (const item of INVENTORY_ITEMS) {
    // Upsert Donor Vehicle
    if (!donorMap.has(item.donorVin)) {
      const numericMiles = parseInt(item.donorMileage.replace(/[^0-9]/g, ''), 10) || 0;
      const donor = await prisma.donorVehicle.upsert({
        where: { vin: item.donorVin },
        update: {
          vehicleSummary: item.donorVehicle,
          mileageMiles: numericMiles,
          mileageFormatted: item.donorMileage,
          runCondition: item.condition,
        },
        create: {
          vin: item.donorVin,
          vehicleSummary: item.donorVehicle,
          mileageMiles: numericMiles,
          mileageFormatted: item.donorMileage,
          runCondition: item.condition,
        },
      });
      donorMap.set(item.donorVin, donor.id);
      console.log(`  ✓ Donor Vehicle VIN: ${item.donorVin} (${numericMiles} miles)`);
    }
  }

  // 4. Seed Parts, Fitments, Interchanges, and Images
  console.log('\n[4/5] Seeding Parts & Fitments...');
  for (const item of INVENTORY_ITEMS) {
    const donorVehicleId = donorMap.get(item.donorVin) || null;
    const modelKey = `${item.makeSlug}:${item.modelSlug}`;
    const modelId = modelMap.get(modelKey)!;

    // Upsert normalized Vehicle spec
    const vehicle = await prisma.vehicle.upsert({
      where: {
        modelId_year_trim_engineCode_transmissionCode: {
          modelId: modelId,
          year: item.year,
          trim: item.trim || null,
          engineCode: item.engineCode || null,
          transmissionCode: item.transmissionCode || null,
        },
      },
      update: {},
      create: {
        modelId: modelId,
        year: item.year,
        trim: item.trim || null,
        engineCode: item.engineCode || null,
        transmissionCode: item.transmissionCode || null,
      },
    });

    // Upsert Part (preserving stable public ID)
    const part = await prisma.part.upsert({
      where: { id: item.id },
      update: {
        categorySlug: item.categorySlug,
        donorVehicleId: donorVehicleId,
        partName: item.partName,
        condition: item.condition,
        price: item.price,
        currency: 'USD',
        availability: item.availability,
        warranty: item.warranty,
        shipping: item.shipping,
        fitmentNotes: item.fitmentNotes,
        primaryImageUrl: item.image,
      },
      create: {
        id: item.id,
        categorySlug: item.categorySlug,
        donorVehicleId: donorVehicleId,
        partName: item.partName,
        condition: item.condition,
        price: item.price,
        currency: 'USD',
        availability: item.availability,
        warranty: item.warranty,
        shipping: item.shipping,
        fitmentNotes: item.fitmentNotes,
        primaryImageUrl: item.image,
      },
    });

    // Upsert Fitment
    await prisma.partFitment.upsert({
      where: {
        partId_vehicleId: {
          partId: part.id,
          vehicleId: vehicle.id,
        },
      },
      update: {
        yearStart: item.year,
        yearEnd: item.year,
        notes: item.fitmentNotes,
      },
      create: {
        partId: part.id,
        vehicleId: vehicle.id,
        yearStart: item.year,
        yearEnd: item.year,
        notes: item.fitmentNotes,
      },
    });

    // Seed Interchange
    await prisma.partInterchange.deleteMany({ where: { partId: part.id } });
    await prisma.partInterchange.create({
      data: {
        partId: part.id,
        interchangeType: 'Hollander',
        interchangeNumber: item.interchangeNumber,
      },
    });

    if (item.oemPartNumber) {
      await prisma.partInterchange.create({
        data: {
          partId: part.id,
          interchangeType: 'OEM',
          interchangeNumber: item.oemPartNumber,
        },
      });
    }

    // Seed Images
    await prisma.partImage.deleteMany({ where: { partId: part.id } });
    await prisma.partImage.create({
      data: {
        partId: part.id,
        imageUrl: item.image,
        altText: item.partName,
        displayOrder: 0,
      },
    });

    console.log(`  ✓ Part: ${part.id} - ${part.partName.substring(0, 50)}...`);
  }

  console.log('\n[5/5] Verifying seeded counts...');
  const catCount = await prisma.category.count();
  const makeCount = await prisma.make.count();
  const modelCount = await prisma.model.count();
  const donorCount = await prisma.donorVehicle.count();
  const partCount = await prisma.part.count();

  console.log(`Summary:`);
  console.log(`  - Categories: ${catCount}`);
  console.log(`  - Makes: ${makeCount}`);
  console.log(`  - Models: ${modelCount}`);
  console.log(`  - Donor Vehicles: ${donorCount}`);
  console.log(`  - Parts: ${partCount}`);

  console.log('\n--- SEED COMPLETE ---');
}

main()
  .catch((e) => {
    console.error('Seed execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
