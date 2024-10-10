import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export async function GET() {
  try {
    const submissionsRef = collection(db, 'submissions');
    
    const querySnapshot = await getDocs(submissionsRef);
    
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the data as a JSON response
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ message: 'Error retrieving data', error: error }, { status: 500 });
  }
}
