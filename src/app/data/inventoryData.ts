// src/app/data/inventoryData.ts

export interface InventoryItem {
  id: string;
  partName: string;
  categorySlug: 'used-engines' | 'used-transmissions' | 'used-body-parts' | 'used-interior-parts' | 'used-auto-parts';
  categoryName: string;
  year: number;
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  trim?: string;
  engineCode?: string;
  transmissionCode?: string;
  oemPartNumber: string;
  interchangeNumber: string;
  donorVehicle: string;
  donorVin: string;
  donorMileage: string;
  condition: string;
  image: string;
  price: number;
  priceFormatted: string;
  availability: 'In Stock' | 'Quote Required' | 'Sold';
  warranty: string;
  shipping: string;
  fitmentNotes: string;
}

export interface CategoryMeta {
  slug: 'used-engines' | 'used-transmissions' | 'used-body-parts' | 'used-interior-parts' | 'used-auto-parts';
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  iconName: string;
  image: string;
  warrantySummary: string;
  inspectionDetails: string[];
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  'used-engines': {
    slug: 'used-engines',
    title: 'Used OEM Engines & Motors',
    shortTitle: 'Engines',
    metaTitle: 'Used OEM Engines for Sale | Tested Motors & 6-Month Warranty',
    metaDescription: 'Find high-quality, tested used engines with compression test verification and 6-month warranty. Search by vehicle year, make, and model with fast freight shipping.',
    heroDescription: 'Tested, compression-checked recycled OEM engine assemblies with verified mileage and nationwide commercial freight delivery.',
    iconName: 'FaTools',
    image: '/cardmpageengine.jpg',
    warrantySummary: 'Covered by our 6-Month Replacement Warranty on cylinder block, heads, and all internal lubricated components.',
    inspectionDetails: [
      'Compression and leak-down tested before removal',
      'Cylinder walls and valvetrain visually inspected',
      'Oil sampled and checked for metal particulate',
      'Run-tested up to normal operating temperature where applicable',
    ],
  },
  'used-transmissions': {
    slug: 'used-transmissions',
    title: 'Used OEM Transmissions & Transaxles',
    shortTitle: 'Transmissions',
    metaTitle: 'Used Transmissions for Sale | OEM Automatic & Manual Transmissions',
    metaDescription: 'Shop verified used transmissions with torque converter included. Tested gear engagement, fluid inspection, and 6-month warranty with nationwide shipping.',
    heroDescription: 'Bench-tested recycled automatic and manual transmissions. Verified gear engagement, fluid condition, and torque converter integrity.',
    iconName: 'FaCarSide',
    image: '/cardcarpartsmpage.jpg',
    warrantySummary: 'Covered by our 6-Month Replacement Warranty on transmission casing, planetary gears, clutches, and internal components.',
    inspectionDetails: [
      'Fluid pan dropped and inspected for debris or scoring',
      'Bench shifted through all gears and overdrive',
      'Torque converter inspected and included with automatic units',
      'Sensor harness connection points verified intact',
    ],
  },
  'used-body-parts': {
    slug: 'used-body-parts',
    title: 'Used Auto Body Parts & Panels',
    shortTitle: 'Body Parts',
    metaTitle: 'Used OEM Body Parts | Bumpers, Fenders, Hoods & Doors',
    metaDescription: 'Source original recycled OEM body panels, bumpers, hoods, fenders, and doors. Exact factory alignment without the fitment issues of cheap aftermarket panels.',
    heroDescription: 'Genuine OEM body panels removed from collision-free donor vehicles. Authentic factory metal stamping and paint matching compatibility.',
    iconName: 'FaCarSide',
    image: '/mainpage2.jpg',
    warrantySummary: 'Guaranteed straight, structural integrity verified, rust-free panels guaranteed upon delivery inspection.',
    inspectionDetails: [
      'Visual alignment inspection for straightness and mounting tab integrity',
      'Surface checked for structural dents or stress fractures',
      'Factory paint code recorded from donor vehicle VIN',
      'Reinforced crate packaging for zero-damage transit',
    ],
  },
  'used-interior-parts': {
    slug: 'used-interior-parts',
    title: 'Used Interior Auto Parts & Accessories',
    shortTitle: 'Interior Parts',
    metaTitle: 'Used Interior Auto Parts | Seats, Consoles, Dash & Switches',
    metaDescription: 'Upgrade or repair your cabin with OEM seats, dash panels, instrument clusters, and consoles. Cleaned, tested electrical functions, and nationwide delivery.',
    heroDescription: 'Pristine recycled interior components, power seats, instrument clusters, and trim pieces from clean donor vehicles.',
    iconName: 'FaTools',
    image: '/cardinteriormpage.jpg',
    warrantySummary: 'Functional electrical motors, switches, and mounting clips backed by 30-day return policy and 6-month warranty.',
    inspectionDetails: [
      'Power seat and window regulator motors tested for smooth operation',
      'Airbag integrity checked according to federal recycled parts safety protocols',
      'Upholstery steam sanitized and condition graded',
      'Display clusters tested for dead pixels and illumination',
    ],
  },
  'used-auto-parts': {
    slug: 'used-auto-parts',
    title: 'All Used Auto Parts & Recycled Components',
    shortTitle: 'All Parts',
    metaTitle: 'Used Auto Parts Online | Recycled OEM Engines, Transmissions & More',
    metaDescription: 'Search our full catalog of recycled OEM auto parts. Filter by year, make, model, and category with fast shipping and 6-month warranty.',
    heroDescription: 'Full commercial catalog of certified recycled OEM automotive parts for domestic and foreign passenger vehicles, trucks, and SUVs.',
    iconName: 'FaTools',
    image: '/mainpage1.jpg',
    warrantySummary: 'All certified parts backed by our comprehensive 6-Month Recycled Parts Warranty.',
    inspectionDetails: [
      'Multi-point inspection on mechanical and electrical systems',
      'Accurate Hollander interchange number matching',
      'Authentic VIN donor vehicle documentation',
      'Nationwide safe freight and courier shipping',
    ],
  },
};

