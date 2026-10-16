// src/app/api/car-guide/makes/route.ts
import { NextResponse } from 'next/server';
import { getSupportedMakes } from '@/lib/nhtsa/nhtsaService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSupportedMakes();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve vehicle makes.';
    console.error('API /api/car-guide/makes error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
