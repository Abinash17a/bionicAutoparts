import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const { name, contact, email, zipCode, searchedPartFormatted } = await req.json();

  try {
    const docRef = await addDoc(collection(db, 'submissions'), {
      name,
      contact,
      email,
      zipCode,
      searchedPartFormatted,
      createdAt: new Date(),
      status: 'Pending',
    });

    const response = NextResponse.json({ message: 'Data saved successfully!', id: docRef.id });
    response.headers.set('Access-Control-Allow-Origin', 'https://www.bionicsautoparts.com');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}
