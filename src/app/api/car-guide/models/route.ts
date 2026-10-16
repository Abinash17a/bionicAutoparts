// src/app/api/car-guide/models/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getModelsForMakeAndYear, MIN_SUPPORTED_YEAR, MAX_SUPPORTED_YEAR } from '@/lib/nhtsa/nhtsaService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const yearStr = searchParams.get('year');

    if (!make || !make.trim()) {
      return NextResponse.json(
        { error: 'Query parameter "make" is required.' },
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
          error: `Model year must be an integer between ${MIN_SUPPORTED_YEAR} and ${MAX_SUPPORTED_YEAR}. (NHTSA vPIC catalog coverage policy).`,
        },
        { status: 400 }
      );
    }

    const data = await getModelsForMakeAndYear(make.trim(), year);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=10800',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve vehicle models.';
    const isTimeout = message.toLowerCase().includes('time');
    const status = isTimeout ? 504 : 500;
    console.error('API /api/car-guide/models error:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
