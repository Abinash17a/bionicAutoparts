import { NextRequest } from 'next/server';
import { handlePartImageUpload } from '../submissionsService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return handlePartImageUpload('submissions', req);
}
