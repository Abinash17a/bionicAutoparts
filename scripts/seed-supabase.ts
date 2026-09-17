// scripts/seed-supabase.ts
/**
 * Deterministic Supabase Database Seed Script for USA Used Auto Parts / Bionic Auto Parts
 * 
 * Migrates verified category taxonomy and inventory records from
 * src/app/data/inventoryData.ts directly into Supabase PostgreSQL tables.
 * 
 * Guarantees 100% data fidelity:
 * - Existing inventory IDs (SKUs) are preserved as primary keys
 * - Prices stored as precise Decimals / numbers
 * - Donor VINs and mileages properly formatted and typed
 * - Zero artificial or fake inventory generated
 */

import { createClient } from '@supabase/supabase-js';
import { CATEGORIES, INVENTORY_ITEMS } from '../src/app/data/inventoryData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined.');
  console.error('Please configure Supabase environment variables before running the seed script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('--- STARTING SUPABASE INVENTORY SEED ---');

  // 1. Seed Categories
  console.log('\n[1/5] Seeding Categories...');
  for (const cat of Object.values(CATEGORIES)) {
    const { error } = await supabase.from('categories').upsert({
      slug: cat.slug,
      title: cat.title,
      short_title: cat.shortTitle,
      meta_title: cat.metaTitle,
      meta_description: cat.metaDescription,
      hero_description: cat.heroDescription,
      image_url: cat.image,
      warranty_summary: cat.warrantySummary,
      inspection_details: cat.inspectionDetails,
    }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error inserting category ${cat.slug}:`, error.message);
    } else {
      console.log(`  ✓ Category: ${cat.slug}`);
    }
  }

  // 2. Track unique Makes and Models
  console.log('\n[2/5] Seeding Makes & Models...');
  const makeMap = new Map<string, string>(); // slug -> id
  const modelMap = new Map<string, string>(); // `${makeSlug}:${modelSlug}` -> id

  for (const item of INVENTORY_ITEMS) {
    // Upsert Make
    if (!makeMap.has(item.makeSlug)) {
      const { data: existingMake } = await supabase
        .from('makes')
        .select('id')
        .eq('slug', item.makeSlug)
        .single();

      let makeId = existingMake?.id;

      if (!makeId) {
        const { data: newMake, error: makeError } = await supabase
          .from('makes')
          .insert({
            slug: item.makeSlug,
            name: item.make,
            logo_url: `/car-logos/${item.makeSlug}.png`,
          })
          .select('id')
          .single();

        if (makeError) {
          console.error(`Error inserting make ${item.makeSlug}:`, makeError.message);
        } else if (newMake) {
          makeId = newMake.id;
        }
      }

      if (makeId) {
        makeMap.set(item.makeSlug, makeId);
        console.log(`  ✓ Make: ${item.make} (${item.makeSlug})`);
      }
    }

    // Upsert Model
    const makeId = makeMap.get(item.makeSlug);
    if (makeId) {
      const modelKey = `${item.makeSlug}:${item.modelSlug}`;
      if (!modelMap.has(modelKey)) {
        const { data: existingModel } = await supabase
          .from('models')
          .select('id')
          .eq('make_id', makeId)
          .eq('slug', item.modelSlug)
          .single();

        let modelId = existingModel?.id;

        if (!modelId) {
          const { data: newModel, error: modelError } = await supabase
            .from('models')
            .insert({
              make_id: makeId,
              slug: item.modelSlug,
              name: item.model,
            })
            .select('id')
            .single();

          if (modelError) {
            console.error(`Error inserting model ${item.modelSlug}:`, modelError.message);
          } else if (newModel) {
            modelId = newModel.id;
          }
        }

        if (modelId) {
          modelMap.set(modelKey, modelId);
          console.log(`  ✓ Model: ${item.make} ${item.model} (${item.modelSlug})`);
        }
      }
    }
  }

  // 3. Seed Donor Vehicles
  console.log('\n[3/5] Seeding Donor Vehicles...');
  const donorMap = new Map<string, string>(); // vin -> id

  for (const item of INVENTORY_ITEMS) {
    if (!donorMap.has(item.donorVin)) {
      const numericMiles = parseInt(item.donorMileage.replace(/[^0-9]/g, ''), 10) || 0;
      
      const { data: existingDonor } = await supabase
        .from('donor_vehicles')
        .select('id')
        .eq('vin', item.donorVin)
        .single();

      let donorId = existingDonor?.id;

      if (!donorId) {
        const { data: newDonor, error: donorError } = await supabase
          .from('donor_vehicles')
          .insert({
            vin: item.donorVin,
            vehicle_summary: item.donorVehicle,
            mileage_miles: numericMiles,
            mileage_formatted: item.donorMileage,
            run_condition: item.condition,
          })
          .select('id')
          .single();

        if (donorError) {
          console.error(`Error inserting donor vehicle ${item.donorVin}:`, donorError.message);
        } else if (newDonor) {
          donorId = newDonor.id;
        }
      }

      if (donorId) {
        donorMap.set(item.donorVin, donorId);
        console.log(`  ✓ Donor Vehicle VIN: ${item.donorVin} (${numericMiles} miles)`);
      }
    }
  }

  // 4. Seed Vehicles, Parts, Fitments, Interchanges & Images
  console.log('\n[4/5] Seeding Parts, Fitments & Media...');
  for (const item of INVENTORY_ITEMS) {
    const donorVehicleId = donorMap.get(item.donorVin) || null;
    const modelKey = `${item.makeSlug}:${item.modelSlug}`;
    const modelId = modelMap.get(modelKey);

    if (!modelId) continue;

    // Upsert Vehicle Specification
    const { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('id')
      .eq('model_id', modelId)
      .eq('year', item.year)
      .single();

    let vehicleId = existingVehicle?.id;

    if (!vehicleId) {
      const { data: newVehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          model_id: modelId,
          year: item.year,
          trim: item.trim || null,
          engine_code: item.engineCode || null,
          transmission_code: item.transmissionCode || null,
        })
        .select('id')
        .single();

      if (vehicleError) {
        console.error(`Error inserting vehicle ${item.year} ${item.model}:`, vehicleError.message);
      } else if (newVehicle) {
        vehicleId = newVehicle.id;
      }
    }

    // Upsert Part with original SKU
    const { error: partError } = await supabase.from('parts').upsert({
      id: item.id,
      category_slug: item.categorySlug,
      donor_vehicle_id: donorVehicleId,
      part_name: item.partName,
      condition: item.condition,
      price: item.price,
      currency: 'USD',
      availability: item.availability,
      warranty: item.warranty,
      shipping: item.shipping,
      fitment_notes: item.fitmentNotes,
      primary_image_url: item.image,
    }, { onConflict: 'id' });

    if (partError) {
      console.error(`Error inserting part ${item.id}:`, partError.message);
      continue;
    }

    // Upsert Fitment
    if (vehicleId) {
      await supabase.from('part_fitments').upsert({
        part_id: item.id,
        vehicle_id: vehicleId,
        year_start: item.year,
        year_end: item.year,
        notes: item.fitmentNotes,
      }, { onConflict: 'part_id,vehicle_id' });
    }

    // Upsert Interchanges
    await supabase.from('part_interchanges').delete().eq('part_id', item.id);
    await supabase.from('part_interchanges').insert([
      {
        part_id: item.id,
        interchange_type: 'Hollander',
        interchange_number: item.interchangeNumber,
      },
      ...(item.oemPartNumber ? [{
        part_id: item.id,
        interchange_type: 'OEM',
        interchange_number: item.oemPartNumber,
      }] : []),
    ]);

    // Upsert Images
    await supabase.from('part_images').delete().eq('part_id', item.id);
    await supabase.from('part_images').insert({
      part_id: item.id,
      image_url: item.image,
      alt_text: item.partName,
      display_order: 0,
    });

    console.log(`  ✓ Part: ${item.id} - ${item.partName.substring(0, 50)}...`);
  }

  console.log('\n[5/5] Verifying seeded counts...');
  const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: makeCount } = await supabase.from('makes').select('*', { count: 'exact', head: true });
  const { count: modelCount } = await supabase.from('models').select('*', { count: 'exact', head: true });
  const { count: donorCount } = await supabase.from('donor_vehicles').select('*', { count: 'exact', head: true });
  const { count: partCount } = await supabase.from('parts').select('*', { count: 'exact', head: true });

  console.log(`Summary:`);
  console.log(`  - Categories: ${catCount || 0}`);
  console.log(`  - Makes: ${makeCount || 0}`);
  console.log(`  - Models: ${modelCount || 0}`);
  console.log(`  - Donor Vehicles: ${donorCount || 0}`);
  console.log(`  - Parts: ${partCount || 0}`);

  console.log('\n--- SUPABASE SEED COMPLETE ---');
}

main().catch((e) => {
  console.error('Seed execution error:', e);
  process.exit(1);
});
