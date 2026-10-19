import { NextRequest } from 'next/server';
import { handleUploadImage } from '../submissionsService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return handleUploadImage('submissions', req);
}
