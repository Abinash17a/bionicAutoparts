"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchPartsData } from './lib/fetchPartsData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const initialData = {
  years: [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  makes: [
    'AMC', 'Acura', 'ALFA', 'Aston_Martin', 'Audi', 'Austin', 'AutoCar', 'Avanti', 'BMW', 'Bentley', 'Buick', 'Cadillac', 'Chevy', 'Chrysler', 'Citroen', 
    'Daewoo', 'Daihatsu', 'Delorean', 'Dodge', 'Eagle', 'Ferrari', 'Fiat', 'Fisker', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hudson', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 
    'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'MG', 'Maserati', 'Maybach', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mercury', 'Mini', 'Mitsubishi', 'Nissan', 
    'Oldsmobile', 'Plymouth', 'Polestar', 'Pontiac', 'Porsche', 'Ram', 'Renault', 'RollsRoyce', 'Rover', 'Saab', 'Saturn', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Triumph', 'Volkswagen', 'Volvo', 'Western', 'Willys', 'Winnebago', 'Yugo'
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
      'Checker',  'Checker Cab',  'Chevy Astra', 
      'Chevy Astro',  'Chevy Aveo',  'Chevy Beretta',  'Chevy Blazer,  Full Size (1994 Down)',
      'Chevy Blazer (2019 Up)',  'Chevy Blazer, S10',  'Chevy Bolt',  'Chevy Bolt EUV', 
      'Chevy C2',  'Chevy Camaro',  'Chevy Caprice (1979 Down)',  'Chevy Caprice (1980 Up)', 
      'Chevy Captiva Sport',  'Chevy Cavalier',  'Chevy Celebrity',  'Chevy Chevelle',
      'Chevy Chevette',  'Chevy Chevy Pickup FWD (Non US Mkt)',       'Chevy Chevy Small Car (Non US Mkt)',
      'Chevy Citation',  'Chevy City Express',
      'Chevy Cobalt',  'Chevy Corsa',  'Chevy Corsica',  'Chevy Corvair',  'Chevy Corvette',
      'Chevy Cruze',  'Chevy El Camino (1963 Down)',  'Chevy El Camino (1964-1977)',
      'Chevy El Camino (1978 Up)',  'Chevy Epica',  'Chevy Equinox',  'Chevy HHR',  'Chevy Impala (1979 Down)',
      'Chevy Impala (1980 Up)',  'Chevy Lumina Car',  'Chevy Lumina Van',  'Chevy Luv (See Also Isuzu Mini P-Up)',
      'Chevy Malibu',  'Chevy Meriva',  'Chevy Metro',  'Chevy Monte Carlo',  'Chevy Monza',  'Chevy Nova & Chevy II (1967 Down)',
      'Chevy Nova (1968 Up)',  'Chevy Optra',  'Chevy Orlando',  'Chevy Prizm',  'Chevy S10',  'Chevy Sonic',  'Chevy Spark',
      'Chevy Spectrum',  'Chevy Sprint',  'Chevy SS',  'Chevy SSR',  'Chevy Suburban-10 (1988 Down)',
      'Chevy Suburban-20 (1988 Down)',  'Chevy Suburban-30 (1966 Down)',  'Chevy Suburban-1000 (1963-1966)',
      'Chevy Suburban-1500',  'Chevy Suburban-2500 (1967 Up)',  'Chevy Suburban-3500',  'Chevy Tahoe',  'Chevy Tigra',
      'Chevy Tornado',  'Chevy Tracker',  'Chevy TrailBlazer',  'Chevy TrailBlazer-EXT',  'Chevy Traverse',  'Chevy Trax',
      'Chevy Truck-10 Series (1987 Down)',  'Chevy Truck-20 Series (1988 Down)',  'Chevy Truck-30 Series (1988 Down)',
      'Chevy Truck-1500 Series (1988-1999)',  'Chevy Truck-2500 Series (1988-2000)',  'Chevy Truck-3500 Series (1988-2001)',
      'Chevy Truck-Avalanche 1500',  'Chevy Truck-Avalanche 2500',  'Chevy Truck-C3100',  'Chevy Truck-C3600',
      'Chevy Truck-C3800',  'Chevy Truck-Colorado',  'Chevy Truck-Forward Control',  'Chevy Truck-Kodiak',
      'Chevy Truck-Luv Mini Pup',  'Chevy Truck-S10',  'Chevy Truck-Silverado 1500 (1999 Up)',  'Chevy Truck-Silverado 2500 (1999 Up)',
      'Chevy Truck-Silverado 3500 (2001 Up)',  'Chevy Truck-Tilt Cab',  'Chevy Uplander',  'Chevy Van 10',
      'Chevy Van 20',  'Chevy Van 30',  'Chevy Van Express 1500',  'Chevy Van Express 2500',  'Chevy Van Express 3500',
      'Chevy Vectra',  'Chevy Vega',  'Chevy Venture',  'Chevy Volt',  'Chevy Zafira',  'Chevy Other',
    ],
    Chrysler: [
      'Chrysler 200', 'Chrysler 200', 'Chrysler 300', 'Chrysler 300M',
      'Chrysler Aspen', 'Chrysler Atos', 'Chrysler Attitude', 'Chrysler Cirrus', 
      'Chrysler Concorde', 'Chrysler Conquest', 'Chrysler Cordoba', 'Chrysler Crossfire',
      'Chrysler E Class', 'Chrysler Fifth Avenue - FWD', 'Chrysler Fifth Avenue - RWD (1979 Up)',
      'Chrysler Imperial', 'Chrysler LHS', 'Chrysler Laser', 'Chrysler Lebaron', 'Chrysler New Yorker - FWD',
      'Chrysler New Yorker - RWD', 'Chrysler Newport', 'Chrysler Pacifica', 'Chrysler Prowler', 'Chrysler PT Cruiser',
      'Chrysler Sebring', 'Chrysler TC', 'Chrysler Town and Country', 'Chrysler Voyager', 'Chrysler Other',  'Chrysler Other',
    ],
    Dodge: [
      'Dodge 400', 'Dodge 600', 'Dodge Aries', 'Dodge Aspen',
      'Dodge Avenger', 'Dodge Caliber', 'Dodge Caravan', 'Dodge Challenger (Chrysler)',
      'Dodge Challenger (Mitsubishi)', 'Dodge Charger', 'Dodge Colt-not Vista', 'Dodge Colt Vista',
      'Dodge Cricket', 'Dodge D50', 'Dodge Dakota', 'Dodge Dart', 'Dodge Daytona',
      'Dodge Diplomat', 'Dodge Durango', 'Dodge Dynasty', 'Dodge Hornet', 'Dodge Intrepid',
      'Dodge Journey', 'Dodge Lancer', 'Dodge Magnum', 'Dodge Mirada', 'Dodge Monaco (1978 Down)',
      'Dodge Monaco (1990 Up)', 'Dodge Neon', 'Dodge Nitro', 'Dodge Omni', 'Dodge Raider',
      'Dodge Ramcharger', 'Dodge Rampage', 'Dodge Shadow', 'Dodge Spirit', 'Dodge St Regis',
      'Dodge Stealth', 'Dodge Stratus', 'Dodge Truck-100 Series (1989 Down)',
      'Dodge Truck-200 Series (1980 Down)', 'Dodge Truck-300 Series (1980 Down)',
      'Dodge Truck-400 Series', 'Dodge Truck-150 (1978-1993)', 'Dodge Truck-250 Series (1981-1993)',
      'Dodge Truck-350 Series (1981-1993)', 'Dodge Truck-450 Series', 'Dodge Truck-1500 (1994 Up)',
      'Dodge Truck-2500 Series (1994 Up)', 'Dodge Truck-3500 (1994 Up)', 'Dodge Truck-4500 Series',
      'Dodge Truck-5500 Series', 'Dodge Truck-D50', 'Dodge Truck-Dakota', 'Dodge Truck-Forward Control',
      'Dodge Truck-Rampage', 'Dodge Van 100', 'Dodge Van 150', 'Dodge Van 200', 'Dodge Van 250', 'Dodge Van 300',
      'Dodge Van 350', 'Dodge Van 1500', 'Dodge Van 2500', 'Dodge Van 3500', 'Dodge Van (Sprinter 2500)',
      'Dodge Van (Sprinter 3500)', 'Dodge Verna', 'Dodge Viper',  'Dodge Other',
    ],
    Fiat: [
      'Fiat 1100R', 'Fiat 124 (1983 Down, includes Spider)',
      'Fiat 124 Spider (2016 Up)', 'Fiat 128', 'Fiat 131', 'Fiat 500', 'Fiat 600',
      'Fiat 850', 'Fiat Spider (includes 2000)', 'Fiat Strada', 'Fiat X 1', 'Fiat Other',
    ],
    Ford: [
      'Ford 500', 'Ford Aerostar', 'Ford Aspire', 'Ford Bronco (Full Size)',
      'Ford Bronco II', 'Ford Bronco Raptor', 'Ford Bronco Sport', 'Ford C-Max',
      'Ford Contour', 'Ford Cortina', 'Ford Courier', 'Ford Crown Vic (1982 Down)',
      'Ford Crown Vic (1983 Up)', 'Ford E Transit', 'Ford Ecosport', 'Ford Edge',
      'Ford Escape', 'Ford Escort', 'Ford Excursion', 'Ford EXP', 'Ford Expedition',
      'Ford Explorer', 'Ford Fairlane', 'Ford Fairmont', 'Ford Falcon', 'Ford Festiva',
      'Ford Fiesta', 'Ford Five Hundred', 'Ford Flex', 'Ford Focus', 'Ford Focus RS',
      'Ford Freestar', 'Ford Freestyle', 'Ford Fusion', 'Ford Galaxie', 'Ford Granada',
      'Ford GT', 'Ford Ikon', 'Ford KA', 'Ford LTD (1978 Down)', 'Ford LTD (1979 Up)',
      'Ford LTD II', 'Ford Maverick', 'Ford Maverick Pickup', 'Ford Mondeo',
      'Ford Mustang', 'Ford Mustang Mach E', 'Ford Pinto', 'Ford Probe',
      'Ford Ranchero (1967-1970)', 'Ford Ranchero (1971-1976)', 'Ford Ranchero (1977 up)',
      'Ford Ranchero (1957-1959)', 'Ford Ranchero (1960-1966)', 'Ford Ranger', 'Ford Taurus',
      'Ford Taurus X', 'Ford Tempo', 'Ford ThinkCity-Electric', 'Ford Thunderbird', 'Ford Torino',
      'Ford Transit 150', 'Ford Transit 250', 'Ford Transit 350', 'Ford Transit Connect',
      'Ford Truck-Courier', 'Ford Truck-F100', 'Ford Truck-F150',
      'Ford Truck F150 Lightning (Electric)', 'Ford Truck-F150 Lightning (SVT Gas)',
      'Ford Truck-F150 Raptor', 'Ford Truck-F250 not Super Duty (1999 Down)',
      'Ford Truck-F250 Super Duty (1999 Up)', 'Ford Truck-F350 not Super Duty (1997 Down)',
      'Ford Truck-F350 Super Duty (1999 Up)', 'Ford Truck-F450 not Super Duty (1997 Down)',
      'Ford Truck-F450 Super Duty (1999 Up)', 'Ford Truck-F550 Super Duty (1999 Up)',
      'Ford Truck-Forward Control', 'Ford Truck-Ranger', 'Ford Van E100', 'Ford Van E150',
      'Ford Van E200', 'Ford Van E250', 'Ford Van E300', 'Ford Van E350',
      'Ford Van E450 Super Duty', 'Ford Van E550 Super Duty', 'Ford Windstar','Ford Other',
    ],
    Genesis: [
      'Genesis G70', 'Genesis G80', 'Genesis GV60', 'Genesis GV70', 'Genesis GV80',
      'Geo Metro', 'Geo Prizm', 'Geo Spectrum', 'Geo Storm', 'Geo Tracker', 'Genesis G90',
      'Genesis Other',
    ],
    GMC: [
      'GMC Acadia', 'GMC Hummer EV', 'GMC Jimmy, Full Size',
      'GMC Jimmy, S10', 'GMC Safari Van', 'GMC Sprint', 'GMC Suburban-10 (1988 Down)',
      'GMC Suburban-20 (1988 Down)', 'GMC Suburban-30 (1965-1966)',
      'GMC Suburban-1000 (1965-1966)', 'GMC Suburban-1500 (2001 Down)',
      'GMC Suburban-2500 (1967 Up)', 'GMC Syclone', 'GMC Terrain',
      'GMC Truck-1000 Series (1966 Down)', 'GMC Truck-1500 Series (1999 Down)',
      'GMC Truck-2500 Series (2000 Down)', 'GMC Truck-3500 Series (2001 Down)',
      'GMC Truck-Canyon', 'GMC Truck-Envoy', 'GMC Truck-Envoy XL', 'GMC Truck-Envoy XUV',
      'GMC Truck-Forward Control', 'GMC Truck-S10', 'GMC Truck-Sierra 1500 (1999 Up)',
      'GMC Truck-Sierra 2500 (1999 Up)', 'GMC Truck-Sierra 3500 (2001 Up)',
      'GMC Truck-Sierra Denali', 'GMC Truck-Sierra Denali 1500 (2011 Up)',
      'GMC Truck-Sierra Denali 2500 (2011 Up)', 'GMC Truck-Sierra Denali 3500 (2011 Up)',
      'GMC Truck-Topkick', 'GMC Truck-Yukon (except XL)', 'GMC Truck-Yukon XL1500',
      'GMC Truck-Yukon XL2500', 'GMC Typhoon', 'GMC Van 1000', 'GMC Van 1500',
      'GMC Van 2500', 'GMC Van 3500', 'GMC Van Savana 1500', 'GMC Van Savana 2500',
      'GMC Van Savana 3500', 'GMC Other',
    ],
    Honda: [
      'Honda 600', 'Honda Accord', 'Honda Acty', 'Honda Civic',
      'Honda Clarity', 'Honda Clarity Electric', 'Honda Clarity Fuel Cell',
      'Honda Crosstour', 'Honda CRV', 'Honda CRX', 'Honda CRZ', 'Honda DelSol',
      'Honda Element', 'Honda FCX', 'Honda Fit', 'Honda HRV', 'Honda Insight',
      'Honda Odyssey', 'Honda Passport', 'Honda Pilot', 'Honda Prelude',
      'Honda Prologue', 'Honda Ridgeline', 'Honda S2000', 'Honda Other',
    ],
    Hyundai: [
      'Hyundai Accent', 'Hyundai Azera', 'Hyundai Elantra', 'Hyundai Entourage',
      'Hyundai Equus', 'Hyundai Excel', 'Hyundai Genesis', 'Hyundai Ioniq', 'Hyundai Ioniq 5',
      'Hyundai Ioniq 6', 'Hyundai Kona', 'Hyundai Kona Electric', 'Hyundai Nexo',
      'Hyundai Palisade', 'Hyundai Pony', 'Hyundai Santa Cruz', 'Hyundai Santa Fe',
      'Hyundai Scoupe', 'Hyundai Sonata', 'Hyundai Stellar', 'Hyundai Tiburon',
      'Hyundai Tucson', 'Hyundai Veloster', 'Hyundai Venue', 'Hyundai Veracruz',
      'Hyundai XG Series',  'Hyundai Other',
    ],
    Jaguar: [
      'Jaguar 120', 'Jaguar 140', 'Jaguar 150', 'Jaguar E Pace', 'Jaguar F Pace',
      'Jaguar F Type', 'Jaguar I Pace', 'Jaguar Mark 10', 'Jaguar S Type', 'Jaguar Sedan',
      'Jaguar Vanden Plas (1997 Down)', 'Jaguar Vanden Plas (1998 to 2007)',
      'Jaguar Vanden Plas (2008 Up)', 'Jaguar X Type', 'Jaguar XE', 'Jaguar XF',
      'Jaguar XF Sportbrake', 'Jaguar XJ Series (2008 Up)', 'Jaguar XJR (1993)',
      'Jaguar XJR (1995 to 1997)', 'Jaguar XJR (1998 to 2007)', 'Jaguar XJR (2008 Up)',
      'Jaguar XJS', 'Jaguar XJ6', 'Jaguar XJ8 (2008 Up)', 'Jaguar XJ8 (2007 Down)',
      'Jaguar XJ12', 'Jaguar XK Series (2007 Up)', 'Jaguar XKE', 'Jaguar XKR (2006 Down)',
      'Jaguar XKR (2007 Up)', 'Jaguar XK8',  'Jaguar Other',
    ],
    Jeep: [
      'Jeep Cherokee', 'Jeep CJSeries', 'Jeep Comanche', 'Jeep Commander',
      'Jeep Compass', 'Jeep DJ Series', 'Jeep FC Series', 'Jeep Gladiator',
      'Jeep Grand Cherokee', 'Jeep Grand Wagoneer', 'Jeep J-Series', 'Jeep Jeepster',
      'Jeep Liberty', 'Jeep Patriot', 'Jeep Renegade', 'Jeep Station Wagon', 'Jeep Truck',
      'Jeep Wagoneer (except Grand Wagoneer)', 'Jeep Wrangler',  'Jeep Other',
    ],
    Kia: [
      'Kia Amanti', 'Kia Besta', 'Kia Borrego', 'Kia Cadenza', 'Kia Carnival',
      'Kia EV6', 'Kia Forte', 'Kia K5', 'Kia K900', 'Kia Magentis', 'Kia Niro',
      'Kia Niro EV', 'Kia Optima', 'Kia Rio', 'Kia Rondo', 'Kia Sedona', 'Kia Seltos',
      'Kia Sephia', 'Kia Sorento', 'Kia Soul', 'Kia Spectra', 'Kia Sportage', 'Kia Stinger',
      'Kia Telluride', 'Kia Other', 'Lada',
    ],
    LandRover: [
      'LandRover Defender (1997 Down)', 'LandRover Defender (2020 Up)',
      'LandRover Discovery (2004 Down)', 'LandRover Discovery (2017 Up)',
      'LandRover Discovery Sport', 'LandRover Freelander', 'LandRover LR2',
      'LandRover LR3', 'LandRover LR4', 'LandRover Range Rover', 'LandRover Range Rover Evoque',
      'LandRover Range Rover Sport', 'LandRover Range Rover Velar', 'Land Rover Other',
    ],
    Lexus: [
      'Lexus CT 200H', 'Lexus ES250', 'Lexus ES300', 'Lexus ES300H', 'Lexus ES330',
      'Lexus ES350', 'Lexus GS200t', 'Lexus GS300', 'Lexus GS350', 'Lexus GS400', 'Lexus GS430',
      'Lexus GS450', 'Lexus GS460', 'Lexus GS F', 'Lexus GX460', 'Lexus GX470', 'Lexus HS250H',
      'Lexus IS200t', 'Lexus IS250', 'Lexus IS300', 'Lexus IS350', 'Lexus IS500', 'Lexus IS F',
      'Lexus LC500', 'Lexus LC500h', 'Lexus LFA', 'Lexus LS400', 'Lexus LS430', 'Lexus LS460',
      'Lexus LS500', 'Lexus LS500h', 'Lexus LS600HL', 'Lexus LX450', 'Lexus LX470',
      'Lexus LX570', 'Lexus LX600', 'Lexus NX200t', 'Lexus NX250', 'Lexus NX300',
      'Lexus NX300h', 'Lexus NX350', 'Lexus NX350H', 'Lexus NX450h+', 'Lexus RC 200t',
      'Lexus RC 300', 'Lexus RC 350', 'Lexus RC F', 'Lexus RX300', 'Lexus RX330',
      'Lexus RX350', 'Lexus RX350h', 'Lexus RX350L', 'Lexus RX400h', 'Lexus RX450 Hybrid',
      'Lexus RX450 Hybrid L', 'Lexus RX500h', 'Lexus RZ450e', 'Lexus SC (excl 430)',
      'Lexus SC430', 'Lexus UX 200', 'Lexus UX 250h',
    ],
    Lincoln: [
      'Lincoln Aviator', 'Lincoln Blackwood', 'Lincoln Continental', 'Lincoln Corsair',
      'Lincoln LS', 'Lincoln Mark LT', 'Lincoln Mark Series', 'Lincoln MKC', 'Lincoln MKS',
      'Lincoln MKT', 'Lincoln MKX', 'Lincoln MKZ', 'Lincoln Nautilus', 'Lincoln Navigator',
      'Lincoln Versailles', 'Lincoln Zephyr', 'Lincoln Other (includes Town Car)', 'Lincoln Other',
    ],
    Mazda: [
      'Mazda 2', 'Mazda 3', 'Mazda 5', 'Mazda 6', 'Mazda 323', 'Mazda 626', 'Mazda 808',
      'Mazda 929', 'Mazda 1200', 'Mazda 1800', 'Mazda Cosmo', 'Mazda CX3', 'Mazda CX5',
      'Mazda CX7', 'Mazda CX9', 'Mazda CX30', 'Mazda CX50', 'Mazda CX90', 'Mazda GLC',
      'Mazda MPV Van', 'Mazda MX3', 'Mazda MX6', 'Mazda MX30', 'Mazda Miata MX5',
      'Mazda Millenia', 'Mazda Navajo', 'Mazda Pickup-B1600', 'Mazda Pickup-B1800',
      'Mazda Pickup-B2000', 'Mazda Pickup-B2200', 'Mazda Pickup-B2300', 'Mazda Pickup-B2500',
      'Mazda Pickup-B2600', 'Mazda Pickup-B3000', 'Mazda Pickup-B4000',
      'Mazda Pickup-Rotary', 'Mazda Protege', 'Mazda RX2', 'Mazda RX3', 'Mazda RX4',
      'Mazda RX7', 'Mazda RX8', 'Mazda Tribute','Mazda Other',
    ],
    MercedesBenz: [
      'Mercedes 170', 'Mercedes 190', 'Mercedes 200', 'Mercedes 218', 'Mercedes 219',
      'Mercedes 220', 'Mercedes 230-4 Cyl', 'Mercedes 230-6 Cyl', 'Mercedes 240D',
      'Mercedes 250', 'Mercedes 260E', 'Mercedes 280', 'Mercedes 300D (includes CD',
      'Mercedes 300E', 'Mercedes 300SL', 'Mercedes 320', 'Mercedes 350', 'Mercedes 380',
      'Mercedes 400', 'Mercedes 420', 'Mercedes 450', 'Mercedes 500', 'Mercedes 560',
      'Mercedes 600', 'Mercedes AMG GT', 'Mercedes A Class', 'Mercedes B Class',
      'Mercedes C Class', 'Mercedes CL Class', 'Mercedes CLA Class', 'Mercedes CLK',
      'Mercedes CLS', 'Mercedes E Class', 'Mercedes EQB Class', 'Mercedes EQE Class',
      'Mercedes EQE Class SUV', 'Mercedes EQS Class', 'Mercedes EQS Class SUV',
      'Mercedes G Class', 'Mercedes GL Class', 'Mercedes GLA Class', 'Mercedes GLB Class',
      'Mercedes GLC Class', 'Mercedes GLE Class', 'Mercedes GLK Class',
      'Mercedes GLS Class', 'Mercedes ML Series', 'Mercedes Metris', 'Mercedes R Class',
      'Mercedes S Class', 'Mercedes SL Class', 'Mercedes SLC Class', 'Mercedes SLK',
      'Mercedes SLR', 'Mercedes SLS', 'Mercedes Sprinter 1500',
      'Mercedes Sprinter 2500', 'Mercedes Sprinter 3500', 'Mercedes Sprinter 4500',
      'Mercedes Truck', 'Mercedes Other',
    ],
    Mini: [
      'Mini (Austin)', 'Mini Cooper', 'Mini Cooper Clubman',
      'Mini Cooper Countryman', 'Mini Cooper Paceman','Mini Other',
    ],
    Mitsubishi: [
      'Mitsubishi 3000', 'Mitsubishi Cordia', 'Mitsubishi Diamante',
      'Mitsubishi Eclipse', 'Mitsubishi Eclipse Cross', 'Mitsubishi Endeavor',
      'Mitsubishi Expo', 'Mitsubishi Fuso', 'Mitsubishi Galant', 'Mitsubishi i MiEV',
      'Mitsubishi Lancer', 'Mitsubishi Minicab', 'Mitsubishi Mirage', 'Mitsubishi Montero',
      'Mitsubishi Montero-Sport', 'Mitsubishi Outlander', 'Mitsubishi Outlander Sport',
      'Mitsubishi Pickup (See also Dodge D50)', 'Mitsubishi Precis', 'Mitsubishi Raider',
      'Mitsubishi RVR', 'Mitsubishi Sigma', 'Mitsubishi Space Wagon', 'Mitsubishi Starion',
      'Mitsubishi Tredia', 'Mitsubishi Van','Mitsubishi Other',
    ],
    Nissan: [
      'Nissan 1200', 'Nissan 1600', 'Nissan 200SX', 'Nissan 210',
      'Nissan 240SX', 'Nissan 240Z', 'Nissan 260Z', 'Nissan 280-Z', 'Nissan 280-ZX',
      'Nissan 300ZX', 'Nissan 350Z', 'Nissan 370Z', 'Nissan 310', 'Nissan 311', 'Nissan 410',
      'Nissan 411', 'Nissan 510', 'Nissan 610', 'Nissan 710', 'Nissan 810', 'Nissan Almera',
      'Nissan Altima', 'Nissan Ariya', 'Nissan Armada', 'Nissan Axxess', 'Nissan B210',
      'Nissan Cube', 'Nissan F10', 'Nissan Frontier', 'Nissan GTR', 'Nissan Juke',
      'Nissan Kicks', 'Nissan Leaf', 'Nissan Lucino', 'Nissan Maxima (1981 Down)',
      'Nissan Maxima (1982 Up)', 'Nissan Micra', 'Nissan Murano', 'Nissan NV 200',
      'Nissan NV 1500', 'Nissan NV 2500', 'Nissan NV 3500', 'Nissan NX',
      'Nissan Pathfinder', 'Nissan Patrol', 'Nissan Platina', 'Nissan Pulsar',
      'Nissan Qashqai', 'Nissan Quest', 'Nissan Rogue', 'Nissan Rogue Sport',
      'Nissan Sentra', 'Nissan Stanza (Excl Van)', 'Nissan Stanza Van', 'Nissan Tida',
      'Nissan Truck', 'Nissan Truck-Titan', 'Nissan Truck-Titan XD', 'Nissan Tsubame',
      'Nissan UD Series', 'Nissan Van GC22', 'Nissan Versa', 'Nissan X Trail',
      'Nissan Xterra', 'Nissan Z', 'Nissan Other',
    ],
    Plymouth: [
      'Plymouth Acclaim', 'Plymouth Arrow-Car', 'Plymouth Arrow-Truck (See also Dodge D50)',
      'Plymouth Barracuda', 'Plymouth Breeze', 'Plymouth Caravelle', 'Plymouth Champ',
      'Plymouth Cricket', 'Plymouth Duster (1970-1976)', 'Plymouth Duster (1979-1980)',
      'Plymouth Duster (1985-1987)', 'Plymouth Duster (1992-1994)',
      'Plymouth Grand Fury (1979 Down)', 'Plymouth Grand Fury (1980 Up)',
      'Plymouth Horizon', 'Plymouth Laser', 'Plymouth Neon', 'Plymouth Prowler',
      'Plymouth Reliant', 'Plymouth Sapporo', 'Plymouth Scamp (1983 only)',
      'Plymouth Scamp (except 1983)', 'Plymouth Sundance', 'Plymouth Trailduster',
      'Plymouth Valiant', 'Plymouth Van 100', 'Plymouth Van 150', 'Plymouth Van 200',
      'Plymouth Van 250', 'Plymouth Van 300', 'Plymouth Van 350', 'Plymouth Volare',
      'Plymouth Voyager', 'Plymouth Other',  'Plymouth Other',
    ],
    Pontiac: [
      'Pontiac 1000', 'Pontiac 2000-P', 'Pontiac 6000', 'Pontiac Acadian',
      'Pontiac Astre', 'Pontiac Aztek', 'Pontiac Bonneville (1979 Down)',
      'Pontiac Bonneville (1980 Up)', 'Pontiac Catalina (1979 Down)',
      'Pontiac Catalina (1980 Up)', 'Pontiac Fiero', 'Pontiac Firebird',
      'Pontiac Firefly', 'Pontiac G3', 'Pontiac G4', 'Pontiac G5', 'Pontiac G6',
      'Pontiac G8', 'Pontiac Grand AM', 'Pontiac Grand Prix', 'Pontiac GTO (New Style)',
      'Pontiac GTO (Old Style)', 'Pontiac Lemans', 'Pontiac Matiz', 'Pontiac Montana',
      'Pontiac Parisienne (1979 Down)', 'Pontiac Parisienne (1980 Up)', 'Pontiac Phoenix',
      'Pontiac Pursuit', 'Pontiac Solstice', 'Pontiac Sunbird', 'Pontiac Sunburst',
      'Pontiac Sunfire', 'Pontiac Sunrunner', 'Pontiac Tempest', 'Pontiac Torrent',
      'Pontiac Trans Sport', 'Pontiac Van-Montana', 'Pontiac Ventura', 'Pontiac Vibe',
      'Pontiac Wave',  'Pontiac Other',
    ],
    Ram: [
      'Ram Promaster 1500', 'Ram Promaster 2500', 'Ram Promaster 3500',
      'Ram Promaster City', 'Ram Truck 1500 Series', 'Ram Truck 2500 Series',
      'Ram Truck 3500 Series', 'Ram Truck 4500 Series', 'Ram Truck 5500 Series',
      'Ram Other',
    ],
    Subaru: [
     'Subaru Ascent', 'Subaru Baja', 'Subaru Brat', 'Subaru BRZ', 'Subaru Chaser',
     'Subaru Crosstrek', 'Subaru Forester', 'Subaru Impreza', 'Subaru Justy',
     'Subaru Legacy', 'Subaru Loyale', 'Subaru Outback (Impreza)', 'Subaru Outback (Legacy)',
     'Subaru Sambar', 'Subaru Solterra', 'Subaru Streega', 'Subaru SVX', 'Subaru Tribeca',
     'Subaru WRX (2014 Down)', 'Subaru WRX (2015 Up)', 'Subaru XT', 'Subaru XV Crosstrek',
     'Subaru Other',
    ],
    Suzuki: [
      'Suzuki Aerio','Suzuki Carry', 'Suzuki Esteem', 'Suzuki Equator', 'Suzuki Forenza',
      'Suzuki Forsa', 'Suzuki Kizashi', 'Suzuki Reno', 'Suzuki Samurai', 'Suzuki Sidekick',
      'Suzuki SJ410', 'Suzuki Swift', 'Suzuki SX4', 'Suzuki Verona', 'Suzuki Vitara',
      'Suzuki X90', 'Suzuki XL7',  'Suzuki Other',
    ],
    Tesla: [
      'Tesla Model 3', 'Tesla Model S', 'Tesla Model X', 'Tesla Model Y','Tesla Roadster',
      'Tesla Other',
    ],
    Toyota: [
      'Toyota 86', 'Toyota 4Runner', 'Toyota Aristo', 'Toyota Avalon', 'Toyota BZ4X',
      'Toyota CHR', 'Toyota Camry', 'Toyota Carina', 'Toyota Celica', 'Toyota Corolla',
      'Toyota Corolla Cross', 'Toyota Corolla FX', 'Toyota Corolla iM', 'Toyota Corona MKII',
      'Toyota Corona not MKII', 'Toyota Cressida', 'Toyota Crown', 'Toyota Echo',
      'Toyota FJ Cruiser', 'Toyota FX', 'Toyota GR86', 'Toyota GR Corolla',
      'Toyota GR Supra', 'Toyota HiAce', 'Toyota Highlander', 'Toyota Land Cruiser',
      'Toyota Matrix', 'Toyota Mirai', 'Toyota MR2', 'Toyota Paseo', 'Toyota Previa',
      'Toyota Prius', 'Toyota RAV4', 'Toyota Sequoia', 'Toyota Sienna', 'Toyota Solara',
      'Toyota Starlet', 'Toyota Stout', 'Toyota Supra', 'Toyota T100', 'Toyota Tacoma',
      'Toyota Tercel', 'Toyota Truck (except T100 & Tundra)', 'Toyota Tundra',
      'Toyota Van (See also Previa)', 'Toyota Venza', 'Toyota Yaris',
      'Toyota Yaris iA','Toyota Other',
    ],
    Volkswagen: [
      'Volkswagen 412', 'Volkswagen Arteon', 'Volkswagen Atlas', 'Volkswagen Atlas Cross Sport',
      'Volkswagen Beetle', 'Volkswagen Cabrio', 'Volkswagen Cabriolet', 'Volkswagen CC',
      'Volkswagen Corrado', 'Volkswagen Dasher', 'Volkswagen Derby', 'Volkswagen Eos',
      'Volkswagen Fox', 'Volkswagen Golf', 'Volkswagen Golf GTI', 'Volkswagen ID.4',
      'Volkswagen Jetta', 'Volkswagen Jetta GLI', 'Volkswagen Karmann Ghia',
      'Volkswagen Passat', 'Volkswagen Phaeton', 'Volkswagen Pointer',
      'Volkswagen Pointer Truck', 'Volkswagen Quantum', 'Volkswagen Rabbit',
      'Volkswagen Routan', 'Volkswagen Scirocco', 'Volkswagen Sedan', 'Volkswagen Sharan',
      'Volkswagen Taos', 'Volkswagen Thing', 'Volkswagen Tiguan', 'Volkswagen Touareg',
      'Volkswagen Type 3', 'Volkswagen Van-EuroVan', 'Volkswagen Van-Transporter',
     'Volkswagen Van-Vanagon', 'Volkswagen Other',
    ],
    Volvo: [
      'Volvo 30 Series', 'Volvo 40 Series', 'Volvo 50 Series', 'Volvo 60 Series',
      'Volvo 70 Series', 'Volvo 80 Series', 'Volvo 90 Series', 'Volvo 120 Series',
      'Volvo 140 Series', 'Volvo 160 Series', 'Volvo 240', 'Volvo 260', 'Volvo 444',
      'Volvo 544', 'Volvo 740', 'Volvo 760', 'Volvo 780', 'Volvo 850', 'Volvo 940',
      'Volvo 960', 'Volvo 1800', 'Volvo C40', 'Volvo F7', 'Volvo FE6', 'Volvo S60 (2013 Down)',
      'Volvo S60 (2014 Up)', 'Volvo S90', 'Volvo Truck', 'Volvo V60', 'Volvo V70',
      'Volvo V90', 'Volvo XC40', 'Volvo XC60 (2013 Down)', 'Volvo XC60 (2014 Up)',
      'Volvo XC70', 'Volvo XC90',  'Volvo Other',
    ],
  },
  parts: [
    "A Pillar",
"A Pillar Trim",
"A/C Bracket",
"A/C Compressor",
"A/C Compressor Clutch Only",
"A/C Condenser",
"A/C Condenser Fan",
"A/C Control Computer",
"A/C Evaporator",
"A/C Evaporator Housing only",
"A/C Heater Control (see also Radio or TV Screen)",
"A/C Hose",
"A/C Wiring Harness",
"Accelerator Cable",
"Accelerator Parts",
"Adaptive Cruise Projector",
"Air Bag",
"Air Bag Clockspring",
"Air Bag Ctrl Module",
"Air Box/Air Cleaner",
"Air Cond./Heater Vents",
"Air Flow Meter",
"Air Pump",
"Air Ride Compressor",
"Air Shutter",
"Air Tube/Resonator",
"Alternator",
"Alternator Bracket",
"Amplifier/Radio",
"Antenna",
"Anti-Lock Brake Computer",
"Anti-Lock Brake Pump",
"Armrest",
"Ash Tray/Lighter",
"Audiovisual (A/V) (see also TV Screen)",
"Automatic Headlight Dimmer",
"Auto. Trans. Cooler",
"Axle Actuator (4WD)",
"Axle Assy Fr (4WD w. Housing)",
"Axle Assy Rear (w. Housing)",
"Axle Beam Front (2WD, incl I Beam Susp)",
"Axle Beam Rear (FWD)",
"Axle Flange",
"Axle Housing Only",
"Axle Shaft",
"B Pillar Trim",
"Back Door (above rear bumper)",
"Back Door Glass",
"Back Door Handle, Inside",
"Back Door Handle, Outside",
"Back Door Hinge",
"Back Door Moulding",
"Back Door Shell",
"Back Door Trim Panel",
"Back Glass",
"Back Glass Regulator",
"Back Glass Shock",
"Backing Plate, Front",
"Backing Plate, Rear",
"Backup Camera",
"Backup Light",
"Battery",
"Battery Cable",
"Battery Terminal",
"Battery Tray",
"Bed, Pickup",
"Bed Floor (Pickup)",
"Bed Front Panel (Pickup)",
"Bed Liner",
"Bed Side, Pickup",
"Bell Housing",
"Belt Tensioner",
"Blind Spot Camera",
"Blower Motor",
"Body Wiring Harness",
"Brake/Clutch Pedal",
"Brake Booster",
"Brake Proportioning Valve",
"Brake Rotor/Drum, Front",
"Brake Rotor/Drum, Rear",
"Brake Shoes/Pads",
"Brush Guard",
"Bug Screen",
"Bumper Assy (Front) includes cover",
"Bumper Assy (Rear) includes cover",
"Bumper Bracket (Misc)",
"Bumper Cover (Front)",
"Bumper Cover (Rear)",
"Bumper End Cap",
"Bumper Energy Absorber (Front)",
"Bumper Energy Absorber (Rear)",
"Bumper Face Bar (Front)",
"Bumper Face Bar (Rear)",
"Bumper Filler Panel",
"Bumper Guard (Front)",
"Bumper Guard (Rear)",
"Bumper Impact Strip",
"Bumper Reinforcement (Front)",
"Bumper Reinforcement (Rear)",
"Bumper Shock",
"Bumper Step Pad",
"C Pillar Trim",
"Cab",
"Cab Back Panel",
"Cab Clip, no cowl",
"Cab Corner",
"Cabin Air Filter",
"Cabin Fuse Box",
"Caliper",
"Camera Projector",
"Camshaft",
"Camshaft Housing",
"Carburetor (see also Throttle Body)",
"Cargo Cover/Shade",
"Cargo Lamp",
"Carpet",
"Carrier (see also Differential)",
"Carrier Case",
"CD Player/Radio",
"Center Cap (Wheel)",
"Center Pillar",
"Charging Port Door Assembly",
"Chassis Control Computer (not Engine)",
"Clock",
"Clockspring (Air Bag)",
"Clutch Cable",
"Clutch Disc",
"Clutch Fork",
"Clutch Master Cylinder",
"Coil/Air Spring",
"Coil/Igniter",
"Column Switch",
"Computer Box Engine",
"Computer Box Not Engine",
"Condenser",
"Condenser/Radiator mtd. Cooling Fan",
"Connecting Rod, Engine",
"Console, Front",
"Console, Rear",
"Control Arm, Front Lower",
"Control Arm, Front Upper",
"Control Arm, Rear Lower",
"Control Arm, Rear Upper",
"Convertible Top",
"Convertible Top Boot",
"Convertible Top Lift",
"Convertible Top Motor",
"Convertible Windscreen",
"Coolant Pump",
"Cooling Fan (Rad and Con mtd.)",
"Core (Radiator) Support",
"Cowl",
"Cowl Vent Panel",
"Crank Pulley (Harmonic Balancer)",
"Crankshaft",
"Cruise Control Computer",
"Cruise Control Servo/Regulator",
"Cruise Speed Controler",
"Cylinder Head (Engine)",
"D Pillar",
"Dash/Interior/Seat Switch",
"Dash Bezel (see also Instrument or Radio Bezel)",
"Dash Pad",
"Dash Panel",
"Dash Wiring Harness",
"Deck Lid Assembly",
"Deck Lid/Trunk Lid Shell",
"Diesel Particulate Filter",
"Differential Assembly (see also Carrier)",
"Differential Case Only",
"Differential Flange Only",
"Distributor",
"Door Back (door above rear bumper)",
"Door Front",
"Door Handle, Inside",
"Door Handle, Outside",
"Door Lock Striker",
"Door Mirror Cover",
"Door Outer Repair Panel, Back",
"Door Outer Repair Panel, Front",
"Door Outer Repair Panel, Rear",
"Door Rear (side of vehicle)",
"Door Shell, Back",
"Door Shell, Front",
"Door Shell, Rear",
"Door Window Crank Handle",
"Drag Link",
"Drive-By-Wire",
"Drive Shaft, Front",
"Drive Shaft, Rear",
"Driving Lamp Bezel",
"EGR Valve",
"Electric Door Motor (not Window)",
"Electric Window Motor",
"Electrical Part Misc",
"Electronic Transmission Shifter",
"Emblem",
"Emergency Brake",
"Engine",
"Engine Block",
"Engine Computer",
"Engine Core",
"Engine Cover",
"Engine Cradle",
"Engine Cylinder Head",
"Engine Fuse Box",
"Engine Mounts",
"Engine Oil Pan",
"Engine Wiring Harness",
"Exhaust Assembly",
"Exhaust Cross Pipe",
"Exhaust Fluid Pump",
"Exhaust Fluid Tank",
"Exhaust Heat Shield",
"Exhaust Lead Pipe",
"Exhaust Manifold",
"Exhaust Muffler",
"Exhaust Pipe",
"Exhaust Resonator",
"Exhaust Tail Pipe",
"Fan Blade",
"Fan Clutch",
"Fender",
"Fender Extension/Flare",
"Fender Inner Panel",
"Fender Moulding",
"Fender Skirt",
"Fender/Wheelhouse Inner Liner",
"Flex Plate",
"Floor Mats",
"Floor Pan",
"Floor Shift Assembly",
"Flywheel",
"Fog Lamp",
"Fog Lamp Bezel",
"Fog Lamp Bracket",
"Fog Lamp Rear",
"Fog Lamp Switch",
"Frame",
"Frame Front Section Only",
"Frame Horn",
"Frame Upper &amp; Lower Rails",
"Front Axle Assembly (4WD w Housing)",
"Front Axle Beam (2WD, incl I Beam Susp)",
"Front Axle Shaft",
"Front Bumper Assembly (includes cover)",
"Front Bumper Cover",
"Front Bumper Face Bar",
"Front Bumper Guard",
"Front Bumper Reinforcement",
"Front Console",
"Front Door",
"Front Door Glass",
"Front Door Handle, Inside",
"Front Door Handle, Outside",
"Front Door Hinge",
"Front Door Mirror",
"Front Door Mirror Glass",
"Front Door Moulding",
"Front Door Regulator",
"Front Door Shell",
"Front Door Switch",
"Front Door Trim Panel",
"Front Door Vent Glass",
"Front Door Vent Glass Regulator",
"Front Door Window Motor",
"Front Drive Shaft",
"Front End Assembly (Nose)",
"Front Seat Belt Assembly",
"Front Valance",
"Front Window Regulator",
"Fuel Cap",
"Fuel Cell",
"Fuel Cooler",
"Fuel Distributor (&amp; Misc. Injection)",
"Fuel Filler Door",
"Fuel Filler Neck",
"Fuel Gauge",
"Fuel Injector (&amp; Misc. Injection)",
"Fuel Injector Pump",
"Fuel Line",
"Fuel Pump",
"Fuel Rail (&amp; Misc. Injection)",
"Fuel Tank",
"Fuel Tank Sending Unit",
"Fuse Box (Cabin)",
"Fuse Box (Engine)",
"Gas Cap",
"Gas Tank",
"Gate Interior Trim Panel",
"Gate Window Regulator",
"Gate/Lid",
"Gauge (Misc)",
"Generator",
"Glass, Back",
"Glass, Front Door",
"Glass, Front Vent",
"Glass, Quarter Window",
"Glass, Rear Door",
"Glass, Rear Vent",
"Glass, Special (see also Sunroof/TTop)",
"Glass, Windshield",
"Glove Box",
"GPS Screen (see also Radio or Heater/AC Control)",
"Grille",
"Grille Moulding",
"Grille Surround",
"Harmonic Balancer (Crank Pulley)",
"Hatch/Trunk Lid",
"Head (Cylinder)",
"Header Panel",
"Headlight Assembly",
"Headlight Ballast",
"Headlight Bracket",
"Headlight Bucket",
"Headlight Bulb",
"Headlight Cover (Plastic)",
"Headlight Door",
"Headlight Housing",
"Headlight Igniter",
"Headlight Lens",
"Headlight Motor",
"Headlight Switch (Column Mounted)",
"Headlight Switch (Dash Mounted)",
"Headlight Switch (see also Column Switch)",
"Headlight Washer Motor Only",
"Headlight Wiper Motor Only",
"Headliner",
"Headrest",
"Heads Up Display",
"Heat Pump Reversing Valve",
"Heater Assy",
"Heater Core",
"Heater Motor",
"Heater/AC Control (see also Radio or TV Screen)",
"Hood",
"Hood Deflector",
"Hood Hinge",
"Hood Insulation Pad",
"Hood Latch",
"Hood Ornament",
"Hood Prop",
"Hood Scoop",
"Hood Shock",
"Horn",
"Hub",
"Hub Cap/Wheel Cover (display w image)",
"Hub Cap/Wheel Cover (display w/o image)",
"Hub, Lockout (4WD)",
"HVAC Actuator",
"Hybrid Converter/Inverter",
"Idler Arm",
"Ignition Module (see also Ignitor/Coil)",
"Ignition Switch",
"Ignitor/Coil",
"Info Screen (see also Radio or Heater/AC Control)",
"Information Label",
"Inside Door Handle",
"Instrument Cluster (see also Speedo)",
"Instrument Cluster Bezel",
"Instrument Face Plate",
"Intake Manifold",
"Intercooler",
"Intercooler Pipe",
"Interior Complete",
"Interior Light",
"Interior Trim Panel (Gate/Lid)",
"Interior Trim Panel (Quarter)",
"Interior Trim Panel, Door (Back)",
"Interior Trim Panel, Door (Front)",
"Interior Trim Panel, Door (Rear)",
"Inverter Cooler",
"Jack Assembly",
"Keys/Latches and Locks",
"Key Remote/Fob",
"Kick Panel",
"Knee Assembly (see also Strut Assy)",
"Lamp Wiring Harness",
"Latch, Front Door",
"Latch, Rear Door",
"Latch, Back Door",
"Latches",
"Leaf Spring, Front",
"Leaf Spring, Rear",
"License Lamp",
"License Plate Bracket",
"Lid/Gate",
"Lid Interior Trim Panel",
"Liftgate Assembly",
"Liftgate Shell",
"Lock Actuator",
"Lockout Hub, 4X4",
"Locks",
"Lug Wrench",
"Luggage Rack",
"Marker/Fog Light, Front",
"Marker/Side Light, Rear",
"Master Cylinder",
"Mirror, Door",
"Mirror, Rear View",
"Misc. Electrical",
"Moulding (Back Door)",
"Moulding (Fender)",
"Moulding (Front Door)",
"Moulding (Lid/Hatch/Gate)",
"Moulding (Quarter Panel/Bed Side)",
"Moulding (Rear Door)",
"Moulding (Rocker)",
"Moulding (Windshield)",
"Mouldings (Misc)",
"Mud Flap",
"Neutral Safety Switch",
"Night Vision Camera",
"Nose (Front End Assembly)",
"Oil Cooler",
"Oil Filter Adapter",
"Oil Pan, Engine",
"Oil Pan, Transmission",
"Oil Pump, Engine",
"Outside Door Handle",
"Overdrive Unit (see also Transmission)",
"Owners Manual",
"Paddle Shifter",
"Park/Fog Lamp Front",
"Parcel Shelf",
"Park Lamp Rear (Side)",
"Parking Assist Camera",
"Pickup Bed",
"Pickup Bed Floor",
"Pickup Bed Front Panel",
"Pickup Bed Side",
"Pickup Cap/Camper Shell",
"Piston",
"Pitman Arm",
"Power Brake Booster",
"Power Inverter (Hybrid)",
"Power Steering Assy",
"Power Steering Control Valve",
"Power Steering Cooler",
"Power Steering Motor",
"Power Steering Pressure Cyl",
"Power Steering Pressure Hose",
"Power Steering Pump",
"Power Steering Rack/Box/Gear",
"Power Steering Reservoir",
"Pressure Plate",
"Push Rod (Engine)",
"Quarter Interior Trim Panel",
"Quarter Moulding",
"Quarter Panel",
"Quarter Panel Extension",
"Quarter Repair Panel",
"Quarter Window",
"Quarter Window Motor",
"Quarter Window Regulator",
"Rack &amp; Pinion (Steering)",
"Radiator",
"Radiator/Condenser mtd. Cooling Fan",
"Radiator Air Shutter",
"Radiator Core Support",
"Radiator Cover Baffle",
"Radiator Fan Shroud",
"Radiator Overflow Bottle",
"Radio/CD (see also A/C Control or TV Screen)",
"Radio Bezel Trim",
"Radio Face Plate",
"Radius Arm, Front",
"Rag Joint (see also Steering Coupler)",
"Rear Axle Assy (RWD)",
"Rear Axle Beam (FWD)",
"Rear Body Panel",
"Rear Bumper Assembly (includes cover)",
"Rear Bumper Cover",
"Rear Bumper Face Bar",
"Rear Bumper Guard",
"Rear Bumper Reinforcement/Misc",
"Rear Clip",
"Rear Console",
"Rear Crossmember",
"Rear Door (side of vehicle)",
"Rear Door Handle, Inside",
"Rear Door Handle, Outside",
"Rear Door Hinge",
"Rear Door Moulding",
"Rear Door Regulator",
"Rear Door Shell",
"Rear Door Switch",
"Rear Door Trim Panel",
"Rear Door Vent Glass",
"Rear Door Vent Glass regulator",
"Rear Door Window",
"Rear Door Window Motor",
"Rear Door Window Regulator",
"Rear Drive Shaft",
"Rear Finish Panel",
"Rear Gate/Lid",
"Rear Gate Window Motor",
"Rear Knuckle/Stub Axle",
"Rear Lower Valance",
"Rear Seat Belt Assembly",
"Rear Suspension (see also Control Arms)",
"Rear Suspension Locating Arm",
"Rear Suspension Trailing Arm",
"Rear Window Defogger",
"Rear Window Washer Motor",
"Receiver Dryer",
"Relay (Misc)",
"Ring and Pinion Only",
"Rocker Arm",
"Rocker Moulding",
"Rocker Panel (see also Center Pillar)",
"Roll Bar",
"Roll Bar Padding",
"Roof",
"Roof Glass Frame/Track",
"Roof Panel (see also Sunroof)",
"Roof Rack",
"Running Boards",
"Running Board Motor",
"Seat, Back (3rd Row)",
"Seat, Back (4th Row)",
"Seat, Back (5th Row)",
"Seat, Front",
"Seat, Rear (2nd Row)",
"Seat Belt, Front",
"Seat Belt, Rear",
"Seat Belt Motor",
"Seat Belt Pretensioner",
"Seat Belt Track (Electric)",
"Seat Motor",
"Seat Switch",
"Seat Track, Front Only",
"Sensor (Body, Misc)",
"Sensor (Chassis, Misc)",
"Sensor (Drivetrain, Misc)",
"Shifter Assembly (Floor)",
"Shifter Linkage",
"Shock Absorber",
"Shock Mount",
"Sill Plate",
"Skid Plate",
"Slave Cylinder",
"Smog Pump",
"Spare Tire Carrier",
"Spare Tire Cover",
"Spare Tire Hoist",
"Speaker",
"Special Glass",
"Speedometer (see also Instr. Cluster)",
"Speedometer Cable",
"Spindle",
"Spoiler, Front",
"Spoiler, Rear",
"Spring Hanger",
"Stabilizer Bar Only",
"Starter",
"Steering Column",
"Steering Column Shaft",
"Steering Coupler",
"Steering Knuckle (see also Knee &amp; Strut)",
"Steering Pump",
"Steering Rack/Box/Gear",
"Steering Wheel",
"Strut (see also Knee Assy)",
"Strut Tower Brace",
"Sun Roof / T-Top",
"Sun Roof Motor",
"Sunvisor",
"Supercharger/Turbocharger",
"Tachometer",
"Tail Light",
"Tail Light Circuit Board",
"Tail Light Lens",
"Tailgate Cable",
"Tailgate/Trunk Lid",
"Tailgate Hinge",
"Tailgate Lift Motor",
"Tailgate Shell",
"Tailgate Window Regulator",
"Thermostat Housing",
"Third Brake Light",
"Throttle Body/Throttle Valve Housing",
"Throwout Bearing",
"Tie Rod",
"Timing Belt/Chain",
"Timing Cover",
"Timing Gears",
"Tire",
"Tonneau Cover",
"Torque Convertor",
"Torsion Bar",
"Tow Hook",
"Track/Watts Linkage",
"Trailer Brake Controller",
"Trailer Hitch",
"Trans OD Unit (see also Transmission)",
"Transaxle Housing Only",
"Transfer Case",
"Transfer Case Adapter",
"Transfer Case Core",
"Transfer Case Electric Motor",
"Transfer Case Switch",
"Transmission",
"Transmission Bellhousing Only",
"Transmission Clutch Actuator",
"Transmission Computer",
"Transmission Core",
"Transmission Crossmember",
"Transmission Front Pump",
"Transmission Mount",
"Transmission Pan",
"Transmission Torque Converter",
"Transmission Valve Body",
"Transmission Wiring Harness",
"Trim Ring",
"Trunk Lid Pull Down Motor",
"Trunk Lid/Hatch",
"Trunk Lid/Hatch Hinge",
"Trunk Lid/Hatch Shock",
"Trunk Lid/Tailgate Moulding",
"TTop/Sunroof",
"Turbo/Supercharger Core",
"Turbocharger/Supercharger",
"Turn Signal/Fog Lamp",
"TV Screen (see also Radio or Heater/AC Control)",
"Uniside",
"Utility Bed",
"Utility Box",
"Vacuum Pump",
"Vacuum Storage Tank",
"Valance, Front",
"Valance, Rear",
"Valve Cover",
"Vapor Canister",
"Voltage Regulator",
"Washer Nozzle",
"Water Pump",
"Water Separator",
"Weather Stripping",
"Wheel (display w image)",
"Wheel (display w/o image)",
"Wheel Bearing",
"Wheel Cover/Hubcap (display w image)",
"Wheel Cover/Hubcap (display w/o image)",
"Wheel Lug Nut",
"Wheel Opening Moulding",
"Wheelchair Lift",
"Wheelchair Ramp",
"Wheelhouse (Rear)",
"Winch",
"Window Motor",
"Window Regulator (Front)",
"Window Regulator (Rear)",
"Window Shade",
"Window Switch (Front Door)",
"Window Switch (Rear Door)",
"Window Washer Motor, Rear",
"Windshield",
"Windshield Frame",
"Windshield Hinge",
"Windshield Washer Motor (Front)",
"Windshield Washer Reservoir",
"Wiper Arm",
"Wiper Linkage",
"Wiper Motor, Front (Windshield)",
"Wiper Motor, Rear",
"Wiring Harness (Air Conditioning)",
"Wiring Harness (Body)",
"Wiring Harness (Dash)",
"Wiring Harness (Engine)",
"Wiring Harness (Lamp)",
"Wiring Harness (Misc)",
"Wiring Harness (Transmission)",
"Yoke/U-Joint",
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
            src="/mainpage1.jpg"
            alt="Car Part 1"
            width={250}
            height={150}
            className="rounded-md w-full"
          />
          <Image
            src="/mainpage2.jpg"
            alt="Car Part 2"
            width={250}
            height={150}
            className="rounded-md w-full"
          />
          <Image
            src="/mainpage3.jpg"
            alt="Car Part 3"
            width={250}
            height={150}
            className="rounded-md w-full"
          />
          <Image
            src="/mainpage4.jpg"
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