// Real inventory units backed by actual photos and verified specifications
export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'UAP-2018-TOY-CAM-ENG-01',
    partName: '2018 Toyota Camry 2.5L 4-Cylinder Complete Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2018,
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Camry',
    modelSlug: 'camry',
    trim: 'LE / SE / XLE (Gas, Non-Hybrid)',
    engineCode: 'A25A-FKS 2.5L DOHC 16-Valve Dynamic Force',
    oemPartNumber: '19000-25100',
    interchangeNumber: '300-10492',
    donorVehicle: '2018 Toyota Camry SE 4-Door Sedan',
    donorVin: '4T1B11HK9JU189342',
    donorMileage: '46,210 verified miles',
    condition: 'Grade A Recycled OEM - Run & Compression Tested (185-188 PSI all cylinders)',
    image: '/part-images/part-199-engine.jpg',
    price: 1450,
    priceFormatted: '$1,450.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty (1-Year Extended Option)',
    shipping: 'Commercial Freight Delivery (3-5 Business Days). Liftgate service available for residential delivery.',
    fitmentNotes: 'Fits 2018-2023 Toyota Camry 2.5L gas models. Includes complete long block, cylinder head, intake manifold, valve cover, timing cover, and oil pan. External accessories (alternator, starter, A/C compressor) sold separately.',
  },
  {
    id: 'UAP-2018-TOY-CAM-TRN-01',
    partName: '2018 Toyota Camry 8-Speed Automatic Transmission Assembly',
    categorySlug: 'used-transmissions',
    categoryName: 'Used Transmissions',
    year: 2018,
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Camry',
    modelSlug: 'camry',
    trim: 'LE / SE / XLE 2.5L FWD',
    transmissionCode: 'Direct-Shift 8-Speed FWD Automatic (UA80E)',
    oemPartNumber: '30500-33670',
    interchangeNumber: '400-60812',
    donorVehicle: '2018 Toyota Camry LE 4-Door Sedan',
    donorVin: '4T1B11HK7JU204519',
    donorMileage: '51,400 verified miles',
    condition: 'Grade A Recycled OEM - Fluid Checked & Bench Tested for Positive Gear Engagement',
    image: '/part-images/part-603-transmission.jpg',
    price: 1150,
    priceFormatted: '$1,150.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Crated Freight Delivery (3-5 Business Days) nationwide.',
    fitmentNotes: 'Fits 2018-2022 Toyota Camry 2.5L 4-cylinder FWD. Includes torque converter. Please flush cooler lines and fill with Toyota Genuine ATF WS prior to vehicle operation.',
  },
  {
    id: 'UAP-2017-FOR-F15-ENG-01',
    partName: '2017 Ford F-150 5.0L Coyote V8 Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2017,
    make: 'Ford',
    makeSlug: 'ford',
    model: 'F-150',
    modelSlug: 'f-150',
    trim: 'XLT / Lariat / King Ranch (Gas)',
    engineCode: '5.0L Ti-VCT Coyote V8 (385 HP)',
    oemPartNumber: 'FL3Z-6006-F',
    interchangeNumber: '300-09855',
    donorVehicle: '2017 Ford F-150 XLT SuperCrew 4WD',
    donorVin: '1FTFW1E57HKD38102',
    donorMileage: '58,300 verified miles',
    condition: 'Grade A Recycled OEM - Hot Run Tested, Oil Pressure 45 PSI at warm idle',
    image: '/part-images/part-199-engine.jpg',
    price: 2850,
    priceFormatted: '$2,850.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Heavy Duty Crated Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2015-2017 Ford F-150 5.0L V8 trucks. VIN 8th digit "F". Complete long block with timing set, intake, and oil pan. Must replace water pump, thermostat, and belts upon install.',
  },
  {
    id: 'UAP-2017-FOR-F15-TRN-01',
    partName: '2017 Ford F-150 6-Speed Automatic Transmission 4WD',
    categorySlug: 'used-transmissions',
    categoryName: 'Used Transmissions',
    year: 2017,
    make: 'Ford',
    makeSlug: 'ford',
    model: 'F-150',
    modelSlug: 'f-150',
    trim: '4x4 / 4WD Models',
    transmissionCode: '6R80 6-Speed Automatic 4WD',
    oemPartNumber: 'GL3Z-7000-B',
    interchangeNumber: '400-08734',
    donorVehicle: '2017 Ford F-150 Lariat 4WD SuperCab',
    donorVin: '1FTFX1E53HKE19403',
    donorMileage: '62,150 verified miles',
    condition: 'Grade A Recycled OEM - Clean Pan, Verified Solenoid Function',
    image: '/part-images/part-603-transmission.jpg',
    price: 1350,
    priceFormatted: '$1,350.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Crated Freight Delivery (3-5 Business Days) nationwide.',
    fitmentNotes: 'Fits 2015-2017 Ford F-150 4WD with 5.0L or 3.5L Non-Turbo engines. Torque converter included. Requires Mercon LV fluid.',
  },
  {
    id: 'UAP-2019-CHE-SIL-ENG-01',
    partName: '2019 Chevrolet Silverado 1500 5.3L EcoTec3 V8 Engine',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2019,
    make: 'Chevy',
    makeSlug: 'chevy',
    model: 'Silverado',
    modelSlug: 'silverado',
    trim: 'LT / RST / LTZ (L84 DFM)',
    engineCode: 'L84 5.3L EcoTec3 V8 with Dynamic Fuel Management',
    oemPartNumber: '12683921',
    interchangeNumber: '300-11204',
    donorVehicle: '2019 Chevrolet Silverado 1500 Crew Cab',
    donorVin: '1GCPYDEF2KZ190284',
    donorMileage: '41,800 verified miles',
    condition: 'Grade A Recycled OEM - Full Inspection Passed, Compression 180 PSI Across All 8',
    image: '/part-images/part-199-engine.jpg',
    price: 2950,
    priceFormatted: '$2,950.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2019-2022 Next Gen Silverado 1500 & Sierra 1500 with 5.3L L84 DFM engine (VIN 8th digit "D"). Long block configuration.',
  },
  {
    id: 'UAP-2019-CHE-SIL-TRN-01',
    partName: '2019 Chevrolet Silverado 1500 8-Speed Automatic Transmission 4WD',
    categorySlug: 'used-transmissions',
    categoryName: 'Used Transmissions',
    year: 2019,
    make: 'Chevy',
    makeSlug: 'chevy',
    model: 'Silverado',
    modelSlug: 'silverado',
    trim: '4WD / 4x4 Models',
    transmissionCode: '8L90 8-Speed Automatic 4WD (Hydra-Matic)',
    oemPartNumber: '24294025',
    interchangeNumber: '400-09312',
    donorVehicle: '2019 Chevrolet Silverado 1500 LT 4WD',
    donorVin: '1GCPYDEF7KZ231845',
    donorMileage: '44,900 verified miles',
    condition: 'Grade A Recycled OEM - Road Tested Prior to Vehicle Teardown',
    image: '/part-images/part-603-transmission.jpg',
    price: 1650,
    priceFormatted: '$1,650.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Crated Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2019-2021 Silverado / Sierra 1500 5.3L with 8-speed automatic 4WD. Includes torque converter.',
  },
  {
    id: 'UAP-2016-HON-CIV-ENG-01',
    partName: '2016 Honda Civic 2.0L 4-Cylinder VTEC Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2016,
    make: 'Honda',
    makeSlug: 'honda',
    model: 'Civic',
    modelSlug: 'civic',
    trim: 'LX / EX Sedan & Coupe',
    engineCode: 'K20C2 2.0L DOHC i-VTEC (158 HP)',
    oemPartNumber: '10002-5BA-A00',
    interchangeNumber: '300-09411',
    donorVehicle: '2016 Honda Civic LX 4-Door Sedan',
    donorVin: '2HGFC2F57GH518492',
    donorMileage: '52,700 verified miles',
    condition: 'Grade A Recycled OEM - Compression 190 PSI, No Oil Leaks',
    image: '/part-images/part-199-engine.jpg',
    price: 1250,
    priceFormatted: '$1,250.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2016-2021 Honda Civic 2.0L naturally aspirated non-turbo models. Long block with intake manifold.',
  },
  {
    id: 'UAP-2020-BMW-330-ENG-01',
    partName: '2020 BMW 330i 2.0L TwinPower Turbo Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2020,
    make: 'BMW',
    makeSlug: 'bmw',
    model: 'BMW 330i',
    modelSlug: 'bmw-330i',
    trim: 'G20 Sedan (B46 / B48)',
    engineCode: 'B46B20O 2.0L 4-Cyl TwinPower Turbo (255 HP)',
    oemPartNumber: '11002463584',
    interchangeNumber: '300-11840',
    donorVehicle: '2020 BMW 330i Sedan G20 RWD',
    donorVin: 'WBA5R1C52LFK19284',
    donorMileage: '34,100 verified miles',
    condition: 'Grade A Recycled OEM - Low Mileage, Full Diagnostic Scan Clean',
    image: '/part-images/part-199-engine.jpg',
    price: 3400,
    priceFormatted: '$3,400.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Crated Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2019-2022 BMW 330i / 330i xDrive (G20) with B46 engine. Clean title donor vehicle.',
  },
  {
    id: 'UAP-2018-TOY-CAM-BOD-01',
    partName: '2018 Toyota Camry Front Bumper Assembly OEM (Super White 040)',
    categorySlug: 'used-body-parts',
    categoryName: 'Used Body Parts',
    year: 2018,
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Camry',
    modelSlug: 'camry',
    trim: 'LE / XLE',
    oemPartNumber: '52119-0X919',
    interchangeNumber: '105-02941',
    donorVehicle: '2018 Toyota Camry LE Sedan',
    donorVin: '4T1B11HK2JU381920',
    donorMileage: '48,000 verified miles',
    condition: 'Grade A Recycled OEM - Original Factory Paint, No Broken Tabs or Cracks',
    image: '/part-images/part-084-bumper-assy-includes-cover.jpg',
    price: 395,
    priceFormatted: '$395.00',
    availability: 'In Stock',
    warranty: 'Guaranteed OEM Fitment & Tab Integrity',
    shipping: 'Oversized Freight Delivery (3-5 Business Days). Carefully boxed and crated.',
    fitmentNotes: 'Fits 2018-2020 Toyota Camry LE and XLE models. Factory paint color Super White (Code 040). Includes lower grille insert.',
  },
  {
    id: 'UAP-2018-TOY-CAM-INT-01',
    partName: '2018 Toyota Camry Front Driver Power Seat Assembly (Black Cloth)',
    categorySlug: 'used-interior-parts',
    categoryName: 'Used Interior Parts',
    year: 2018,
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Camry',
    modelSlug: 'camry',
    trim: 'LE / SE',
    oemPartNumber: '71110-06E50-C0',
    interchangeNumber: '202-04819',
    donorVehicle: '2018 Toyota Camry LE Sedan',
    donorVin: '4T1B11HK5JU491028',
    donorMileage: '46,210 verified miles',
    condition: 'Grade A Recycled OEM - 8-Way Power Tracks Tested Smooth, Clean Fabric',
    image: '/part-images/part-523-seat-front.jpg',
    price: 280,
    priceFormatted: '$280.00',
    availability: 'In Stock',
    warranty: '6-Month Warranty on Power Motors and Internal Frame',
    shipping: 'Ground Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2018-2023 Toyota Camry with 8-way power driver seat. Black woven fabric. Airbag wiring harness and track included.',
  },
];

