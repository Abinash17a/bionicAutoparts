"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchPartsData } from './lib/fetchPartsData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialData = {
  years: [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  makes: [
    'AMC', 'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevy', 'Chrysler', 
    'Dodge', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 'Jaguar', 'Jeep', 'Kia', 
    'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 
    'Plymouth', 'Pontiac', 'Ram', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
  ],
  models: {
    AMC: [
      'AMC Ambassador', 'AMC American', 'AMC AMX', 'AMC Classic', 'AMC Concord',
      'AMC Eagle', 'AMC Gremlin', 'AMC Hornet', 'AMC Javelin', 'AMC Marlin',
      'AMC Matador', 'AMC Pacer', 'AMC Rambler', 'AMC Rebel', 'AMC Spirit',
      'AMC Other',
    ],
    ACURA: [
      'Acura CL', 'Acura CSX', 'Acura EL', 'Acura ILX', 'Acura Integra',
      'Acura Legend', 'Acura MDX', 'Acura NSX', 'Acura RDX', 'Acura RL',
      'Acura RLX', 'Acura RSX', 'Acura SLX', 'Acura TL', 'Acura TLX',
      'Acura TSX', 'Acura Vigor', 'Acura ZDX',
    ],
    ALFA: [
      'Alfa 147', 'Alfa 164 Sedan', 'Alfa 1750', 'Alfa 4C', 'Alfa Alfetta',
      'Alfa GTV6', 'Alfa Giulia', 'Alfa Giulia 1600', 'Alfa Giulietta',
      'Alfa Milano', 'Alfa Mito', 'Alfa Spider-1600', 'Alfa Spider-1600 Duetto',
      'Alfa Spider-2000', 'Alfa Stelvio', 'Alfa Tonale',
    ],
    Aston_Martin: [
      'Aston Martin', 'Asuna',
    ],
    Audi: [
      'Audi 100', 'Audi 200', 'Audi 4000 2 Door &  4 Door Sedan', 'Audi 4000 Quattro',
      'Audi 5000 Quattro', 'Audi 80 Series', 'Audi 90 Series', 'Audi A3', 'Audi A4',
      'Audi A5', 'Audi A6', 'Audi A7', 'Audi A8', 'Audi AllRoad', 'Audi AllRoad A4',
      'Audi AllRoad A6', 'Audi Cabriolet', 'Audi Coupe GT', 'Audi Coupe Quattro',
      'Audi E-tron', 'Audi E-tron GT', 'Audi E-tron S', 'Audi Fox', 'Audi Q3',
      'Audi Q4 E-tron', 'Audi Q5', 'Audi Q7', 'Audi Q8', 'Audi R8', 'Audi RS3',
      'Audi RS4', 'Audi RS5', 'Audi RS6', 'Audi RS7', 'Audi RS E-tron GT',
      'Audi RS Q8', 'Audi S3', 'Audi S4', 'Audi S5', 'Audi S6', 'Audi S7',
      'Audi S8', 'Audi SQ5', 'Audi SQ7', 'Audi SQ8', 'Audi Sport Coupe',
      'Audi Super 90', 'Audi TT', 'Audi V8 Quattro',
    ],
    Austin: [
      'Austin', 'Austin Mini',
    ],
    AutoCar: [
      'Autocar',
    ],
    Avanti: [
      'Avanti',
    ],
    BMW: [
      'BMW 1M', 'BMW 128i', 'BMW 135i', 'BMW 1602', 'BMW 1800', 'BMW 228i',
      'BMW 230i', 'BMW 2002', 'BMW 2500', 'BMW 2800', 'BMW 3.0', 'BMW 318i',
      'BMW 320i', 'BMW 323i', 'BMW 325e', 'BMW 325i', 'BMW 328i', 'BMW 328i GT',
      'BMW 330e', 'BMW 330i', 'BMW 330i GT', 'BMW 335i', 'BMW 335i GT',
      'BMW 340i', 'BMW 340i GT', 'BMW 428i', 'BMW 430i', 'BMW 435i', 'BMW 440i',
      'BMW 524TD', 'BMW 525i', 'BMW 528e', 'BMW 528i', 'BMW 530e', 'BMW 530i',
      'BMW 533i', 'BMW 535i', 'BMW 535i GT', 'BMW 540i', 'BMW 545i', 'BMW 550i',
      'BMW 550i GT', 'BMW 630CSi', 'BMW 633CSi', 'BMW 635CSi', 'BMW 640i',
      'BMW 640i GT', 'BMW 645Ci', 'BMW 650i', 'BMW 728', 'BMW 732', 'BMW 733i',
      'BMW 735i', 'BMW 740e', 'BMW 740i', 'BMW 745e', 'BMW 745i', 'BMW 750i',
      'BMW 760i', 'BMW 840ci', 'BMW 840i', 'BMW 850i', 'BMW ActiveE',
      'BMW ActiveHybrid 3', 'BMW ActiveHybrid 5', 'BMW ActiveHybrid 7',
      'BMW Alpina B6', 'BMW Alpina B7', 'BMW Alpina B8', 'BMW Alpina XB7',
      'BMW I3', 'BMW I4', 'BMW I7', 'BMW I8', 'BMW IX', 'BMW L6', 'BMW Mini Cooper',
      'BMW Mini Cooper Clubman', 'BMW Mini Cooper Countryman', 'BMW Mini Cooper Paceman',
      'BMW M1', 'BMW M2', 'BMW M3', 'BMW M4', 'BMW M5', 'BMW M6', 'BMW M8',
      'BMW M235i', 'BMW M240i', 'BMW M340i', 'BMW M440i', 'BMW M550i', 'BMW M760i',
      'BMW M850i', 'BMW X1', 'BMW X2', 'BMW X3', 'BMW X3M', 'BMW X4', 'BMW X4M',
      'BMW X5', 'BMW X5M', 'BMW X6', 'BMW X6M', 'BMW X7', 'BMW XM', 'BMW Z3',
      'BMW Z4', 'BMW Z8', 'BMW Other',
    ],
    Bentley: [
      'Bentley', 'Bentley Arnage', 'Bentley Azure', 'Bentley Bentayga',
      'Bentley Brooklands', 'Bentley Continental', 'Bentley Corniche', 'Bentley Eight',
      'Bentley Flying Spur', 'Bentley Mulsanne', 'Bentley Turbo R', 'Bricklin',
      'Brockway',
    ],
    Buick: [
      'Buick Allure', 'Buick Apollo', 'Buick Cascada', 'Buick Century',
      'Buick Electra (1979 Down)', 'Buick Electra (1980 Up)', 'Buick Enclave',
      'Buick Encore', 'Buick Encore GX', 'Buick Envision', 'Buick Envista',
      'Buick Lacrosse', 'Buick LeSabre (1979 Down)', 'Buick LeSabre (1980 Up)',
      'Buick Limited', 'Buick Lucerne', 'Buick Park Ave (1979 Down)',
      'Buick Park Ave (1980 Up)', 'Buick Rainier', 'Buick Reatta', 'Buick Regal',
      'Buick Regal Somerset (1984 Down)', 'Buick Rendezvous', 'Buick Riviera',
      'Buick Roadmaster (1979 Down)', 'Buick Roadmaster (1980 Up)', 'Buick Skyhawk',
      'Buick Skylark', 'Buick Somerset (1985 Up)', 'Buick Special', 'Buick Terraza',
      'Buick Verano', 'Buick Other',
    ],
    Cadillac: [
      'Cadillac Allante', 'Cadillac ATS', 'Cadillac Brougham', 'Cadillac CT4',
      'Cadillac CT5', 'Cadillac CT6', 'Cadillac CTS', 'Cadillac Catera',
      'Cadillac Cimarron', 'Cadillac Concours', 'Cadillac DeVille (1979 Down)',
      'Cadillac DeVille (1980 Up)', 'Cadillac DHS', 'Cadillac DTS (2005 Down)',
      'Cadillac DTS (2006 Up)', 'Cadillac ELR', 'Cadillac Eldorado (1966 Down)',
      'Cadillac Eldorado (1967 Up)', 'Cadillac Escalade', 'Cadillac Escalade-ESV',
      'Cadillac Escalade-EXT', 'Cadillac Fleetwood (1979 Down)',
      'Cadillac Fleetwood (1980 Up)', 'Cadillac LYRIQ', 'Cadillac Seville (incl STS)',
      'Cadillac SRX', 'Cadillac STS', 'Cadillac XLR', 'Cadillac XT4',
      'Cadillac XT5', 'Cadillac XT6', 'Cadillac XTS', 'Cadillac Other',
    ],
    Chevy: [
      'Checker', 'Checker Cab', 'Chevy Astra', 'Chevy Astro', 'Chevy Aveo',
      'Chevy Beretta', 'Chevy Blazer', 'Chevy Bolt EV', 'Chevy Bolt EUV',
      'Chevy Camaro', 'Chevy Caprice', 'Chevy Cavalier', 'Chevy Chevelle',
      'Chevy Colorado', 'Chevy Corvette', 'Chevy Cruze', 'Chevy Equinox',
      'Chevy Express', 'Chevy Impala', 'Chevy Malibu', 'Chevy Monza',
      'Chevy Silverado 1500', 'Chevy Silverado 2500', 'Chevy Silverado 3500',
      'Chevy Suburban', 'Chevy Tahoe', 'Chevy Trailblazer', 'Chevy Traverse',
      'Chevy Uplander', 'Chevy Venture', 'Chevy Other',
    ],
    Chrysler: [
      'Chrysler 200', 'Chrysler 300', 'Chrysler Aspen', 'Chrysler Cirrus',
      'Chrysler Concorde', 'Chrysler Crossfire', 'Chrysler Dynasty',
      'Chrysler LHS', 'Chrysler New Yorker', 'Chrysler Pacifica', 'Chrysler PT Cruiser',
      'Chrysler Sebring', 'Chrysler Town & Country', 'Chrysler Voyager', 'Chrysler Other',
    ],
    Dodge: [
      'Dodge 400', 'Dodge Aries', 'Dodge Avenger', 'Dodge Caliber', 'Dodge Caravan',
      'Dodge Challenger', 'Dodge Charger', 'Dodge Dakota', 'Dodge Dart', 'Dodge Durango',
      'Dodge Grand Caravan', 'Dodge Intrepid', 'Dodge Journey', 'Dodge Neon',
      'Dodge Nitro', 'Dodge Ram 1500', 'Dodge Ram 2500', 'Dodge Ram 3500',
      'Dodge Sprinter', 'Dodge Other',
    ],
    Fiat: [
      'Fiat 124 Spider', 'Fiat 500', 'Fiat 500L', 'Fiat 500X', 'Fiat Other',
    ],
    Ford: [
      'Ford Aspire', 'Ford Bronco', 'Ford C-Max', 'Ford Courier', 'Ford Crown Victoria',
      'Ford EcoSport', 'Ford Edge', 'Ford Escape', 'Ford Expedition', 'Ford Explorer',
      'Ford F-150', 'Ford F-250', 'Ford F-350', 'Ford Fiesta', 'Ford Flex', 'Ford Focus',
      'Ford Fusion', 'Ford GT', 'Ford Maverick', 'Ford Mustang', 'Ford Taurus',
      'Ford Transit Connect', 'Ford Transit', 'Ford Other',
    ],
    Genesis: [
      'Genesis G70', 'Genesis G80', 'Genesis G90', 'Genesis Other',
    ],
    GMC: [
      'GMC Acadia', 'GMC Canyon', 'GMC Envoy', 'GMC Jimmy', 'GMC Sierra 1500',
      'GMC Sierra 2500', 'GMC Sierra 3500', 'GMC Terrain', 'GMC Yukon',
      'GMC Other',
    ],
    Honda: [
      'Honda Accord', 'Honda Civic', 'Honda CR-V', 'Honda CR-Z', 'Honda Element',
      'Honda Fit', 'Honda HR-V', 'Honda Insight', 'Honda Odyssey', 'Honda Passport',
      'Honda Pilot', 'Honda Ridgeline', 'Honda S2000', 'Honda Other',
    ],
    Hyundai: [
      'Hyundai Accent', 'Hyundai Elantra', 'Hyundai Ioniq', 'Hyundai Kona',
      'Hyundai Santa Cruz', 'Hyundai Santa Fe', 'Hyundai Sonata', 'Hyundai Tucson',
      'Hyundai Veloster', 'Hyundai Other',
    ],
    Jaguar: [
      'Jaguar F-Type', 'Jaguar I-Pace', 'Jaguar S-Type', 'Jaguar XE', 'Jaguar XF',
      'Jaguar XJ', 'Jaguar XK', 'Jaguar Other',
    ],
    Jeep: [
      'Jeep Cherokee', 'Jeep Compass', 'Jeep Grand Cherokee', 'Jeep Renegade',
      'Jeep Wrangler', 'Jeep Other',
    ],
    Kia: [
      'Kia Forte', 'Kia Niro', 'Kia Optima', 'Kia Rio', 'Kia Seltos', 'Kia Sorento',
      'Kia Sportage', 'Kia Stinger', 'Kia Telluride', 'Kia Other',
    ],
    LandRover: [
      'Land Rover Discovery', 'Land Rover Range Rover', 'Land Rover Range Rover Sport',
      'Land Rover Defender', 'Land Rover Other',
    ],
    Lexus: [
      'Lexus ES', 'Lexus GS', 'Lexus GX', 'Lexus IS', 'Lexus NX', 'Lexus RX',
      'Lexus UX', 'Lexus Other',
    ],
    Lincoln: [
      'Lincoln Aviator', 'Lincoln Continental', 'Lincoln Corsair', 'Lincoln MKC',
      'Lincoln MKT', 'Lincoln MKX', 'Lincoln Nautilus', 'Lincoln Navigator',
      'Lincoln Other',
    ],
    Mazda: [
      'Mazda 2', 'Mazda 3', 'Mazda 5', 'Mazda 6', 'Mazda CX-3', 'Mazda CX-30',
      'Mazda CX-5', 'Mazda CX-9', 'Mazda MX-5 Miata', 'Mazda Other',
    ],
    MercedesBenz: [
      'Mercedes A-Class', 'Mercedes B-Class', 'Mercedes C-Class', 'Mercedes CLA-Class',
      'Mercedes CLS-Class', 'Mercedes E-Class', 'Mercedes G-Class', 'Mercedes GLA-Class',
      'Mercedes GLB-Class', 'Mercedes GLC-Class', 'Mercedes GLE-Class', 'Mercedes GLS-Class',
      'Mercedes S-Class', 'Mercedes SL-Class', 'Mercedes SLS AMG', 'Mercedes AMG GT',
      'Mercedes EQC', 'Mercedes EQS', 'Mercedes Other',
    ],
    Mini: [
      'Mini Cooper', 'Mini Cooper Clubman', 'Mini Cooper Countryman', 'Mini Other',
    ],
    Mitsubishi: [
      'Mitsubishi Eclipse', 'Mitsubishi Galant', 'Mitsubishi Lancer', 'Mitsubishi Outlander',
      'Mitsubishi Outlander Sport', 'Mitsubishi RVR', 'Mitsubishi Other',
    ],
    Nissan: [
      'Nissan 370Z', 'Nissan Altima', 'Nissan Armada', 'Nissan Juke', 'Nissan Kicks',
      'Nissan Leaf', 'Nissan Maxima', 'Nissan Murano', 'Nissan Pathfinder',
      'Nissan Rogue', 'Nissan Sentra', 'Nissan Titan', 'Nissan Versa', 'Nissan Other',
    ],
    Plymouth: [
      'Plymouth Acclaim', 'Plymouth Barracuda', 'Plymouth Belvedere', 'Plymouth Breeze',
      'Plymouth Colt', 'Plymouth Grand Voyager', 'Plymouth Neon', 'Plymouth Prowler',
      'Plymouth Satellite', 'Plymouth Voyager', 'Plymouth Other',
    ],
    Pontiac: [
      'Pontiac Aztek', 'Pontiac Bonneville', 'Pontiac Firebird', 'Pontiac G5',
      'Pontiac G6', 'Pontiac Grand Am', 'Pontiac Grand Prix', 'Pontiac GTO',
      'Pontiac LeMans', 'Pontiac Montana', 'Pontiac Sunfire', 'Pontiac Other',
    ],
    Ram: [
      'Ram 1500', 'Ram 2500', 'Ram 3500', 'Ram ProMaster City', 'Ram ProMaster',
      'Ram Other',
    ],
    Subaru: [
      'Subaru Ascent', 'Subaru BRZ', 'Subaru Crosstrek', 'Subaru Forester',
      'Subaru Impreza', 'Subaru Legacy', 'Subaru Outback', 'Subaru Tribeca',
      'Subaru WRX', 'Subaru Other',
    ],
    Suzuki: [
      'Suzuki Aerio', 'Suzuki Equator', 'Suzuki Forenza', 'Suzuki Grand Vitara',
      'Suzuki Kizashi', 'Suzuki SX4', 'Suzuki Vitara', 'Suzuki Other',
    ],
    Tesla: [
      'Tesla Model 3', 'Tesla Model S', 'Tesla Model X', 'Tesla Model Y',
      'Tesla Other',
    ],
    Toyota: [
      'Toyota 4Runner', 'Toyota Avalon', 'Toyota Camry', 'Toyota Corolla',
      'Toyota Crossover', 'Toyota Highlander', 'Toyota Land Cruiser',
      'Toyota Prius', 'Toyota RAV4', 'Toyota Sequoia', 'Toyota Sienna',
      'Toyota Tacoma', 'Toyota Tundra', 'Toyota Yaris', 'Toyota Other',
    ],
    Volkswagen: [
      'Volkswagen Beetle', 'Volkswagen Golf', 'Volkswagen Jetta', 'Volkswagen Passat',
      'Volkswagen Tiguan', 'Volkswagen Atlas', 'Volkswagen Arteon', 'Volkswagen ID.4',
      'Volkswagen Other',
    ],
    Volvo: [
      'Volvo C30', 'Volvo C70', 'Volvo S40', 'Volvo S60', 'Volvo S80',
      'Volvo S90', 'Volvo V40', 'Volvo V60', 'Volvo V70', 'Volvo XC40',
      'Volvo XC60', 'Volvo XC90', 'Volvo Other',
    ],
  },
  parts: [
    "Front End Assembly",
    "Header Panel Assembly",
    "Spoiler/Valance, Front",
    "Grille",
    "Bumper Assembly, Front",
    "Bumper Guard, Front",
    "Bumper Reinforcement, Front",
    "Bumper Shock",
    "Radiator Core Support",
    "Fender",
    "Fender Extension",
    "Inner Fender",
    "Fender Molding",
    "Headlamp Assembly",
    "Front Lamp",
    "Hood",
    "Hood Hinge",
    "Cowl",
    "Door Assembly, Front",
    "Hood Strut",
    "Running Board",
    "Cowl Vent Panel",
    "Door Hinge, Front",
    "Door Window Regulator, Front",
    "Door Vent Window Regulator, Front",
    "Door Molding, Front",
    "Side View Mirror",
    "Door Handle",
    "Door Assembly, Rear or Back",
    "Door Hinge, Rear",
    "Door Window Regulator, Rear",
    "Door Molding, Rear",
    "A-Pillar",
    "Bumper End Cap",
    "Liner",
    "Pickup Topper",
    "Luggage Rack",
    "Roll Bar",
    "Rear Clip",
    "Rear Top Section",
    "Roof Assembly",
    "Sunroof Panel",
    "Pickup Truck Cab (Shell)",
    "Pickup Box Rear",
    "Pickup Box Front Panel",
    "Pickup Box Floor Pan",
    "Quarter Repair Panel",
    "Quarter Panel Assembly",
    "Quarter Extension",
    "Skirt",
    "Quarter Window Regulator, Rear",
    "Cab Clip",
    "Quarter Molding",
    "Tail Lamp",
    "Backup Lamp",
    "Side Marker Lamps, Rear",
    "Spoiler, Rear",
    "Decklid / Tailgate",
    "Trunk Lid Molding",
    "Hatchback Strut",
    "Valance, Rear",
    "Trunk Lid Hinge",
    "License Lamp",
    "High Mounted Stop Lamp",
    "Fuel Filler Door",
    "Fuel Cap",
    "Fuel Filler Neck",
    "Latches & Locks",
    "Tail Gate Hinge",
    "Tail Gate Window Regulator",
    "Tail Gate Molding",
    "Rear Window Washer Motor",
    "Rocker Panel Molding",
    "Bumper Assembly, Rear",
    "Bumper Reinforcement, Rear",
    "Bumper Filler Panel",
    "Bumper Guard, Rear",
    "Tail Panel",
    "Tail Finish Panel",
    "Floor Pan",
    "Fuel Tank",
    "Center Pillar",
    "Body Parts, Misc.",
    "Complete Interior",
    "Seat, Front",
    "Seat Track, Front",
    "Interior Trim Panel Front Door",
    "Interior Trim Panel Rear Door",
    "Headrest",
    "Seat Belt Assembly",
    "Motorized Seat Belt Track",
    "Seat, Rear",
    "Third Seat, (Station Wagon or Van)",
    "Parcel Shelf",
    "Carpet, Front",
    "Carpet, Rear",
    "Headliner",
    "Misc. Trim Pad",
    "Door Window Crank, Front",
    "Door Window Crank, Rear",
    "Boot Cover",
    "Accelerator Parts",
    "Steering Wheel",
    "Steering Shaft",
    "Steering Column",
    "Column Shift Lever",
    "Console",
    "Floor Shift Assembly",
    "Dash Assembly",
    "Dash Panel",
    "Dash Pad",
    "Air Bag",
    "Instrument Cluster Bezel",
    "Instrument Cluster",
    "Clock",
    "Speedometer Head /Cluster",
    "Tachometer",
    "Fuel Gauge",
    "Glove Box",
    "Clock Spring",
    "Interior Mirror",
    "Interior Sun Visor",
    "Windshield Frame",
    "Windshield Glass",
    "Back Glass",
    "Door Glass, Front",
    "Door Glass, Rear",
    "Door Vent Glass, Rear",
    "Door Vent Glass, Front",
    "Quarter Glass",
    "Roof Glass",
    "Special Glass",
    "Interior Parts, Misc.",
    "Engine Assembly",
    "Cylinder Block",
    "Crankshaft",
    "Piston",
    "Camshaft",
    "Cylinder Head",
    "Rocker Arm",
    "Timing Cover",
    "Harmonic Balancer",
    "Timing Belt Tension",
    "Oil Pan",
    "Oil Pump",
    "Connecting Rod",
    "Short Cylinder Block",
    "Timing Chain, Belt",
    "Timing Gears",
    "Intercooler",
    "Engine Oil Cooler",
    "Air Cleaner",
    "Carburetor",
    "Turbocharger/Supercharger",
    "Fuel Injection Parts",
    "Fuel Pump Assembly",
    "Water Pump",
    "Fan Blade",
    "Fan Clutch",
    "Exhaust Manifold",
    "Exhaust Assembly",
    "Intake Manifold",
    "Exhaust Cross Pipe",
    "Exhaust Pipe",
    "Tail Pipe",
    "Muffler",
    "Exhaust Resonator",
    "Catalytic Converter",
    "Air Flow Meter",
    "Throttle Body/Valve Assembly",
    "Air Injection Pump",
    "Brackets, Misc.",
    "Engine Mounts",
    "Camshaft Housing",
    "Valve Cover",
    "Vacuum Pump",
    "Filter/Water Separator",
    "Fuel Vapor Canister",
    "Engine Parts, Misc.",
    "Transmission/Transaxle Assembly",
    "Overdrive Unit",
    "Transaxle Housing",
    "Manual Transmission Parts",
    "Automatic Transmission Parts",
    "Pressure Plate",
    "Torque Converter",
    "Bell Housing",
    "Flywheel/Flex Plate",
    "Clutch Disc",
    "Transfer Case Adapter",
    "Transfer Case Assembly",
    "Front Transmission Pump",
    "Automatic Transmission Oil",
    "Automatic Transmission Pan",
    "Clutch Master Cylinder",
    "Clutch Slave Cylinder",
    "Transfer Case Motor",
    "Transmission Crossmember",
    "Drive Shaft, Front",
    "Drive Shaft, Rear",
    "Universal Slip Yoke",
    "Axle Assembly, Front",
    "Axle Assembly, Rear",
    "Axle Housing",
    "Axle Flange",
    "Carrier Case",
    "Carrier Assembly",
    "Differential Parts, Misc.",
    "Differential Flange",
    "Differential Case",
    "Differential Assembly",
    "Ring Gear and Pinion",
    "Axle Shaft",
    "Differential Side Gears",
    "Rear Independent Suspension Assembly",
    "Beam Axle, Loaded",
    "Suspension Crossmember/K-Frame",
    "Stub Axle, Rear",
    "Axle Parts, Misc.",
    "Frame",
    "Frame, Front",
    "Frame Rails, Upper & Lower",
    "Frame Horn",
    "Spring Hanger",
    "Upper Control Arm, Rear",
    "formerly Suspension Locating Arm",
    "formerly Suspension Trailing Arm",
    "Retainer",
    "Knuckle Support",
    "Knee",
    "Upper Control Arm, Front",
    "Lower Control Arm, Front",
    "Lower Control Arm, Rear",
    "Radius Arm, Front",
    "Spindle/Knuckle, Front",
    "Leaf Spring, Front",
    "Coil Spring",
    "Leaf Spring, Rear",
    "Air Spring",
    "Front Axle I-Beam (  WD)",
    "Torsion Bar",
    "Suspension Compressor/Pump",
    "Suspension Trunion Arm",
    "Stabilizer Bar",
    "Shock Absorber",
    "Strut",
    "Brakes, Front",
    "Brakes, Rear",
    "Brake Parts, Misc. Front",
    "Brake Parts, Misc. Rear",
    "Caliper",
    "Locking Hubs",
    "Hub",
    "Brake Proportioning Valve",
    "Power Brake Booster",
    "Brake Master Cylinder",
    "Brake Shoes",
    "Backing Plate, Front",
    "Backing Plate, Rear",
    "Anti Lock Brake Parts",
    "Brake/Clutch Pedal Box",
    "Emergency Brake Parts",
    "Wheel Speed Sensor",
    "Power Steering Assembly",
    "Steering Gear/Rack & Pinion",
    "Tie Rod",
    "Power Steering Pump",
    "Power Steering Control Valve",
    "Power Steering Pressure Hose",
    "Power Steering Pressure Cylinder",
    "Pitman Arm",
    "Drive Link",
    "Idler Arm",
    "Wheel",
    "Wheel Bearing, Front",
    "Wheel Bearing, Rear",
    "Lug Wrench",
    "Jack",
    "Inner Fender Liner",
    "Spare Wheel Carrier",
    "Wheel Cover",
    "Trim Ring",
    "Hub Cap",
    "Tires",
    "Trailer Hitch",
    "Electronic Engine Control Modules",
    "Electronic Chassis Control Modules",
    "Electronic Parts, Misc.",
    "Info-GPS-TV Screen",
    "Steering or Suspension Parts, Misc.",
    "Battery",
    "Alternator",
    "Voltage Regulator",
    "Generator",
    "Starter Motor",
    "Starter Solenoid",
    "Distributor",
    "Battery Tray",
    "EGR Maintenance Reminder",
    "Fuel Pacer System",
    "Coil",
    "Seat Belt Motor",
    "Seat Motor",
    "Horn",
    "Electrical Relay",
    "Blower Motor",
    "Window Defogger, Rear",
    "Power Window Motor",
    "Wiper Motor, Rear",
    "Headlamp Motor",
    "Wiper Motor, Windshield",
    "Wiper Transmission",
    "Windshield Washer Reservoir",
    "Windshield Washer Motor",
    "Horn Ring",
    "Horn Button",
    "Windshield Washer Nozzle",
    "Power Door Motor",
    "Computer Module, Anti Lock Brake",
    "Power Door Module",
    "Power Seat Module",
    "Ignition Coil",
    "Horns",
    "Engine Control Module",
    "Transmission Control Module",
    "Ignition System",
    "Starter Switch",
    "Thermal Time Switch",
    "Knock Sensor",
    "Headlight Assembly"
],
};

