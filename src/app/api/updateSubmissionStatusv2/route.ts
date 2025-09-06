import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();

  try {
    const docRef = doc(db, 'submissionsv2', id);

    // Update the status field
    await updateDoc(docRef, {
      status,
    });

    return NextResponse.json({ message: 'Status updated successfully!' });
  } catch (error) {
    console.error('Error updating status:------------------- ', error);
    return NextResponse.json({ error: 'Error updating status' }, { status: 500 });
  }
}


