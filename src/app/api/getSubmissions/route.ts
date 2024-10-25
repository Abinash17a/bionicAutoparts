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
    console.log("Fetched submissions in route:", submissions);
    const response = NextResponse.json({ submissions });


    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Access-Control-Allow-Origin', 'https://www.bionicsautoparts.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { message: 'Error retrieving data', error: error },
      { status: 500 }
    );
  }
}
