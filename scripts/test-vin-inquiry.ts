import { POST as handleInquiry } from '../src/app/api/car-guide/inquiry/route';
import { NextRequest } from 'next/server';
import { db } from '../src/app/lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

async function runTests() {
  console.log('====================================================');
  console.log('Running End-to-End Tests for VIN Vehicle Guide & Inquiry');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName}${detail ? ` (${detail})` : ''}`);
      failed++;
    }
  }

  // 1. Static Source Code Audits
  const clientCode = fs.readFileSync('src/app/car-guide/VehicleGuideClient.tsx', 'utf-8');

  // Check 1: Example vehicle buttons removed
  assert(
    !clientCode.includes('Load Example: 2018 Ford') &&
    !clientCode.includes('Try Example: 2018 Ford') &&
    !clientCode.includes('handlePreloadExample'),
    '1. Example vehicle buttons and handlers removed'
  );

  // Check 2: Sample VINs and test controls removed
  assert(
    !clientCode.includes('Test Sample VINs:') &&
    !clientCode.includes('4T1B11HK9JU189342'),
    '2. Sample VINs and test buttons removed'
  );

  // Check 3: Verification & fitment checklist removed
  assert(
    !clientCode.includes('Verification & Fitment Checklist') &&
    !clientCode.includes('1. NHTSA Catalog') &&
    !clientCode.includes('2. VIN Status'),
    '3. Verification and Fitment Checklist section removed'
  );

  // Check 4: Important parts limitation notice removed
  assert(
    !clientCode.includes('Important Part Fitment Limitation'),
    '4. Important parts limitation section removed'
  );

  // Check 5: "Inquire With This VIN" opens modal and does NOT redirect to /contact
  assert(
    clientCode.includes('setIsInquiryModalOpen(true)') &&
    !clientCode.includes('href={`/contact?vin='),
    '5. Inquire With This VIN triggers local modal instead of /contact redirect'
  );

  // Check 6: Floating VIN sticker preserved in layout
  const layoutCode = fs.readFileSync('src/app/layout.tsx', 'utf-8');
  assert(
    layoutCode.includes('<FloatingVinSticker />'),
    '6. Floating “Check Part Through VIN” sticker is preserved in RootLayout'
  );

  // Check 7: Order ID restored in VinInquiryModal with no legacy "Reference Order ID"
  const modalCode = fs.readFileSync('src/app/car-guide/VinInquiryModal.tsx', 'utf-8');
  assert(
    !modalCode.includes('Reference Order ID') &&
      modalCode.includes('Order ID:') &&
      modalCode.includes('{successResult.orderId}'),
    '7. Order ID displayed without legacy Reference label'
  );

  // 2. API Validation Tests for /api/car-guide/inquiry
  console.log('\n--- Testing /api/car-guide/inquiry validation ---');

  // Validation Test A: Missing Name
  {
    const req = new NextRequest('http://localhost:3000/api/car-guide/inquiry', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'test@example.com',
        phone: '555-123-4567',
        requestedPart: 'Alternator',
        vin: '1FTEW1EP5JFB12345',
      }),
    });
    const res = await handleInquiry(req);
    assert(res.status === 400, '7. API rejects missing name (HTTP 400)');
  }

  // Validation Test B: Invalid Email
  {
    const req = new NextRequest('http://localhost:3000/api/car-guide/inquiry', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'invalid-email',
        phone: '555-123-4567',
        requestedPart: 'Alternator',
        vin: '1FTEW1EP5JFB12345',
      }),
    });
    const res = await handleInquiry(req);
    assert(res.status === 400, '8. API rejects invalid email format (HTTP 400)');
  }

  // Validation Test C: Short / Invalid Phone
  {
    const req = new NextRequest('http://localhost:3000/api/car-guide/inquiry', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '123',
        requestedPart: 'Alternator',
        vin: '1FTEW1EP5JFB12345',
      }),
    });
    const res = await handleInquiry(req);
    assert(res.status === 400, '9. API rejects phone numbers with fewer than 7 digits (HTTP 400)');
  }

  // Validation Test D: Missing Requested Part
  {
    const req = new NextRequest('http://localhost:3000/api/car-guide/inquiry', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '555-123-4567',
        requestedPart: ' ',
        vin: '1FTEW1EP5JFB12345',
      }),
    });
    const res = await handleInquiry(req);
    assert(res.status === 400, '10. API rejects missing requested part (HTTP 400)');
  }

  // Validation Test E: Invalid VIN
  {
    const req = new NextRequest('http://localhost:3000/api/car-guide/inquiry', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '555-123-4567',
        requestedPart: 'Transmission',
        vin: '1FTEW1EP5JFB1234', // 16 chars instead of 17
      }),
    });
    const res = await handleInquiry(req);
    assert(res.status === 400, '11. API rejects invalid VIN length (HTTP 400)');
  }

  // 3. Database Persistence Test
  console.log('\n--- Testing Database Lead Persistence ---');
  let createdDocId: string | null = null;
  {
    const testPayload = {
      name: 'Automated Test Customer',
      email: 'test.customer@example.com',
      phone: '+1 (555) 234-5678',
      requestedPart: 'Complete Engine Assembly 5.0L V8',
      message: 'Need under 70k miles, shipping to 90210',
      vin: '1FTEW1EP5JFB12345',
      vehicleYear: '2018',
      vehicleMake: 'Ford',
      vehicleModel: 'F-150',
      vehicleTrim: 'XLT Crew Cab',
      vehicleEngine: '5.0L 8-Cyl Gasoline',
    };

    const req = new NextRequest('http://localhost:3000/api/car-guide/inquiry', {
      method: 'POST',
      body: JSON.stringify(testPayload),
    });
    const res = await handleInquiry(req);
    const body = await res.json();

    assert(res.status === 201 && body.success === true, '12. API accepts valid inquiry (HTTP 201)');
    assert(
      !!body.orderId && /^[A-Za-z]{6}$/.test(body.orderId),
      '13. Response contains 6-character alphabets-only Order ID (e.g. AUPUGb)',
      body.orderId
    );

    createdDocId = body.id;
    assert(!!createdDocId, '14. Response returns persisted Firestore document ID', createdDocId || '');

    // Verify document in Firestore
    if (createdDocId) {
      const docSnap = await getDoc(doc(db, 'submissions', createdDocId));
      assert(docSnap.exists(), '15. Inquiry document exists in Firestore submissions collection');

      if (docSnap.exists()) {
        const savedData = docSnap.data();
        assert(savedData.name === testPayload.name, '16. Saved name matches');
        assert(savedData.email === testPayload.email, '17. Saved email matches');
        assert(savedData.phone === testPayload.phone, '18. Saved phone matches');
        assert(savedData.contact === testPayload.phone, '19. Saved contact matches (CRM compatibility)');
        assert(savedData.requestedPart === testPayload.requestedPart, '20. Saved requestedPart matches');
        assert(savedData.vin === testPayload.vin, '21. Saved VIN matches');
        assert(savedData.vehicleYear === testPayload.vehicleYear, '22. Saved vehicleYear matches');
        assert(savedData.vehicleMake === testPayload.vehicleMake, '23. Saved vehicleMake matches');
        assert(savedData.vehicleModel === testPayload.vehicleModel, '24. Saved vehicleModel matches');
        assert(savedData.vehicleTrim === testPayload.vehicleTrim, '25. Saved vehicleTrim matches');
        assert(savedData.vehicleEngine === testPayload.vehicleEngine, '26. Saved vehicleEngine matches');
        assert(savedData.source === 'car-guide-vin-inquiry', '27. Saved source is "car-guide-vin-inquiry"');
        assert(savedData.status === 'Pending', '28. Saved status is "Pending"');
        assert(!!savedData.createdAt, '29. Saved createdAt timestamp exists');
      }

      // Clean up test document
      await deleteDoc(doc(db, 'submissions', createdDocId));
      console.log('Cleaned up test document from Firestore.');
    }
  }

  console.log('\n====================================================');
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test suite uncaught error:', e);
  process.exit(1);
});
