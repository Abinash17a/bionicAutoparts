// src/lib/nhtsa/nhtsaService.ts
/**
 * NHTSA vPIC Vehicle Guide Service
 * 
 * Production-ready integration with official NHTSA vPIC endpoints and
 * the @shaggytools/nhtsa-api-wrapper library.
 * Includes in-memory caching, request timeouts, exact normalized matching,
 * VIN format/check-digit validation, and Bionic Auto Parts inventory integration.
 */

import {
  GetAllMakes as wrapperGetAllMakes,
  GetModelsForMakeYear as wrapperGetModelsForMakeYear,
  DecodeVinValues as wrapperDecodeVinValues,
  isValidVin as wrapperIsValidVin,
} from '@shaggytools/nhtsa-api-wrapper';
import {
  MakeOption,
  ModelOption,
  DecodedVehicle,
  VehicleVerificationResult,
  InventoryCategoryLink,
} from './types';
import {
  CATEGORIES,
  toSlug,
  INVENTORY_ITEMS,
} from '../../app/data/inventoryData';
import { getInventoryByVehicle } from '../inventory/inventoryRepository';

export const MIN_SUPPORTED_YEAR = 1995;
export const MAX_SUPPORTED_YEAR = new Date().getFullYear() + 1; // e.g. 2026/2027

// Curated list of popular US-market makes for quick selection
export const POPULAR_MAKES = [
  'Acura',
  'Audi',
  'BMW',
  'Buick',
  'Cadillac',
  'Chevrolet',
  'Chrysler',
  'Dodge',
  'Ford',
  'GMC',
  'Genesis',
  'Honda',
  'Hyundai',
  'Infiniti',
  'Jaguar',
  'Jeep',
  'Kia',
  'Land Rover',
  'Lexus',
  'Lincoln',
  'Mazda',
  'Mercedes-Benz',
  'Mercury',
  'Mini',
  'Mitsubishi',
  'Nissan',
  'Oldsmobile',
  'Plymouth',
  'Pontiac',
  'Porsche',
  'RAM',
  'Saturn',
  'Scion',
  'Subaru',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

// In-memory cache structures with TTL
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setInCache<T>(key: string, data: T, ttlMs: number): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

// Helper to enforce request timeouts
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000, label = 'Request'): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (err) {
    clearTimeout(timeoutHandle!);
    throw err;
  }
}

/**
 * Direct REST fallback for GetAllMakes if wrapper fails or times out
 */
