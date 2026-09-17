// src/app/api/updateSubmissionStatusv2/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing submission ID or status' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('submissions_v2')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status in Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Status updated successfully!' });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Error updating status' }, { status: 500 });
  }
}
