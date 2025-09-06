import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const { id, status, imageBase64, imageName, collection = 'submissions' } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
  }

  if (!imageBase64) {
    return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
  }

  try {
    const docRef = doc(db, collection, id);

    const updateData: any = {};
    if (status) updateData.status = status;
    if (imageBase64) updateData.imageBase64 = imageBase64;
    if (imageName) updateData.imageName = imageName;
    updateData.imageUploadedAt = new Date();

    await updateDoc(docRef, updateData);

    return NextResponse.json({
      message: 'Base64 image uploaded successfully!',
      success: true
    });
  } catch (error) {
    console.error('Error updating submission with base64 image:', error);
    return NextResponse.json({ error: 'Error updating image in submission table' }, { status: 500 });
  }
}

