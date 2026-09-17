// src/app/api/getSubmissionsv2/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    let query = supabaseAdmin
      .from('submissions_v2')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching submissions_v2 from Supabase:', error);
      return NextResponse.json(
        { message: 'Error retrieving data', error: error.message },
        { status: 500 }
      );
    }

    // Format results to support both camelCase and snake_case properties
    const submissions = (data || []).map((row: any) => ({
      id: row.id,
      orderId: row.order_id,
      order_id: row.order_id,
      name: row.name,
      contact: row.contact,
      email: row.email,
      zipCode: row.zip_code,
      zip_code: row.zip_code,
      searchedPartFormatted: row.searched_part_formatted,
      searched_part_formatted: row.searched_part_formatted,
      status: row.status,
      partImageUrl: row.part_image_url,
      part_image_url: row.part_image_url,
      partImageUrls: row.part_image_urls || [],
      part_image_urls: row.part_image_urls || [],
      imageBase64: row.image_base64,
      imageName: row.image_name,
      createdAt: row.created_at ? { seconds: Math.floor(new Date(row.created_at).getTime() / 1000) } : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error('Error in getSubmissionsv2:', error);
    return NextResponse.json(
      { message: 'Error retrieving data', error: error.message },
      { status: 500 }
    );
  }
}
