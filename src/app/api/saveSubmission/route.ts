import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const { name, contact, email, zipCode, searchedPartFormatted } = await req.json();
  console.log("The searched part:", searchedPartFormatted);

  try {
    const docRef = await addDoc(collection(db, 'submissions'), {
      name,
      contact,
      email,
      zipCode,
      searchedPartFormatted,
      createdAt: new Date(),
      status: 'Pending', // Default status set to 'Pending'
    });

    return NextResponse.json({ message: 'Data saved successfully!', id: docRef.id });
  } catch (error) {
    console.error('Error adding document:------------------- ', error);
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}