async function fetchAllMakesDirect(timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status} from NHTSA GetAllMakes`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Direct REST fallback for GetModelsForMakeYear
 */
async function fetchModelsForMakeYearDirect(make: string, year: number, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${encodeURIComponent(year)}?format=json`;
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status} from NHTSA GetModelsForMakeYear`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Direct REST fallback for DecodeVinValues
 */
async function decodeVinDirect(vin: string, modelYear?: number, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  let url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`;
  if (modelYear) {
    url += `&modelyear=${encodeURIComponent(modelYear)}`;
  }
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status} from NHTSA DecodeVinValues`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Retrieve makes from NHTSA with popular makes prioritized and cached.
 */
export async function getSupportedMakes(): Promise<{ popular: MakeOption[]; all: MakeOption[] }> {
  const cacheKey = 'nhtsa_all_makes';
  const cached = getFromCache<{ popular: MakeOption[]; all: MakeOption[] }>(cacheKey);
  if (cached) return cached;

  let rawResults: Array<{ Make_ID: number; Make_Name: string }> = [];

  try {
    const res = await withTimeout(wrapperGetAllMakes(), 8000, 'NHTSA GetAllMakes');
    if (res && Array.isArray(res.Results)) {
      rawResults = res.Results;
    }
  } catch (err) {
    console.warn('Wrapper GetAllMakes failed, falling back to direct REST:', err);
    try {
      const res = await fetchAllMakesDirect(8000);
      if (res && Array.isArray(res.Results)) {
        rawResults = res.Results;
      }
    } catch (directErr) {
      console.error('All makes fetch failed completely:', directErr);
    }
  }

  // Deduplicate and sanitize makes list
  const makeMap = new Map<string, MakeOption>();
  for (const item of rawResults) {
    const name = (item.Make_Name || '').trim();
    if (!name) continue;
    const upper = name.toUpperCase();
    if (!makeMap.has(upper)) {
      makeMap.set(upper, {
        makeId: item.Make_ID,
        makeName: name,
      });
    }
  }

  // Build popular makes with verified IDs when available
  const popularMakes: MakeOption[] = POPULAR_MAKES.map((popularName) => {
    const match = makeMap.get(popularName.toUpperCase());
    return {
      makeId: match ? match.makeId : 0,
      makeName: popularName,
      isPopular: true,
    };
  });

  // Sort all makes alphabetically
  const allSorted = Array.from(makeMap.values()).sort((a, b) =>
    a.makeName.localeCompare(b.makeName)
  );

  const payload = {
    popular: popularMakes,
    all: allSorted.length > 0 ? allSorted : popularMakes,
  };

  // Cache for 24 hours
  setInCache(cacheKey, payload, 24 * 60 * 60 * 1000);
  return payload;
}

/**
 * Retrieve models for a selected make and year.
 * Validates year against documented UI policy (1995 to current year + 1).
 * Normalizes and filters models so only models matching the selected make are returned.
 */
export async function getModelsForMakeAndYear(
  make: string,
  year: number
): Promise<{ make: string; year: number; models: ModelOption[] }> {
  const cleanMake = (make || '').trim();
  if (!cleanMake) {
    throw new Error('Vehicle make is required.');
  }

  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear < MIN_SUPPORTED_YEAR || parsedYear > MAX_SUPPORTED_YEAR) {
    throw new Error(
      `Model year must be an integer between ${MIN_SUPPORTED_YEAR} and ${MAX_SUPPORTED_YEAR}. (NHTSA standardized catalog policy).`
    );
  }

  const cacheKey = `nhtsa_models_${cleanMake.toUpperCase()}_${parsedYear}`;
  const cached = getFromCache<{ make: string; year: number; models: ModelOption[] }>(cacheKey);
  if (cached) return cached;

  let rawResults: Array<{
    Make_ID: number;
    Make_Name: string;
    Model_ID: number;
    Model_Name: string;
  }> = [];

  try {
    const res = await withTimeout(
      wrapperGetModelsForMakeYear({ make: cleanMake, modelYear: parsedYear }),
      8000,
      `NHTSA GetModelsForMakeYear(${cleanMake}, ${parsedYear})`
    );
    if (res && Array.isArray(res.Results)) {
      rawResults = res.Results;
    }
  } catch (err) {
    console.warn(`Wrapper GetModelsForMakeYear failed for ${cleanMake} ${parsedYear}, falling back:`, err);
    try {
      const res = await fetchModelsForMakeYearDirect(cleanMake, parsedYear, 8000);
      if (res && Array.isArray(res.Results)) {
        rawResults = res.Results;
      }
    } catch (directErr) {
      console.error(`Direct GetModelsForMakeYear failed for ${cleanMake} ${parsedYear}:`, directErr);
      throw directErr;
    }
  }

  const targetMakeUpper = cleanMake.toUpperCase();
  // Filter by matching make (NHTSA API performs a "LIKE" match which returns unrelated makes)
  const filtered = rawResults.filter((r) => {
    const resultMake = (r.Make_Name || '').trim().toUpperCase();
    return resultMake === targetMakeUpper;
  });

  // Deduplicate models by exact normalized model name
  const modelMap = new Map<string, ModelOption>();
  for (const item of filtered) {
    const modelName = (item.Model_Name || '').trim();
    if (!modelName) continue;
    const normalizedKey = modelName.toUpperCase();
    if (!modelMap.has(normalizedKey)) {
      modelMap.set(normalizedKey, {
        makeId: item.Make_ID,
        makeName: item.Make_Name,
        modelId: item.Model_ID,
        modelName,
      });
    }
  }

  const sortedModels = Array.from(modelMap.values()).sort((a, b) =>
    a.modelName.localeCompare(b.modelName)
  );

  const payload = {
    make: cleanMake,
    year: parsedYear,
    models: sortedModels,
  };

  // Cache models for 6 hours
  setInCache(cacheKey, payload, 6 * 60 * 60 * 1000);
  return payload;
}

/**
 * Strict verification of a Make, Model, and Model Year combination against live NHTSA data.
 * Requires an exact normalized model match.
 * Connects to Bionic Auto Parts inventory and commercial category routes.
 */
export async function verifyVehicleSelection(
  make: string,
  model: string,
  year: number
): Promise<VehicleVerificationResult> {
  const cleanMake = (make || '').trim();
  const cleanModel = (model || '').trim();
  const parsedYear = Number(year);

  if (!cleanMake || !cleanModel || !Number.isInteger(parsedYear)) {
    return {
      verified: false,
      make: cleanMake,
      model: cleanModel,
      modelYear: parsedYear,
      catalogStatus: 'ERROR',
      message: 'Make, model, and integer model year are required.',
      availableModelsCount: 0,
      matchingInventory: [],
      inventoryCategoryLinks: [],
      fitmentNotice: 'Please complete all required fields.',
    };
  }

  const { models } = await getModelsForMakeAndYear(cleanMake, parsedYear);
  const normalizedRequestedModel = cleanModel.toUpperCase();

  // Exact normalized match requirement
  const exactMatch = models.find(
    (m) => m.modelName.trim().toUpperCase() === normalizedRequestedModel
  );

  if (!exactMatch) {
    return {
      verified: false,
      make: cleanMake,
      model: cleanModel,
      modelYear: parsedYear,
      catalogStatus: 'NOT_FOUND',
      message: `The model "${cleanModel}" was not found in the verified NHTSA catalog for ${parsedYear} ${cleanMake}.`,
      availableModelsCount: models.length,
      matchingInventory: [],
      inventoryCategoryLinks: [],
      fitmentNotice:
        'Vehicle combination could not be confirmed in the NHTSA vPIC catalog. Check model spelling or model year.',
    };
  }

  // Cross-reference with Bionic Auto Parts real inventory
  const makeSlug = toSlug(cleanMake);
  const modelSlug = toSlug(cleanModel);

  // Check across major commercial categories
  const categoriesToCheck = ['used-engines', 'used-transmissions', 'used-body-parts', 'used-interior-parts'] as const;
  const inventoryCategoryLinks: InventoryCategoryLink[] = [];
  let allMatchingInventory: typeof INVENTORY_ITEMS = [];

  for (const catSlug of categoriesToCheck) {
    const meta = CATEGORIES[catSlug];
    const inStockItems = await getInventoryByVehicle(catSlug, makeSlug, modelSlug, parsedYear);
    
    // Also check common aliases like chevy/chevrolet
    let items = inStockItems;
    if (items.length === 0 && makeSlug === 'chevrolet') {
      items = await getInventoryByVehicle(catSlug, 'chevy', modelSlug, parsedYear);
    }

    allMatchingInventory = allMatchingInventory.concat(items);

    inventoryCategoryLinks.push({
      categorySlug: catSlug,
      categoryTitle: meta ? meta.shortTitle : catSlug,
      url: `/${catSlug}/${makeSlug}/${modelSlug}/${parsedYear}`,
      inStockCount: items.length,
    });
  }

  // Fitment disclaimer as required by section 6
  const fitmentNotice =
    allMatchingInventory.length > 0
      ? `Found ${allMatchingInventory.length} indexed part(s) matching ${parsedYear} ${cleanMake} ${cleanModel}. Note: Matching make, model, and year alone does not guarantee that a particular engine, transmission, body panel, or electrical module fits. Used parts depend on exact interchange numbers, engine casting codes, transmission codes, and donor VIN documentation.`
      : `No in-stock assemblies currently indexed for ${parsedYear} ${cleanMake} ${cleanModel}. We source from hundreds of verified recycler partners nationwide. Contact our specialist desk with your VIN or vehicle details for an exact interchange fitment check.`;

  return {
    verified: true,
    make: exactMatch.makeName,
    model: exactMatch.modelName,
    modelYear: parsedYear,
    makeId: exactMatch.makeId,
    modelId: exactMatch.modelId,
    catalogStatus: 'CONFIRMED',
    message: `Verified: ${parsedYear} ${exactMatch.makeName} ${exactMatch.modelName} is confirmed in the NHTSA vPIC catalog.`,
    availableModelsCount: models.length,
    matchingInventory: allMatchingInventory,
    inventoryCategoryLinks,
    fitmentNotice,
  };
}

/**
 * Validates a VIN format offline (17 chars, no I/O/Q, check-digit algorithm).
 */
export function validateVinFormat(vin: string): {
  isValidFormat: boolean;
  checkDigitValid: boolean;
  cleanVin: string;
  error?: string;
} {
  const cleanVin = (vin || '').trim().toUpperCase();

  if (cleanVin.length !== 17) {
    return {
      isValidFormat: false,
      checkDigitValid: false,
      cleanVin,
      error: `VIN must be exactly 17 characters (received ${cleanVin.length}).`,
    };
  }

  if (/[IOQ]/.test(cleanVin)) {
    return {
      isValidFormat: false,
      checkDigitValid: false,
      cleanVin,
      error: 'VIN cannot contain letters I, O, or Q (to prevent confusion with numerals 1 and 0).',
    };
  }

  // Use wrapper isValidVin helper
  let checkDigitValid = false;
  try {
    checkDigitValid = wrapperIsValidVin(cleanVin);
  } catch {
    checkDigitValid = false;
  }

  return {
    isValidFormat: true,
    checkDigitValid,
    cleanVin,
  };
}

/**
 * Decodes a VIN using NHTSA vPIC DecodeVinValues with error inspection and discrepancy detection.
 */
export async function decodeVin(
  vin: string,
  selectedYear?: number,
  selectedMake?: string,
  selectedModel?: string
): Promise<DecodedVehicle> {
  const formatValidation = validateVinFormat(vin);
  if (!formatValidation.isValidFormat) {
    throw new Error(formatValidation.error || 'Invalid VIN format.');
  }

  const cleanVin = formatValidation.cleanVin;
  const cacheKey = `nhtsa_vin_${cleanVin}_${selectedYear || 'noyear'}`;
  let baseDecoded = getFromCache<DecodedVehicle>(cacheKey);

  if (!baseDecoded) {
    let rawResult: Record<string, string> = {};

    try {
      const res = await withTimeout(
        wrapperDecodeVinValues(cleanVin, selectedYear ? { modelYear: selectedYear } : undefined),
        8000,
        `NHTSA DecodeVinValues(${cleanVin})`
      );
      if (res && Array.isArray(res.Results) && res.Results.length > 0) {
        rawResult = res.Results[0] as unknown as Record<string, string>;
      }
    } catch (err) {
      console.warn(`Wrapper DecodeVinValues failed for ${cleanVin}, falling back to direct REST:`, err);
      try {
        const res = await decodeVinDirect(cleanVin, selectedYear, 8000);
        if (res && Array.isArray(res.Results) && res.Results.length > 0) {
          rawResult = res.Results[0];
        }
      } catch (directErr) {
        console.error(`Direct DecodeVinValues failed for ${cleanVin}:`, directErr);
        throw directErr;
      }
    }

    const make = (rawResult.Make || '').trim();
    const model = (rawResult.Model || '').trim();
    const modelYear = (rawResult.ModelYear || '').trim();
    const errorCode = (rawResult.ErrorCode || '').trim();
    const errorText = (rawResult.ErrorText || '').trim();
    const additionalErrorText = (rawResult.AdditionalErrorText || '').trim();
    const isDecodeClean = errorCode === '0' || errorCode === '';

    baseDecoded = {
      vin: cleanVin,
      isValidFormat: formatValidation.isValidFormat,
      checkDigitValid: formatValidation.checkDigitValid,
      make,
      model,
      modelYear,
      trim: (rawResult.Trim || '').trim(),
      series: (rawResult.Series || '').trim(),
      bodyClass: (rawResult.BodyClass || '').trim(),
      vehicleType: (rawResult.VehicleType || '').trim(),
      driveType: (rawResult.DriveType || '').trim(),
      displacementL: (rawResult.DisplacementL || '').trim(),
      engineCylinders: (rawResult.EngineCylinders || '').trim(),
      fuelTypePrimary: (rawResult.FuelTypePrimary || '').trim(),
      transmissionStyle: (rawResult.TransmissionStyle || '').trim(),
      plantCountry: (rawResult.PlantCountry || '').trim(),
      plantCity: (rawResult.PlantCity || '').trim(),
      manufacturer: (rawResult.Manufacturer || '').trim(),
      errorCode,
      errorText,
      additionalErrorText,
      isDecodeClean,
      hasDiscrepancy: false,
      rawAttributes: rawResult,
    };

    // Cache base decoded vehicle for 1 hour
    setInCache(cacheKey, baseDecoded, 60 * 60 * 1000);
  }

  // Evaluate discrepancy against caller's specific parameters
  let hasDiscrepancy = false;
  let discrepancyMessage: string | undefined;

  if (selectedMake && baseDecoded.make && selectedMake.trim().toUpperCase() !== baseDecoded.make.toUpperCase()) {
    hasDiscrepancy = true;
    discrepancyMessage = `Discrepancy detected: You selected make "${selectedMake}", but VIN decodes to "${baseDecoded.make}".`;
  } else if (selectedModel && baseDecoded.model && selectedModel.trim().toUpperCase() !== baseDecoded.model.toUpperCase()) {
    hasDiscrepancy = true;
    discrepancyMessage = `Discrepancy detected: You selected model "${selectedModel}", but VIN decodes to "${baseDecoded.model}".`;
  } else if (selectedYear && baseDecoded.modelYear && String(selectedYear).trim() !== baseDecoded.modelYear) {
    hasDiscrepancy = true;
    discrepancyMessage = `Discrepancy detected: You selected model year "${selectedYear}", but VIN decodes to "${baseDecoded.modelYear}".`;
  }

  return {
    ...baseDecoded,
    hasDiscrepancy,
    discrepancyMessage,
  };

  // Cache for 1 hour
  setInCache(cacheKey, decoded, 60 * 60 * 1000);
  return decoded;
}
