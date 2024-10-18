import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export async function GET() {
  try {
    const submissionsRef = collection(db, 'submissions');
    const q = query(submissionsRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);

    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { message: 'Error retrieving data', error: error },
      { status: 500 }
    );
  }
}