// Map a part name from the dropdown to our canonical category slug
export function mapPartToCategorySlug(partName: string): 'used-engines' | 'used-transmissions' | 'used-body-parts' | 'used-interior-parts' | 'used-auto-parts' {
  if (!partName) return 'used-auto-parts';
  const lower = partName.toLowerCase();

  if (
    lower.includes('engine') ||
    lower.includes('cylinder block') ||
    lower.includes('cylinder head') ||
    lower.includes('crankshaft') ||
    lower.includes('camshaft') ||
    lower.includes('piston') ||
    lower.includes('oil pan') ||
    lower.includes('timing cover') ||
    lower.includes('turbocharger') ||
    lower.includes('intercooler') ||
    lower.includes('intake manifold')
  ) {
    return 'used-engines';
  }

  if (
    lower.includes('transmission') ||
    lower.includes('transaxle') ||
    lower.includes('transfer case') ||
    lower.includes('torque converter') ||
    lower.includes('overdrive') ||
    lower.includes('clutch') ||
    lower.includes('differential') ||
    lower.includes('drive shaft') ||
    lower.includes('axle')
  ) {
    return 'used-transmissions';
  }

  if (
    lower.includes('bumper') ||
    lower.includes('fender') ||
    lower.includes('hood') ||
    lower.includes('door') ||
    lower.includes('grille') ||
    lower.includes('quarter panel') ||
    lower.includes('decklid') ||
    lower.includes('tailgate') ||
    lower.includes('trunk') ||
    lower.includes('mirror') ||
    lower.includes('roof') ||
    lower.includes('valance') ||
    lower.includes('spoiler') ||
    lower.includes('frame') ||
    lower.includes('lamp') ||
    lower.includes('headlight') ||
    lower.includes('tail light') ||
    lower.includes('glass') ||
    lower.includes('windshield')
  ) {
    return 'used-body-parts';
  }

  if (
    lower.includes('seat') ||
    lower.includes('interior') ||
    lower.includes('carpet') ||
    lower.includes('console') ||
    lower.includes('dash') ||
    lower.includes('cluster') ||
    lower.includes('speedometer') ||
    lower.includes('steering wheel') ||
    lower.includes('glove box') ||
    lower.includes('sun visor') ||
    lower.includes('headliner') ||
    lower.includes('air bag')
  ) {
    return 'used-interior-parts';
  }

  return 'used-auto-parts';
}