interface DataType {
  years: string[];
  makes: string[];
  models: string[];
  parts: string[];
}




export default function Home() {
  const [data, setData] = useState<DataType>({
    years: [],
    makes: [],
    models: [],
    parts: [],
  });

  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [part, setPart] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [searchedPart, setSearchedPart] = useState<DataType | null>(null);
  const [searchedPartFormatted, setSearchedPartFormatted] = useState<string>('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleMakeChange = (e: any) => {
    setMake(e.target.value);
    setModel('');
  };
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isValid, setIsValid] = useState(false); 

  const validateForm = () => {
    if (year && make && model && part) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [year, make, model, part]);


  const images = [
    { src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Car Parts' },
    { src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Car Parts' }
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatSearchedPart = (part: DataType | null): string => {
    if (!part) return '';
  
    return `${part.years.join(', ')} ${part.makes.join(', ')} ${part.models.join(', ')} ${part.parts.join(', ')}`;
  };


  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchPartsData();
      setData(fetchedData);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (searchedPart) {
      const formattedPart = formatSearchedPart(searchedPart);
      setSearchedPartFormatted(formattedPart);
    }
  }, [searchedPart]);

  const handleSearch = () => {
    setSearchedPart({ years: [year], makes: [make], models: [model], parts: [part] }); 
    if(isValid){
    setShowSearchResult(true);
    setModalVisible(true);
    }
    else{
      setModalVisible(false);
      toast.error('All fields need to be filled before submitting!');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false); // Close the modal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/saveSubmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          contact,
          email,
          zipCode,
          searchedPartFormatted,
        }),
      });
  
      if (response.ok) {
        toast.success('Form submitted successfully!');

        setName('');
        setContact('');
        setEmail('');
        setZipCode('');
        handleModalClose()
      } else {
        const errorData = await response.json();
        toast.error('Error submitting the form: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Error submitting the form. Check console for details.'); 
    }
  };


  return (
    <section className="container mx-auto px-6 py-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      {/* Top section divided into two parts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Image carousel */}
        <div className="bg-white-500 p-8 rounded-md">
          <div className="carousel relative">
            <Image
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              width={500}
              height={300}
              className="rounded-md w-full"
            />

            {/* Carousel navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
              ❮
            </button>

            <button
              onClick={handleNext}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
              ❯
            </button>
          </div>
        </div>

        {/* Right side: Form section */}
        <div className="bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Find the Parts You Need</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="year" className="block text-gray-700">Year</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Year</option>
                {initialData.years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="make" className="block text-gray-700">Make</label>
              <select
                id="make"
                value={make}
                onChange={handleMakeChange}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Make</option>
                {initialData.makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="model" className="block text-gray-700">Model</label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                disabled={!make} // Disable if no make is selected
              >
                <option value="">Select Model</option>
                {make && initialData.models[make]?.map((mod:any) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="part" className="block text-gray-700">Part</label>
              <select
                id="part"
                value={part}
                onChange={(e) => setPart(e.target.value)}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Part</option>
                {initialData.parts.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => { setModalVisible(true)
                handleSearch()
               }}
              className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 font-bold"
            >
              Search Part
            </button>
          </form>
        </div>
      </div>
      

      {/* Modal for filling details */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8 w-11/12 md:w-1/2 lg:w-1/3 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center">
              {searchedPart?.years.join(', ')} {searchedPart?.makes.join(', ')} {searchedPart?.models.join(', ')} {searchedPart?.parts.join(', ')}
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Update state on input change
                  className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-gray-700 font-medium">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)} // Update state on input change
                  className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update state on input change
                  className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="zipcode" className="block text-gray-700 font-medium">Zip Code</label>
                <input
                  type="text"
                  id="zipcode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)} // Update state on input change
                  className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mt-6 space-y-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-bold transition duration-300 hover:bg-blue-500"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full bg-gray-600 text-white py-3 rounded-md font-bold transition duration-300 hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Section: Writing on the left, image on the right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
        {/* Left side: Writing */}
        <div className="p-10 rounded-md">
          <h2 className="text-2xl font-bold mb-6">More Information About Car Parts</h2>
          <p className="mb-6">
            At our store, you will find a wide range of car parts for every model and make. Whether you are looking for engine components, body parts, or interior accessories, we have it all.
          </p>
          <p className="mt-4">
            Our team is dedicated to providing you with the best options to maintain and upgrade your vehicle. Get the parts you need at competitive prices and with fast shipping.
          </p>
        </div>

        {/* Right side: Image grid with four images and added spacing */}
        <div className="grid grid-cols-2 gap-6 p-10 rounded-md">
          <Image
            src="https://images.unsplash.com/photo-1717068341263-33331ec8104c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Car Part 1"
            width={250}
            height={150}
            className="rounded-md w-full"
          />
          <Image
            src="https://images.unsplash.com/photo-1727413433599-496949ef8196?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Car Part 2"
            width={250}
            height={150}
            className="rounded-md w-full"
          />
          <Image
            src="https://images.unsplash.com/photo-1702146715471-ae6b10689969?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Car Part 3"
            width={250}
            height={150}
            className="rounded-md w-full"
          />
          <Image
            src="https://images.unsplash.com/photo-1702146713882-2579afb0bfba?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Car Part 4"
            width={250}
            height={150}
            className="rounded-md w-full"
          />
        </div>
      </div>

      {/* Card Section with Image and Text */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">Explore Our Car Parts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <Image
              src="/assets/cardpart1.jpg"
              alt="Part 1"
              width={500}
              height={300}
              className="rounded-md w-full"
            />
            <h3 className="text-xl font-bold mt-4">Engine Parts</h3>
            <p className="text-gray-700 mt-2">
              Browse a wide selection of high-performance engine components that will keep your vehicle running smoothly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <Image
              src="/assets/carpartsmain1.jpg"
              alt="Part 2"
              width={500}
              height={300}
              className="rounded-md w-full"
            />
            <h3 className="text-xl font-bold mt-4">Body Parts</h3>
            <p className="text-gray-700 mt-2">
              Find everything from bumpers to fenders to give your car a fresh new look.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <Image
              src="/assets/cardpart3.jpg"
              alt="Part 3"
              width={500}
              height={300}
              className="rounded-md w-full"
            />
            <h3 className="text-xl font-bold mt-4">Interior Accessories</h3>
            <p className="text-gray-700 mt-2">
              Upgrade your car's interior with stylish and functional accessories.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-gray-700 italic">
              "Great selection of car parts! I found exactly what I needed for my vehicle and the quality was excellent."
            </p>
            <p className="text-blue-500 font-bold mt-4">- John Doe</p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-gray-700 italic">
              "Fast shipping and reliable parts. My car has never run better after installing the parts I ordered."
            </p>
            <p className="text-blue-500 font-bold mt-4">- Jane Smith</p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-gray-700 italic">
              "Amazing customer service and top-notch products. I will definitely be shopping here again."
            </p>
            <p className="text-blue-500 font-bold mt-4">- Mike Johnson</p>
          </div>
        </div>
      </div>
    </section>
  );
}
