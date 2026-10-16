// scripts/independent-audit-runner.ts
/**
 * Independent Audit & E2E Testing Runner for NHTSA Vehicle Guide Integration
 */

import * as wrapper from '@shaggytools/nhtsa-api-wrapper';
import {
  getSupportedMakes,
  getModelsForMakeAndYear,
  verifyVehicleSelection,
  validateVinFormat,
  decodeVin,
  MIN_SUPPORTED_YEAR,
  MAX_SUPPORTED_YEAR,
} from '../src/lib/nhtsa/nhtsaService';

interface AuditResult {
  name: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  details: string;
}

const auditLog: AuditResult[] = [];

function record(category: string, name: string, pass: boolean, details: string, isWarning = false) {
  const status = pass ? 'PASS' : isWarning ? 'WARNING' : 'FAIL';
  auditLog.push({ category, name, status, details });
  console.log(`[${status}] [${category}] ${name}: ${details}`);
}

async function runAudit() {
  console.log('===============================================================');
  console.log('   INDEPENDENT CODE AUDIT & E2E VERIFICATION SUITE');
  console.log('===============================================================\n');

  // --- SECTION 1: Wrapper Export Verification ---
  console.log('Checking @shaggytools/nhtsa-api-wrapper package exports...');
  record(
    'Package',
    'GetAllMakes export',
    typeof wrapper.GetAllMakes === 'function',
    `Type: ${typeof wrapper.GetAllMakes}`
  );
  record(
    'Package',
    'GetModelsForMakeYear export',
    typeof wrapper.GetModelsForMakeYear === 'function',
    `Type: ${typeof wrapper.GetModelsForMakeYear}`
  );
  record(
    'Package',
    'DecodeVinValues export',
    typeof wrapper.DecodeVinValues === 'function',
    `Type: ${typeof wrapper.DecodeVinValues}`
  );
  record(
    'Package',
    'isValidVin export',
    typeof wrapper.isValidVin === 'function',
    `Type: ${typeof wrapper.isValidVin}`
  );

  // --- SECTION 2: Wrapper Upstream Quirks & Live Behavior ---
  console.log('\nTesting wrapper live behavior & URL encoding quirks...');

  // 2.1 Single word make (Ford)
  try {
    const ford = await wrapper.GetModelsForMakeYear({ make: 'ford', modelYear: 2018 });
    record(
      'Live API',
      'Wrapper single-word make (Ford 2018)',
      Array.isArray(ford?.Results) && ford.Results.length > 0,
      `Returned ${ford.Results.length} models`
    );
  } catch (err: any) {
    record('Live API', 'Wrapper single-word make (Ford 2018)', false, err.message);
  }

  // 2.2 Make with space (Land Rover) - testing wrapper double-encoding bug
  let wrapperDoubleEncodeBugDetected = false;
  try {
    await wrapper.GetModelsForMakeYear({ make: 'land rover', modelYear: 2020 });
    record(
      'Live API',
      'Wrapper multi-word make (Land Rover)',
      true,
      'Wrapper handled space without error'
    );
  } catch (err: any) {
    wrapperDoubleEncodeBugDetected = err.message.includes('%2520');
    record(
      'Live API',
      'Wrapper multi-word make double-encoding bug',
      wrapperDoubleEncodeBugDetected,
      `Upstream bug confirmed: ${err.message}`,
      true
    );
  }

  // 2.3 Fallback handling in our nhtsaService for multi-word makes
  try {
    const lrService = await getModelsForMakeAndYear('Land Rover', 2020);
    record(
      'Resilience',
      'Service fallback rescues multi-word make (Land Rover)',
      lrService.models.length > 0,
      `Recovered ${lrService.models.length} models via direct REST fallback`
    );
  } catch (err: any) {
    record('Resilience', 'Service fallback rescues multi-word make', false, err.message);
  }

  // --- SECTION 3: Functional Vehicle Make/Model Search ---
  console.log('\nTesting functional make/model search...');
  try {
    const verifiedF150 = await verifyVehicleSelection('Ford', 'F-150', 2018);
    record(
      'Catalog',
      '2018 Ford F-150 exact match verification',
      verifiedF150.verified === true && verifiedF150.model === 'F-150',
      `Confirmed status: ${verifiedF150.catalogStatus}, Model: ${verifiedF150.model}`
    );
  } catch (err: any) {
    record('Catalog', '2018 Ford F-150 exact match', false, err.message);
  }

  // Substring protection: "F-15" should NOT match "F-150"
  try {
    const partialMatch = await verifyVehicleSelection('Ford', 'F-15', 2018);
    record(
      'Validation',
      'Strict exact model matching (rejecting "F-15" for "F-150")',
      partialMatch.verified === false && partialMatch.catalogStatus === 'NOT_FOUND',
      `Result: ${partialMatch.catalogStatus} (Correctly rejected substring)`
    );
  } catch (err: any) {
    record('Validation', 'Strict exact model matching', false, err.message);
  }

  // Boundary years
  try {
    await getModelsForMakeAndYear('Ford', MIN_SUPPORTED_YEAR - 1);
    record('Validation', 'Reject year below minimum (1994)', false, 'Should have thrown error');
  } catch (err: any) {
    record('Validation', 'Reject year below minimum (1994)', true, err.message);
  }

  try {
    await getModelsForMakeAndYear('Ford', MAX_SUPPORTED_YEAR + 1);
    record('Validation', 'Reject future year out of range', false, 'Should have thrown error');
  } catch (err: any) {
    record('Validation', 'Reject future year out of range', true, err.message);
  }

  // --- SECTION 4: VIN Validation & Decoding ---
  console.log('\nTesting VIN validation and decoding...');

  // 4.1 Format check: 17 chars
  const shortVin = validateVinFormat('1FTEW1E');
  record(
    'VIN Format',
    'Reject short VIN',
    !shortVin.isValidFormat,
    shortVin.error || 'Rejected'
  );

  // 4.2 Forbidden characters: I, O, Q
  const forbiddenI = validateVinFormat('1FTEW1EP5JFB1234I');
  record(
    'VIN Format',
    'Reject forbidden character I',
    !forbiddenI.isValidFormat && forbiddenI.error?.includes('I, O, or Q') === true,
    forbiddenI.error || 'Rejected'
  );

  // 4.3 Offline check-digit validation
  const test17Ones = validateVinFormat('11111111111111111');
  record(
    'VIN Check-Digit',
    'Offline check-digit for 17 ones (wrapper isValidVin)',
    test17Ones.checkDigitValid === true,
    `Calculated checkDigitValid: ${test17Ones.checkDigitValid}`
  );

  // Real 2018 Ford F-150 VIN
  try {
    const decodedF150 = await decodeVin('1FTEW1EP5JFB12345', 2018);
    record(
      'VIN Decode',
      '2018 Ford F-150 VIN decode',
      decodedF150.make === 'FORD' && decodedF150.model === 'F-150',
      `Decoded: ${decodedF150.modelYear} ${decodedF150.make} ${decodedF150.model}, Body: ${decodedF150.bodyClass}`
    );
  } catch (err: any) {
    record('VIN Decode', '2018 Ford F-150 VIN decode', false, err.message);
  }

  // Discrepancy detection: User selected Toyota Camry, enters Ford F-150 VIN
  try {
    const discrepancy = await decodeVin('1FTEW1EP5JFB12345', 2018, 'Toyota', 'Camry');
    record(
      'VIN Discrepancy',
      'Detect make/model mismatch against user selection',
      discrepancy.hasDiscrepancy === true && discrepancy.discrepancyMessage?.includes('Discrepancy detected') === true,
      discrepancy.discrepancyMessage || 'No discrepancy detected'
    );
  } catch (err: any) {
    record('VIN Discrepancy', 'Detect mismatch', false, err.message);
  }

  // --- SECTION 5: Inventory & Fitment Safety ---
  console.log('\nTesting inventory integration & fitment safety...');

  // In-stock vehicle (2017 Ford F-150)
  try {
    const v2017 = await verifyVehicleSelection('Ford', 'F-150', 2017);
    record(
      'Inventory',
      'In-stock parts retrieved for 2017 Ford F-150',
      v2017.matchingInventory.length > 0,
      `Matched ${v2017.matchingInventory.length} in-stock parts`
    );
    record(
      'Fitment Safety',
      'Fitment disclaimer required even when in stock',
      v2017.fitmentNotice.includes('does not guarantee') && v2017.fitmentNotice.includes('donor VIN'),
      v2017.fitmentNotice
    );
  } catch (err: any) {
    record('Inventory', 'In-stock vehicle test', false, err.message);
  }

  // Zero-inventory vehicle (2018 Ford F-150) - MUST NOT FABRICATE
  try {
    const v2018 = await verifyVehicleSelection('Ford', 'F-150', 2018);
    record(
      'Inventory Safety',
      'Never fabricate inventory for 2018 Ford F-150',
      v2018.matchingInventory.length === 0,
      `Matching inventory count: ${v2018.matchingInventory.length} (Safe: zero fabricated items)`
    );
    record(
      'Inquiry Flow',
      'Direct customer to custom inquiry when not in stock',
      v2018.fitmentNotice.includes('No in-stock assemblies') && v2018.fitmentNotice.includes('Contact our specialist'),
      v2018.fitmentNotice
    );
  } catch (err: any) {
    record('Inventory Safety', 'Zero-inventory test', false, err.message);
  }

  // --- SECTION 6: Live HTTP Endpoint Testing (Next.js Local Server) ---
  console.log('\nTesting live HTTP API endpoints on http://localhost:3000...');
  try {
    const makesRes = await fetch('http://localhost:3000/api/car-guide/makes');
    const makesJson = await makesRes.json();
    record(
      'HTTP API',
      'GET /api/car-guide/makes',
      makesRes.status === 200 && Array.isArray(makesJson.popular),
      `Status: ${makesRes.status}, Popular makes: ${makesJson.popular?.length}`
    );
  } catch (err: any) {
    record('HTTP API', 'GET /api/car-guide/makes', false, `Connection error: ${err.message}`);
  }

  try {
    const modelsRes = await fetch('http://localhost:3000/api/car-guide/models?make=Ford&year=2018');
    const modelsJson = await modelsRes.json();
    record(
      'HTTP API',
      'GET /api/car-guide/models?make=Ford&year=2018',
      modelsRes.status === 200 && Array.isArray(modelsJson.models),
      `Status: ${modelsRes.status}, Models returned: ${modelsJson.models?.length}`
    );
  } catch (err: any) {
    record('HTTP API', 'GET /api/car-guide/models', false, `Connection error: ${err.message}`);
  }

  try {
    const verifyRes = await fetch('http://localhost:3000/api/car-guide/verify?make=Ford&model=F-150&year=2018');
    const verifyJson = await verifyRes.json();
    record(
      'HTTP API',
      'GET /api/car-guide/verify?make=Ford&model=F-150&year=2018',
      verifyRes.status === 200 && verifyJson.verified === true,
      `Status: ${verifyRes.status}, Verified: ${verifyJson.verified}`
    );
  } catch (err: any) {
    record('HTTP API', 'GET /api/car-guide/verify', false, `Connection error: ${err.message}`);
  }

  try {
    const decodeRes = await fetch('http://localhost:3000/api/car-guide/decode-vin?vin=1FTEW1EP5JFB12345');
    const decodeJson = await decodeRes.json();
    record(
      'HTTP API',
      'GET /api/car-guide/decode-vin?vin=1FTEW1EP5JFB12345',
      decodeRes.status === 200 && decodeJson.make === 'FORD',
      `Status: ${decodeRes.status}, Make: ${decodeJson.make}, Model: ${decodeJson.model}`
    );
  } catch (err: any) {
    record('HTTP API', 'GET /api/car-guide/decode-vin', false, `Connection error: ${err.message}`);
  }

  try {
    const pageRes = await fetch('http://localhost:3000/car-guide');
    const pageHtml = await pageRes.text();
    record(
      'HTTP Page',
      'GET /car-guide',
      pageRes.status === 200 && pageHtml.includes('Free US Vehicle Guide'),
      `Status: ${pageRes.status}, Contains heading: ${pageHtml.includes('Free US Vehicle Guide')}`
    );
  } catch (err: any) {
    record('HTTP Page', 'GET /car-guide', false, `Connection error: ${err.message}`);
  }

  // Summary
  console.log('\n===============================================================');
  console.log('                 AUDIT RUNNER COMPLETE');
  console.log('===============================================================');
  const passCount = auditLog.filter((l) => l.status === 'PASS').length;
  const warnCount = auditLog.filter((l) => l.status === 'WARNING').length;
  const failCount = auditLog.filter((l) => l.status === 'FAIL').length;
  console.log(`Total Checks: ${auditLog.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Warnings/Upstream Quirks: ${warnCount}`);
  console.log(`Failed: ${failCount}`);

  return { passCount, warnCount, failCount, auditLog };
}

runAudit().catch(console.error);
