// src/app/data/blogs/article4_gmPartsOnline.ts
import { BlogArticle } from './types';

export const article4_gmPartsOnline: BlogArticle = {
  id: 4,
  slug: 'how-to-find-gm-parts-online',
  title: 'How to Find GM Parts Online: A Complete Fitment and Identification Guide',
  seoTitle: 'How to Find GM Parts Online | RPO Codes, ACDelco Tiers & SPID Guide',
  metaDescription: 'Complete guide to sourcing genuine GM and ACDelco parts online. Learn to decode GM 8-digit part numbers, read RPO/SPID codes, and navigate shared truck platforms.',
  subtitle: 'An exhaustive technical roadmap for navigating General Motors brand hierarchy, ACDelco packaging tiers, SPID labels, RPO codes, and part number supersessions.',
  date: 'Oct 28, 2024',
  lastUpdated: 'Jan 24, 2025',
  readTime: '12 min read',
  category: 'GM Parts Specialist',
  author: {
    name: 'USA Used Auto Parts Technical Editorial Team',
    role: 'Automotive Recycling Specialists',
  },
  reviewedBy: 'GM-Certified Drivetrain & Parts Specialist',
  heroImage: {
    src: '/blogs/images/gm-genuine-parts-acdelco-tiers.jpg',
    alt: 'General Motors genuine parts and ACDelco component catalog display',
    caption: 'Navigating GM replacement parts requires understanding GM OE tiers, ACDelco branding, and RPO codes.',
  },
  keyTakeaway: {
    shortAnswer: 'Finding the correct GM part online requires three critical verification steps: identifying the exact GM brand tier (GM Genuine OE Three-Dot ●●●, ACDelco Gold Two-Dot ●●, or ACDelco Silver One-Dot ●), checking your vehicle\'s 3-character Regular Production Option (RPO) codes on the Service Parts Identification (SPID) label, and tracking GM 8-digit part number supersessions.',
    keyPoints: [
      'General Motors organizes replacement parts into three distinct tiers: GM Original Equipment (Blue metallic), ACDelco Gold (formerly Professional), and ACDelco Silver (formerly Advantage).',
      'Year/Make/Model searches frequently fail on GM vehicles due to mid-year brake (JD9 vs JH6) and suspension variations; always verify your VIN and RPO codes.',
      'RPO codes (found on the silver SPID sticker in the glove box or the modern door jamb QR code) specify the exact factory axle ratios (GU6, GT4, G80), transmission models (6L80, 8L90), and engine codes (L83, L86).',
      'Shared full-size truck architectures (GMT900, K2XX, and T1XX) allow cross-model interchange between Chevrolet Silverado, GMC Sierra, Tahoe, Yukon, and Cadillac Escalade.',
    ],
  },
  introduction: [
    'General Motors is one of the most prolific automobile manufacturers in industrial history, with an operational portfolio encompassing Chevrolet, GMC, Buick, and Cadillac, alongside legacy divisions such as Pontiac, Oldsmobile, Saturn, and Hummer. While this extensive platform sharing makes sourcing replacement parts easier, it also introduces substantial complexity.',
    'A replacement alternator, steering knuckle, or transfer case that fits a 2017 Chevrolet Silverado 1500 may not bolt onto another 2017 Silverado with a different suspension package or higher-output electrical system. Relying solely on basic Year/Make/Model drop-down menus on generic parts websites frequently leads to frustrating return shipments and stalled repair projects.',
    'To successfully locate and purchase GM parts online, buyers must understand GM\'s corporate parts architecture, ACDelco packaging tiers, 8-digit part number supersessions, and the indispensable Service Parts Identification (SPID) label. This guide delivers the insider technical knowledge required to source GM parts with precision.',
  ],
  sections: [
    {
      id: 'gm-brand-architecture-tiers',
      heading: 'General Motors Parts Hierarchy and ACDelco Tiers',
      subheading: 'Demystifying GM Original Equipment, ACDelco Gold, and ACDelco Silver',
      shortAnswer: 'GM replacement parts are categorized into three official tiers: GM Original Equipment (Blue packaging, Three-Dot ●●● icon) for true factory assembly specs; ACDelco Gold (Gold packaging, Two-Dot ●● icon, former "Professional") for premium aftermarket; and ACDelco Silver (Silver packaging, One-Dot ● icon, former "Advantage") for economical repairs.',
      paragraphs: [
        'The relationship between General Motors and its primary parts division, ACDelco, is a frequent source of consumer confusion. In recent years, GM streamlined its corporate packaging and tier nomenclature to establish distinct quality and pricing tiers.',
      ],
      table: {
        caption: 'General Motors Official Replacement Parts Classification',
        headers: ['Classification Tier', 'Packaging & Icon Identifiers', 'Engineering Standard', 'Target Vehicle Application', 'Pricing Position'],
        rows: [
          ['GM Original Equipment (OE)', 'Blue metallic packaging, Genuine GM Flag, Three dots (●●●)', 'Identical to parts installed on assembly line; full factory warranty validation', 'Warranty repairs, late-model vehicles, exact OEM restorations', 'Premium OEM dealer pricing'],
          ['ACDelco Gold', 'Gold metallic packaging, Two dots (●●), Formerly "Professional"', 'Engineered to meet GM fit, form, and function standards; manufactured by Tier-1 suppliers', 'Vehicles out of factory warranty; high-mileage daily drivers; non-GM makes', 'Mid-tier (25% to 40% below GM OE)'],
          ['ACDelco Silver', 'Silver metallic packaging, One dot (●), Formerly "Advantage"', 'High-value, cost-effective replacement alternative meeting safety standards', 'Older vehicles, budget-conscious repairs, fleet maintenance', 'Economy tier (45% to 65% below GM OE)'],
        ],
      },
      callout: {
        type: 'info',
        title: 'Packaging Visual Clues: The Dot System',
        text: 'To rapidly identify genuine GM parts, check the bottom corner of the box for the dot graphic: three dots (●●●) indicates GM Original Equipment; two dots (●●) indicates ACDelco Gold; one dot (●) indicates ACDelco Silver.',
      },
    },
    {
      id: 'rpo-spid-codes-explained',
      heading: 'The Power of GM RPO Codes and the SPID Label',
      subheading: 'How to Read Your Vehicle\'s DNA to Ensure Exact Fitment',
      shortAnswer: 'Regular Production Option (RPO) codes are 3-character alphanumeric designations specifying the exact engine, transmission, gear ratio, brake diameter, and suspension package built into your GM vehicle. They are printed on the silver SPID sticker in your glove box or encoded in the door jamb QR code.',
      paragraphs: [
        'Because General Motors offers hundreds of optional equipment combinations on identical truck and SUV bodies, standard vehicle lookups are often incomplete. For example, a 2016 Chevrolet Silverado may come equipped with JD9 light-duty vacuum brakes or JH6 heavy-duty hydraulic boost brakes. Purchasing brake calipers or rotors without verifying your RPO code results in part mismatch.',
        'The Service Parts Identification (SPID) label is the definitive factory build sheet for your specific vehicle.',
      ],
      bulletPoints: [
        'SPID Label Location: On most GM trucks, SUVs, and passenger cars built between 1985 and 2017, the silver SPID label is affixed to the inside lid of the glove box compartment, on the spare tire wheel well cover in the trunk, or on the driver/passenger B-pillar.',
        'Modern 2D QR Data Matrix: On GM vehicles manufactured from model year 2018 onward, GM transitioned from the silver SPID sticker to a 2D Data Matrix QR code printed on the driver door jamb certification label. Scanning this code with a smartphone reveals all factory RPO codes.',
        'Engine RPO Codes: Vital for engine replacement. Examples: L83 (5.3L EcoTec3 V8), L86 (6.2L EcoTec3 V8), LV3 (4.3L V6), LS3 (6.2L V8), L5P (6.6L Duramax Turbo-Diesel).',
        'Transmission RPO Codes: Designates exact geartrain. Examples: MYC (6L80 6-speed automatic), M5U (8L90 8-speed automatic), MQC (10L80 10-speed automatic).',
        'Rear Axle & Differential RPO Codes: GU6 (3.42 rear axle ratio), GT4 (3.73 rear axle ratio), G80 (Mechanical locking rear differential).',
        'Suspension Tuning RPO Codes: Z71 (Off-Road suspension package with high-capacity air cleaner and skid plates), Z85 (Heavy-Duty handling suspension), FE3 (Sport suspension), Z95 (Magnetic Ride Control electronic dampers).',
      ],
      image: {
        src: '/blogs/images/gm-service-parts-identification-spid-label.jpg',
        alt: 'Silver GM Service Parts Identification SPID label listing 3-digit RPO option codes',
        caption: 'The SPID label inside your glove box lists the 3-character RPO codes needed for suspension, axle, and engine fitment.',
      },
    },
    {
      id: 'gm-part-numbers-supersessions',
      heading: 'Understanding GM 8-Digit Part Numbers and Supersessions',
      subheading: 'Why Part Numbers Change and How to Track Engineering Updates',
      shortAnswer: 'GM uses standardized 8-digit numeric part numbers (e.g. 12674703). Over time, GM updates part designs to rectify failure points, retiring the old number and issuing a superseded part number that is backward-compatible.',
      paragraphs: [
        'When searching for GM parts online, you may find that the part number stamped onto your original factory component is listed as "discontinued" or "no longer available." This does not mean the part is extinct; rather, it has undergone part number supersession.',
        'Automakers continuously update component engineering to address Technical Service Bulletins (TSBs), reduce warranty claims, or streamline manufacturing tooling.',
      ],
      numberedSteps: [
        'Locating the 8-Digit Stamping: Inspect your original failed part. GM stamps or casts its 8-digit part number directly into engine blocks, cylinder heads, steering racks, and electronic modules.',
        'Checking Supersession Chains: When entering an original 8-digit number into our parts database, the system cross-references GM\'s engineering supersession index. For instance, GM updated its Active Fuel Management (AFM) oil pressure relief valves and lifter trays through four sequential part numbers, each fully backward-compatible with earlier production runs.',
        'Distinguishing Casting Numbers from Catalog Numbers: Engine blocks and transmission housings often display a "casting number" that differs by one or two digits from the final catalog part number. For example, a cylinder head casting #799 is physically identical to casting #243 and interchanges across multiple 4.8L, 5.3L, and 5.7L LS-series applications.',
      ],
      callout: {
        type: 'technical',
        title: 'Engineering Tip: DFM / AFM Displacement on Demand',
        text: 'On GM EcoTec3 (L83/L86) engines, GM utilizes Dynamic Fuel Management (DFM) or Active Fuel Management (AFM). When ordering replacement lifters, camshafts, or valve covers, verify whether your vehicle has 4-cylinder deactivation (AFM) or variable 17-mode cylinder deactivation (DFM) via your RPO code sheet.',
      },
      image: {
        src: '/blogs/images/gm-truck-engine-bay-inspection.jpg',
        alt: 'Underhood inspection of a modern GM V8 truck engine bay showing component layout',
        caption: 'GM V8 powertrains share architecture across Chevrolet and GMC trucks, but AFM/DFM lifter packages require exact RPO matching.',
      },
    },
    {
      id: 'gm-platform-sharing-salvage',
      heading: 'Capitalizing on Shared GM Truck and SUV Architectures',
      subheading: 'Unlocking Cross-Brand Inventory Across Silverado, Sierra, Tahoe, and Escalade',
      shortAnswer: 'General Motors builds full-size trucks and SUVs on shared full-frame architectures: GMT900 (2007–2013), K2XX (2014–2018), and T1XX (2019+). Powertrains, transfer cases, differentials, and front suspension knuckles interchange seamlessly across Chevrolet, GMC, and Cadillac models.',
      paragraphs: [
        'One of the greatest advantages of owning a General Motors vehicle is the immense pool of donor inventory available in the salvage market. Because GM shares complete drivetrains across brands, your search is never restricted to just one specific model nameplate.',
      ],
      bulletPoints: [
        'GMT900 Platform (2007–2013): 2007–2013 Chevrolet Silverado 1500, GMC Sierra 1500, Chevrolet Tahoe, Chevrolet Suburban, GMC Yukon, GMC Yukon XL, and Cadillac Escalade share 4.8L (L20), 5.3L (LMG/LC9), and 6.2L (L94) engines, 4L60E/6L80 transmissions, and 8.6-inch/9.5-inch rear axle assemblies.',
        'K2XX Platform (2014–2018): 2014–2018 Silverado/Sierra and 2015–2020 Tahoe/Suburban/Yukon share Gen-V EcoTec3 powertrains (L83 5.3L and L86 6.2L), 6L80 and 8L90 transmissions, Magna transfer cases, and high-strength stamped steel front lower control arms.',
        'T1XX Platform (2019–Present): Current generation full-size trucks and full-size SUVs sharing 10L80 10-speed transmissions, 3.0L Duramax LM2/LZ0 turbo-diesels, and independent rear suspension (IRS) modular components on SUV variants.',
        'Lambda Platform (Crossovers): Chevrolet Traverse, GMC Acadia, and Buick Enclave share 3.6L V6 engines (LLT/LFX), 6T75 transmissions, and all-wheel-drive rear differential modules.',
      ],
    },
    {
      id: 'avoiding-counterfeit-gm-parts',
      heading: 'How to Identify and Avoid Counterfeit GM and ACDelco Parts',
      subheading: 'Holographic Labels, Packaging Fonts, and Online Marketplaces',
      shortAnswer: 'Counterfeit GM and ACDelco parts (especially spark plugs, sensors, and fuel injectors) proliferate on unverified third-party marketplaces. Authenticate parts by checking for GM\'s holographic tamper-evident security labels, three-dot packaging identifiers, and precise laser-etched font markings.',
      paragraphs: [
        'The Automotive Anti-Counterfeiting Council (A2C2) reports that counterfeit automotive parts are expanding rapidly across digital retail marketplaces. Counterfeiters frequently target high-turnover GM and ACDelco maintenance parts.',
        'Installing a counterfeit ACDelco iridium spark plug can cause ceramic disintegration that scores cylinder walls and destroys an engine. Sourcing inspected recycled OEM parts from a verified salvage network guarantees authentic factory metallurgy and manufacturing.',
      ],
      bulletPoints: [
        'Holographic Security Seal: Genuine GM packaging features a multi-angle holographic security strip. When tilted under light, the GM logo, text, and micro-printed security patterns shift dynamically.',
        'Packaging Color and Typography: Counterfeit packaging frequently exhibits washed-out blue or faded gold printing, blurry barcode edges, and misspelled words in the multi-language product disclaimer.',
        'Laser Etching vs. Ink Stamping: Genuine ACDelco sensors and plugs feature crisp, permanent laser-etched part numbers. Knockoffs frequently use smeared white or black inkjet paint that rubs off with rubbing alcohol.',
        'Connector Terminal Plating: Authentic GM electrical sensors feature precision gold or tin-plated connector pins designed to resist fretting corrosion. Counterfeits use cheap untreated brass pins that corrode rapidly.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between GM Genuine Parts and ACDelco?',
      answer: 'GM Genuine Parts are the true original equipment parts installed during vehicle assembly. ACDelco is GM\'s official parts brand, offering GM Original Equipment (Blue tier), ACDelco Gold (premium aftermarket), and ACDelco Silver (high-value budget tier).',
    },
    {
      question: 'Where can I find the SPID label on my GM vehicle?',
      answer: 'On vehicles built prior to 2018, the silver SPID label is located inside the glove box compartment lid, on the spare tire well cover, or on the door jamb. On 2018+ GM models, scan the 2D Data Matrix QR code on the driver door jamb certification sticker.',
    },
    {
      question: 'Why do I need RPO codes to order GM parts?',
      answer: 'RPO codes identify the specific factory equipment installed on your vehicle (such as brake rotor diameter, axle ratio, suspension package, and transmission model), preventing mismatches caused by mid-year factory changes.',
    },
    {
      question: 'Can I use a GMC Sierra engine in a Chevrolet Silverado?',
      answer: 'Yes. The GMC Sierra and Chevrolet Silverado share identical full-size truck platforms (GMT900, K2XX, T1XX) and use the exact same 4.8L, 5.3L, 6.0L, and 6.2L V8 engines, provided your 8th digit VIN engine code matches.',
    },
    {
      question: 'What does a GM part number look like?',
      answer: 'General Motors uses standardized 8-digit numeric part numbers (e.g. 12674703 or 84335354). Over time, GM updates part designs to address engineering revisions, issuing backward-compatible superseded numbers.',
    },
    {
      question: 'What does RPO code G80 mean on a GM truck?',
      answer: 'RPO code G80 designates the Eaton mechanical locking rear differential (Gov-Lok), which automatically locks both rear wheels together when a wheel speed differential of 100+ RPM is detected.',
    },
    {
      question: 'How do I know if an online GM part is counterfeit?',
      answer: 'Check for genuine holographic tamper-evident seals, the official GM 3-dot/2-dot packaging system, crisp laser-etched part numbers, and buy from established automotive parts networks rather than unverified third-party storefronts.',
    },
  ],
  relatedCommercialLinks: [
    {
      title: 'Used GM & Chevrolet Engines',
      href: '/used-engines',
      description: 'Search tested 5.3L L83, 6.2L L86, and 6.6L Duramax diesel engines with warranty.',
      badge: 'Popular',
    },
    {
      title: 'Used GM 6L80 & 8L90 Transmissions',
      href: '/used-transmissions',
      description: 'Find verified automatic transmissions for Silverado, Sierra, Tahoe, and Yukon.',
    },
    {
      title: 'OEM GM Body Panels',
      href: '/used-body-parts',
      description: 'Source original collision-free truck beds, tailgates, fenders, and hoods.',
    },
    {
      title: 'Contact GM Parts Specialists',
      href: '/contact',
      description: 'Have our specialists decode your GM VIN and SPID RPO codes for exact fitment.',
    },
  ],
  relatedArticles: [2, 3, 5, 6],
  cta: {
    title: 'Need the Correct GM Part for Your Truck or SUV?',
    description: 'Skip the dealership markup and generic knockoffs. Let our parts specialists match your VIN and RPO codes to our nationwide inventory of tested, guaranteed recycled OEM GM parts.',
    buttonText: 'Search GM Parts Inventory',
    buttonHref: '/parts',
    secondaryText: 'Request RPO Code Matching',
    secondaryHref: '/contact',
  },
  image: '/blogs/images/gm-genuine-parts-acdelco-tiers.jpg',
  description: 'Complete guide to sourcing genuine GM and ACDelco parts online. Learn to decode GM 8-digit part numbers, read RPO/SPID codes, and navigate shared truck platforms.',
};
