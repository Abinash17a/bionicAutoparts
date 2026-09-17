// src/app/api/partimageUpload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { id, status, imageUrl, imageBase64, imageName } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (imageUrl) updateData.part_image_url = imageUrl;
    if (imageBase64) updateData.image_base64 = imageBase64;
    if (imageName) updateData.image_name = imageName;

    const { error } = await supabaseAdmin
      .from('submissions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating submission image in Supabase:', error);
      return NextResponse.json({ error: 'Error updating image in submission table' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image uploaded successfully!' });
  } catch (error: any) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Error updating image in submission table' }, { status: 500 });
  }
}
