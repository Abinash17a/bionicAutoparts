// src/app/api/car-guide/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  verifyVehicleSelection,
  decodeVin,
  MIN_SUPPORTED_YEAR,
  MAX_SUPPORTED_YEAR,
} from '@/lib/nhtsa/nhtsaService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const yearStr = searchParams.get('year');
    const vin = searchParams.get('vin');

    if (!make || !make.trim()) {
      return NextResponse.json(
        { error: 'Query parameter "make" is required.' },
        { status: 400 }
      );
    }

    if (!model || !model.trim()) {
      return NextResponse.json(
        { error: 'Query parameter "model" is required.' },
        { status: 400 }
      );
    }

    if (!yearStr) {
      return NextResponse.json(
        { error: 'Query parameter "year" is required.' },
        { status: 400 }
      );
    }

    const year = Number(yearStr);
    if (!Number.isInteger(year) || year < MIN_SUPPORTED_YEAR || year > MAX_SUPPORTED_YEAR) {
      return NextResponse.json(
        {
          error: `Model year must be an integer between ${MIN_SUPPORTED_YEAR} and ${MAX_SUPPORTED_YEAR}.`,
        },
        { status: 400 }
      );
    }

    const verification = await verifyVehicleSelection(make.trim(), model.trim(), year);

    // If VIN was also supplied, attempt to decode and detect discrepancy
    if (vin && vin.trim().length === 17) {
      try {
        const decoded = await decodeVin(vin.trim(), year, make.trim(), model.trim());
        verification.decodedVin = decoded;
      } catch (vinErr) {
        console.warn('Optional VIN decode inside verify failed:', vinErr);
      }
    }

    const statusCode = verification.verified ? 200 : 404;
    return NextResponse.json(verification, {
      status: statusCode,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to verify vehicle selection.';
    const isTimeout = message.toLowerCase().includes('time');
    const status = isTimeout ? 504 : 500;
    console.error('API /api/car-guide/verify error:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
