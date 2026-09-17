// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      year,
      make,
      model,
      partRequested,
      vin,
      partNumber,
      message,
    } = body;

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name: name || '',
        email: email || '',
        phone: phone || '',
        year: year || '',
        make: make || '',
        model: model || '',
        part_requested: partRequested || '',
        vin: vin || '',
        part_number: partNumber || '',
        message: message || '',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving contact message to Supabase:', error);
      return NextResponse.json(
        { message: 'Error sending message', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent successfully!', id: data?.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { message: 'Error sending message', error: error.message },
      { status: 500 }
    );
  }
}
