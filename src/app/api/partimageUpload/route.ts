import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const { id, status, imageUrl, imageBase64, imageName } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'submissions', id);

    const updateData: any = {};
    if (status) updateData.status = status;

    // Store both Firebase Storage URL and base64 data
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (imageBase64) updateData.imageBase64 = imageBase64;
    if (imageName) updateData.imageName = imageName;

    await updateDoc(docRef, updateData);

    return NextResponse.json({ message: 'Image uploaded successfully!' });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Error updating image in submission table' }, { status: 500 });
  }
}

