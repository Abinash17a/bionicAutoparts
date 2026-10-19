import { NextRequest } from 'next/server';
import { handleGetSubmissions } from '../submissionsService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleGetSubmissions('submissions', req);
}
