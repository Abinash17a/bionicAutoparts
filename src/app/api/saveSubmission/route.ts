import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

function generateCustomId(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function getCounterValue() {
  const counterRef = doc(db, 'counters', 'submissionCounter');
  console.log("counterRef", counterRef);
  try {
    const counterDoc = await getDoc(counterRef);

    if (!counterDoc.exists()) {
      console.log("Counter document does not exist. Initializing...");
      console.log("Attempting to create submissionCounter...");
      await setDoc(counterRef, { count: 0 });
      console.log("submissionCounter created successfully.");
      return 0;
    }

    console.log("Counter document found:", counterDoc.data());
    return counterDoc.data().count;
  } catch (error) {
    console.error("Error retrieving counter:", error);
    throw error;
  }
}

async function updateCounter(counterValue: any) {
  const counterRef = doc(db, 'counters', 'submissionCounter');
  try {
    await updateDoc(counterRef, { count: counterValue });
    console.log("Counter updated to:", counterValue);
  } catch (error) {
    console.error("Error updating counter:", error);
    throw error;
  }
}

async function getRandomCollection() {
  let counter = await getCounterValue();
  console.log("Counter value initialized or retrieved:", counter);
  counter++; // Increment the counter for each submission

  // Determine the target collection based on the counter
  const targetCollection = counter % 10 <= 2 ? 'submissionsv2' : 'submissions';

  // Update the counter in Firestore
  await updateCounter(counter);

  return targetCollection;
}

export async function POST(req: NextRequest) {
  const { name, contact, email, zipCode, searchedPartFormatted } = await req.json();

  try {
    // Reference both submissions collections
    const submissionsRef = collection(db, 'submissions');
    const submissionsV2Ref = collection(db, 'submissionsv2');

    // Query to check if the contact exists in 'submissions'
    const querySubmissions = query(submissionsRef, where('contact', '==', contact));
    const submissionsSnapshot = await getDocs(querySubmissions);

    // Query to check if the contact exists in 'submissionsv2'
    const querySubmissionsV2 = query(submissionsV2Ref, where('contact', '==', contact));
    const submissionsV2Snapshot = await getDocs(querySubmissionsV2);

    let orderId: string;

    // Check if contact exists in either collection
    if (!submissionsSnapshot.empty) {
      // Fetch the first matching document's orderId from submissions
      orderId = submissionsSnapshot.docs[0].data().orderId;
      console.log("Existing orderId found in submissions:", orderId);
    } else if (!submissionsV2Snapshot.empty) {
      // Fetch the first matching document's orderId from submissionsv2
      orderId = submissionsV2Snapshot.docs[0].data().orderId;
      console.log("Existing orderId found in submissionsv2:", orderId);
    } else {
      // If no matching contact exists, generate a new orderId
      orderId = generateCustomId(6);
      console.log("No existing orderId found. Generated new orderId:", orderId);
    }

    // Randomly assign the target collection
    const targetCollection = await getRandomCollection();
    console.log("Randomly selected collection:", targetCollection);

    const targetRef = collection(db, targetCollection);

    // Add the new order data
    const docRef = await addDoc(targetRef, {
      name,
      contact,
      email,
      zipCode,
      searchedPartFormatted,
      createdAt: new Date(),
      status: 'Pending',
      orderId,
    });

    const response = NextResponse.json({
      message: `Data saved successfully in ${targetCollection}!`,
      id: docRef.id,
      orderId,
    });

    response.headers.set('Access-Control-Allow-Origin', 'https://www.bionicsautoparts.com');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}

