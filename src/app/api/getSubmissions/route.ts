import { NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const revalidate = 1; // Revalidate API every 1 second

export async function GET(req: any) {
  try {
    // Extract the query parameter from the request URL
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    // Reference the 'submissions' collection
    const submissionsRef = collection(db, 'submissions');

    // Create the query, filtering only by 'orderId' if provided
    let q;
    if (orderId) {
      q = query(submissionsRef, where('orderId', '==', orderId));
    } else {
      q = query(submissionsRef); // Fetch all documents without sorting
    }

    // Fetch data from Firestore
    const querySnapshot = await getDocs(q);

    // Map the results into an array
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the submissions as JSON
    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { message: 'Error retrieving data', error: error.message },
      { status: 500 }
    );
  }
}

