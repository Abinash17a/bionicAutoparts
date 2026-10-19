import { NextRequest } from 'next/server';
import { handleUpdateSubmissionStatus } from '../submissionsService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return handleUpdateSubmissionStatus('submissionsv2', req);
}
