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
    image: '/part-images/2021-toyota-camry-2.5l-engine.jpg',
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
    image: '/part-images/2018-toyota-camry-8-speed-automatic-transmission.jpg',
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
    image: '/part-images/2018-ford-f-150-5.0l-coyote-engine.jpg',
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
    image: '/part-images/2021-ford-f-150-10r80-transmission.jpg',
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
    image: '/part-images/2019-chevrolet-silverado-1500-5.3l-ecotec3-engine.jpg',
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
    image: '/part-images/2021-chevrolet-silverado-1500-automatic-transmission.jpg',
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
    image: '/part-images/2016-honda-accord-2.4l-k24w-engine-assembly.jpg',
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
    image: '/part-images/330i-2.0l-twinpower-turbo-engine-assembly.jpeg',
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
    image: '/mainpage2.jpg',
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
    image: '/part-images/2018-toyota-camry-2018-toyota-camry-front-driver-power-seat.jpeg',
    price: 280,
    priceFormatted: '$280.00',
    availability: 'In Stock',
    warranty: '6-Month Warranty on Power Motors and Internal Frame',
    shipping: 'Ground Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2018-2023 Toyota Camry with 8-way power driver seat. Black woven fabric. Airbag wiring harness and track included.',
  },
  {
    id: 'UAP-2015-NIS-ALT-ENG-01',
    partName: '2015 Nissan Altima 2.5L QR25DE Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2015,
    make: 'Nissan',
    makeSlug: 'nissan',
    model: 'Altima',
    modelSlug: 'altima',
    trim: 'S / SV / SL',
    engineCode: 'QR25DE 2.5L DOHC 16-Valve 4-Cylinder (182 HP)',
    oemPartNumber: '10102-3TA0A',
    interchangeNumber: '300-08945',
    donorVehicle: '2015 Nissan Altima SV 4-Door Sedan',
    donorVin: '1N4AL3AP7FC219473',
    donorMileage: '55,800 verified miles',
    condition: 'Grade A Recycled OEM - Compression Tested 178-182 PSI All Cylinders',
    image: '/part-images/2015-nissan-altima-2.5l-qr25de-engine-assembly.jpg',
    price: 1150,
    priceFormatted: '$1,150.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2013-2018 Nissan Altima 2.5L (VIN A, 4th digit). Complete long block with intake manifold and valve cover. Accessories sold separately.',
  },
  {
    id: 'UAP-2015-TOY-RAV-ENG-01',
    partName: '2015 Toyota RAV4 2.5L 4-Cylinder Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2015,
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'RAV4',
    modelSlug: 'rav4',
    trim: 'LE / XLE / Limited (FWD & AWD)',
    engineCode: '2AR-FE 2.5L DOHC 16-Valve Dual VVT-i (176 HP)',
    oemPartNumber: '19000-36420',
    interchangeNumber: '300-09034',
    donorVehicle: '2015 Toyota RAV4 XLE AWD',
    donorVin: '2T3RFREV5FW298341',
    donorMileage: '61,200 verified miles',
    condition: 'Grade A Recycled OEM - Run Tested, Oil Pressure Verified at Operating Temperature',
    image: '/part-images/2015-toyota-rav4-2.5l-engine-assembly.jpg',
    price: 1350,
    priceFormatted: '$1,350.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2013-2018 Toyota RAV4 2.5L gas models. Complete long block assembly. Compatible with FWD and AWD configurations.',
  },
  {
    id: 'UAP-2016-RAM-150-ENG-01',
    partName: '2016 Ram 1500 5.7L HEMI V8 Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2016,
    make: 'Ram',
    makeSlug: 'ram',
    model: '1500',
    modelSlug: '1500',
    trim: 'Sport / Laramie / Big Horn',
    engineCode: '5.7L HEMI V8 MDS VVT (395 HP)',
    oemPartNumber: '68303088AA',
    interchangeNumber: '300-09621',
    donorVehicle: '2016 Ram 1500 Big Horn Crew Cab 4WD',
    donorVin: '1C6RR7LT0GS284019',
    donorMileage: '53,400 verified miles',
    condition: 'Grade A Recycled OEM - Compression 175-180 PSI All 8 Cylinders, MDS Solenoids Tested',
    image: '/part-images/2016-ram-1500-5.7l-hemi-engine-assembly.jpg',
    price: 2650,
    priceFormatted: '$2,650.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Heavy Duty Crated Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2013-2018 Ram 1500 5.7L HEMI (VIN 8th digit "T"). Long block with MDS hardware. Exhaust manifolds and accessories sold separately.',
  },
  {
    id: 'UAP-2017-FOR-ESC-ENG-01',
    partName: '2017 Ford Escape 1.5L EcoBoost Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2017,
    make: 'Ford',
    makeSlug: 'ford',
    model: 'Escape',
    modelSlug: 'escape',
    trim: 'SE / Titanium (FWD & AWD)',
    engineCode: '1.5L EcoBoost GTDI I4 Turbo (179 HP)',
    oemPartNumber: 'CV6Z-6006-A',
    interchangeNumber: '300-09510',
    donorVehicle: '2017 Ford Escape SE AWD',
    donorVin: '1FMCU9GD5HUA63281',
    donorMileage: '59,100 verified miles',
    condition: 'Grade A Recycled OEM - Turbo Boost Tested, No Oil Consumption Issues',
    image: '/part-images/2017-ford-escape-1.5l-ecoboost-engine-assembly.jpg',
    price: 1550,
    priceFormatted: '$1,550.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2017-2019 Ford Escape 1.5L EcoBoost. Includes turbocharger and intake manifold. Coolant hoses and belts should be replaced upon install.',
  },
  {
    id: 'UAP-2017-JEP-GCH-ENG-01',
    partName: '2017 Jeep Grand Cherokee 3.6L Pentastar V6 Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2017,
    make: 'Jeep',
    makeSlug: 'jeep',
    model: 'Grand Cherokee',
    modelSlug: 'grand-cherokee',
    trim: 'Laredo / Limited / Overland',
    engineCode: '3.6L Pentastar V6 DOHC 24-Valve VVT (295 HP)',
    oemPartNumber: '68293095AA',
    interchangeNumber: '300-09744',
    donorVehicle: '2017 Jeep Grand Cherokee Laredo 4WD',
    donorVin: '1C4RJFAG1HC874512',
    donorMileage: '48,700 verified miles',
    condition: 'Grade A Recycled OEM - Compression Verified, No Oil Leaks, Timing Chains Inspected',
    image: '/part-images/2017-jeep-grand-cherokee-3.6l-pentastar-engine-assembly.jpg',
    price: 1850,
    priceFormatted: '$1,850.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2016-2018 Jeep Grand Cherokee 3.6L Pentastar. Also fits 2016-2018 Chrysler 300 and Dodge Charger 3.6L. Long block with cylinder heads.',
  },
  {
    id: 'UAP-2017-NIS-ROG-TRN-01',
    partName: '2017 Nissan Rogue CVT Automatic Transmission Assembly',
    categorySlug: 'used-transmissions',
    categoryName: 'Used Transmissions',
    year: 2017,
    make: 'Nissan',
    makeSlug: 'nissan',
    model: 'Rogue',
    modelSlug: 'rogue',
    trim: 'S / SV / SL (FWD & AWD)',
    transmissionCode: 'JF016E (RE0F10D) CVT Continuously Variable',
    oemPartNumber: '310C0-3VX2C',
    interchangeNumber: '400-08901',
    donorVehicle: '2017 Nissan Rogue SV AWD',
    donorVin: '5N1AT2MV0HC812934',
    donorMileage: '47,300 verified miles',
    condition: 'Grade A Recycled OEM - Road Tested, No Shudder or Slipping',
    image: '/part-images/2017-nissan-rogue-cvt-transmission.jpg',
    price: 1250,
    priceFormatted: '$1,250.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Crated Freight Delivery (3-5 Business Days) nationwide.',
    fitmentNotes: 'Fits 2014-2020 Nissan Rogue 2.5L with CVT. FWD and AWD compatible. Flush CVT fluid with Nissan NS-3 before operation.',
  },
  {
    id: 'UAP-2018-CHE-MAL-ENG-01',
    partName: '2018 Chevrolet Malibu 1.5L Turbo Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2018,
    make: 'Chevy',
    makeSlug: 'chevy',
    model: 'Malibu',
    modelSlug: 'malibu',
    trim: 'L / LS / LT',
    engineCode: 'LFV 1.5L Turbo DOHC 4-Cylinder (160 HP)',
    oemPartNumber: '12682092',
    interchangeNumber: '300-10103',
    donorVehicle: '2018 Chevrolet Malibu LT 4-Door Sedan',
    donorVin: '1G1ZD5ST9JF204718',
    donorMileage: '43,600 verified miles',
    condition: 'Grade A Recycled OEM - Turbo System Verified, Clean Oil Sample',
    image: '/part-images/2018-chevrolet-malibu-1.5l-turbo-engine-assembly.jpg',
    price: 1350,
    priceFormatted: '$1,350.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2016-2020 Chevrolet Malibu 1.5L Turbo (LFV engine code). Also fits 2018-2021 Chevrolet Equinox 1.5T. Long block with turbo.',
  },
  {
    id: 'UAP-2018-TOY-CAM-INT-02',
    partName: '2018 Toyota Camry Front Passenger Power Seat Assembly (Black Cloth)',
    categorySlug: 'used-interior-parts',
    categoryName: 'Used Interior Parts',
    year: 2018,
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Camry',
    modelSlug: 'camry',
    trim: 'SE / XSE',
    oemPartNumber: '71610-06E50-C0',
    interchangeNumber: '202-04820',
    donorVehicle: '2018 Toyota Camry SE Sedan',
    donorVin: '4T1B11HK0JU327841',
    donorMileage: '39,800 verified miles',
    condition: 'Grade A Recycled OEM - 4-Way Power Tracks Tested Smooth, No Tears or Stains',
    image: '/part-images/2018-toyota-camry-2018-toyota-camry-front-driver-power-seat-2.jpeg',
    price: 245,
    priceFormatted: '$245.00',
    availability: 'In Stock',
    warranty: '6-Month Warranty on Power Motors and Internal Frame',
    shipping: 'Ground Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2018-2023 Toyota Camry with power passenger seat. Black woven fabric. Track and wiring harness included.',
  },
  {
    id: 'UAP-2021-FOR-F15-ENG-01',
    partName: '2021 Ford F-150 5.0L V8 Coyote Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2021,
    make: 'Ford',
    makeSlug: 'ford',
    model: 'F-150',
    modelSlug: 'f-150',
    trim: 'XLT / Lariat / King Ranch / Platinum',
    engineCode: '5.0L Coyote V8 Gen 4 Ti-VCT (400 HP)',
    oemPartNumber: 'ML3Z-6006-A',
    interchangeNumber: '300-11580',
    donorVehicle: '2021 Ford F-150 Lariat SuperCrew 4WD',
    donorVin: '1FTFW1E58MFA42910',
    donorMileage: '32,400 verified miles',
    condition: 'Grade A Recycled OEM - Low Mileage, Hot Run Tested, Oil Pressure 48 PSI at Warm Idle',
    image: '/part-images/2021-ford-f-150-5.0l-v8-engine-assembly.jpg',
    price: 3250,
    priceFormatted: '$3,250.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty (1-Year Extended Option)',
    shipping: 'Heavy Duty Crated Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2021-2023 Ford F-150 5.0L V8 (14th gen). VIN 8th digit "F". Complete long block. Water pump and thermostat replacement recommended upon install.',
  },
  {
    id: 'UAP-2021-HON-ACC-ENG-01',
    partName: '2021 Honda Accord 1.5L Turbo VTEC Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2021,
    make: 'Honda',
    makeSlug: 'honda',
    model: 'Accord',
    modelSlug: 'accord',
    trim: 'LX / Sport / EX / EX-L',
    engineCode: 'L15BE 1.5L Turbo DOHC 16-Valve VTEC (192 HP)',
    oemPartNumber: '10002-6A2-A00',
    interchangeNumber: '300-11392',
    donorVehicle: '2021 Honda Accord Sport 4-Door Sedan',
    donorVin: '1HGCV1F34MA019284',
    donorMileage: '37,200 verified miles',
    condition: 'Grade A Recycled OEM - Turbo Inspected, Compression 185 PSI All Cylinders',
    image: '/part-images/2021-honda-accord-1.5l-turbo-engine.jpg',
    price: 1650,
    priceFormatted: '$1,650.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2018-2022 Honda Accord 1.5L Turbo (10th gen). Long block with turbocharger and intake manifold. Use Honda 0W-20 full synthetic oil.',
  },
  {
    id: 'UAP-2021-HON-CRV-TRN-01',
    partName: '2021 Honda CR-V CVT Automatic Transmission Assembly',
    categorySlug: 'used-transmissions',
    categoryName: 'Used Transmissions',
    year: 2021,
    make: 'Honda',
    makeSlug: 'honda',
    model: 'CR-V',
    modelSlug: 'cr-v',
    trim: 'LX / EX / EX-L / Touring (FWD & AWD)',
    transmissionCode: 'CVT Continuously Variable (M4VA)',
    oemPartNumber: '20021-60K-000',
    interchangeNumber: '400-09810',
    donorVehicle: '2021 Honda CR-V EX AWD',
    donorVin: '2HKRW2H54MH641029',
    donorMileage: '41,500 verified miles',
    condition: 'Grade A Recycled OEM - Road Tested for Smooth Ratio Changes, No Vibration',
    image: '/part-images/2021-honda-cr-v-cvt-transmission.jpg',
    price: 1450,
    priceFormatted: '$1,450.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Crated Freight Delivery (3-5 Business Days) nationwide.',
    fitmentNotes: 'Fits 2017-2022 Honda CR-V 1.5L Turbo with CVT. AWD and FWD compatible. Fill with Honda HCF-2 CVT fluid only.',
  },
  {
    id: 'UAP-2022-CHE-SIL-ENG-01',
    partName: '2022 Chevrolet Silverado 1500 5.3L V8 EcoTec3 Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2022,
    make: 'Chevy',
    makeSlug: 'chevy',
    model: 'Silverado',
    modelSlug: 'silverado',
    trim: 'Custom / LT / RST / LTZ',
    engineCode: 'L84 5.3L EcoTec3 V8 with Dynamic Fuel Management (355 HP)',
    oemPartNumber: '12698070',
    interchangeNumber: '300-11890',
    donorVehicle: '2022 Chevrolet Silverado 1500 LT Crew Cab 4WD',
    donorVin: '1GCPYEEK3NZ318472',
    donorMileage: '28,900 verified miles',
    condition: 'Grade A Recycled OEM - Low Mileage, Compression 182 PSI All 8 Cylinders',
    image: '/part-images/2022-chevrolet-silverado-1500-5.3l-v8-engine.jpg',
    price: 3150,
    priceFormatted: '$3,150.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty (1-Year Extended Option)',
    shipping: 'Heavy Duty Crated Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2022-2024 Chevrolet Silverado 1500 & GMC Sierra 1500 with 5.3L L84 DFM engine. VIN 8th digit "D". Long block configuration.',
  },
  {
    id: 'UAP-2022-FOR-EXP-ENG-01',
    partName: '2022 Ford Explorer 2.3L EcoBoost Engine Assembly',
    categorySlug: 'used-engines',
    categoryName: 'Used Engines',
    year: 2022,
    make: 'Ford',
    makeSlug: 'ford',
    model: 'Explorer',
    modelSlug: 'explorer',
    trim: 'Base / XLT / Limited (RWD & 4WD)',
    engineCode: '2.3L EcoBoost DOHC I4 Turbo (300 HP)',
    oemPartNumber: 'LB5Z-6006-A',
    interchangeNumber: '300-11720',
    donorVehicle: '2022 Ford Explorer XLT 4WD',
    donorVin: '1FMSK8DH4NGA59183',
    donorMileage: '35,600 verified miles',
    condition: 'Grade A Recycled OEM - Turbo Tested, Full Diagnostic Scan Clean',
    image: '/part-images/2022-ford-explorer-2.3l-ecoboost-engine.jpg',
    price: 2450,
    priceFormatted: '$2,450.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Commercial Freight Delivery (3-5 Business Days).',
    fitmentNotes: 'Fits 2020-2023 Ford Explorer 2.3L EcoBoost (6th gen, CD6 platform). Complete long block with turbocharger. Belts and coolant hoses should be replaced upon install.',
  },
  {
    id: 'UAP-2022-TOY-CAM-TRN-01',
    partName: '2022 Toyota Camry 8-Speed Automatic Transmission Assembly',
    categorySlug: 'used-transmissions',
    categoryName: 'Used Transmissions',
    year: 2022,
    make: 'Toyota',
    makeSlug: 'toyota',
    model: 'Camry',
    modelSlug: 'camry',
    trim: 'LE / SE / XLE / XSE 2.5L FWD',
    transmissionCode: 'Direct-Shift 8-Speed FWD Automatic (UA80F)',
    oemPartNumber: '30500-33680',
    interchangeNumber: '400-10215',
    donorVehicle: '2022 Toyota Camry SE Sedan',
    donorVin: '4T1G11AK8NU894320',
    donorMileage: '29,400 verified miles',
    condition: 'Grade A Recycled OEM - Low Mileage, Fluid Clean, All Gears Verified',
    image: '/part-images/2022-toyota-camry-8-speed-automatic-transmission.jpg',
    price: 1250,
    priceFormatted: '$1,250.00',
    availability: 'In Stock',
    warranty: '6-Month Standard Replacement Warranty',
    shipping: 'Crated Freight Delivery (3-5 Business Days) nationwide.',
    fitmentNotes: 'Fits 2021-2024 Toyota Camry 2.5L 4-cylinder FWD. Includes torque converter. Fill with Toyota Genuine ATF WS.',
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
