// src/app/api/car-guide/decode-vin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { decodeVin, validateVinFormat } from '@/lib/nhtsa/nhtsaService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get('vin');
    const yearStr = searchParams.get('year');
    const make = searchParams.get('make') || undefined;
    const model = searchParams.get('model') || undefined;

    if (!vin || !vin.trim()) {
      return NextResponse.json(
        { error: 'Query parameter "vin" is required.' },
        { status: 400 }
      );
    }

    const formatCheck = validateVinFormat(vin);
    if (!formatCheck.isValidFormat) {
      return NextResponse.json(
        {
          error: formatCheck.error,
          isValidFormat: false,
          checkDigitValid: false,
        },
        { status: 400 }
      );
    }

    const year = yearStr ? Number(yearStr) : undefined;
    const decoded = await decodeVin(
      formatCheck.cleanVin,
      year && !isNaN(year) ? year : undefined,
      make,
      model
    );

    return NextResponse.json(decoded, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to decode VIN.';
    const isTimeout = message.toLowerCase().includes('time');
    const status = isTimeout ? 504 : 500;
    console.error('API /api/car-guide/decode-vin error:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
