import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type SubmissionsCollection = 'submissions' | 'submissionsv2';

export async function handleGetSubmissions(collectionName: SubmissionsCollection, req: Request | NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    const submissionsRef = collection(db, collectionName);
    const q = orderId
      ? query(submissionsRef, where('orderId', '==', orderId))
      : query(submissionsRef);

    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error(`Error fetching submissions from ${collectionName}:`, error);
    return NextResponse.json(
      { message: 'Error retrieving data', error: error.message },
      { status: 500 }
    );
  }
}

export async function handleUpdateSubmissionStatus(collectionName: SubmissionsCollection, req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { status });

    return NextResponse.json({ message: 'Status updated successfully!' });
  } catch (error: any) {
    console.error(`Error updating status in ${collectionName}:`, error);
    return NextResponse.json({ error: 'Error updating status' }, { status: 500 });
  }
}

export async function handleUploadImage(collectionName: SubmissionsCollection, req: NextRequest) {
  try {
    const { id, imageUrl } = await req.json();

    if (!id || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing submission ID or imageUrl' },
        { status: 400 }
      );
    }

    const docRef = doc(db, collectionName, id);

    await updateDoc(docRef, {
      partImageUrls: arrayUnion(imageUrl),
      partImageUrl: imageUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Image added successfully!',
      imageUrl,
    });
  } catch (error: any) {
    console.error(`Error updating image in ${collectionName}:`, error);
    return NextResponse.json(
      { error: error.message || 'Error updating image' },
      { status: 500 }
    );
  }
}

export async function handlePartImageUpload(collectionName: SubmissionsCollection, req: NextRequest) {
  const { id, status, imageUrl, imageBase64, imageName } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
  }

  try {
    const docRef = doc(db, collectionName, id);
    const updateData: Record<string, any> = {};

    if (status) updateData.status = status;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (imageBase64) updateData.imageBase64 = imageBase64;
    if (imageName) updateData.imageName = imageName;

    await updateDoc(docRef, updateData);

    return NextResponse.json({ message: 'Image uploaded successfully!' });
  } catch (error: any) {
    console.error(`Error updating submission in ${collectionName}:`, error);
    return NextResponse.json(
      { error: 'Error updating image in submission table' },
      { status: 500 }
    );
  }
}