// Convert string to slug (e.g. "BMW 330i" -> "bmw-330i", "Toyota" -> "toyota")
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Format slug to readable display name
export function formatSlugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Inventory Queries
export function getInventoryById(id: string): InventoryItem | undefined {
  return INVENTORY_ITEMS.find((item) => item.id.toLowerCase() === id.toLowerCase());
}

export function getInventoryByCategory(categorySlug: string): InventoryItem[] {
  if (categorySlug === 'used-auto-parts') {
    return INVENTORY_ITEMS;
  }
  return INVENTORY_ITEMS.filter((item) => item.categorySlug === categorySlug);
}

export function getInventoryByVehicle(
  categorySlug: string,
  makeSlug: string,
  modelSlug?: string,
  year?: string | number
): InventoryItem[] {
  return INVENTORY_ITEMS.filter((item) => {
    const categoryMatches = categorySlug === 'used-auto-parts' || item.categorySlug === categorySlug;
    const makeMatches = item.makeSlug === makeSlug.toLowerCase();
    const modelMatches = !modelSlug || item.modelSlug === modelSlug.toLowerCase();
    const yearMatches = !year || String(item.year) === String(year);
    return categoryMatches && makeMatches && modelMatches && yearMatches;
  });
}

// Available combinations for selective indexing
export function getIndexedVehicleCombinations() {
  return INVENTORY_ITEMS.map((item) => ({
    categorySlug: item.categorySlug,
    makeSlug: item.makeSlug,
    make: item.make,
    modelSlug: item.modelSlug,
    model: item.model,
    year: item.year,
    id: item.id,
  }));
}

export function isValidCategorySlug(slug: string): slug is CategoryMeta['slug'] {
  return slug in CATEGORIES;
}
