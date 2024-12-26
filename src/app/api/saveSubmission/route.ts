import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function generateCustomId(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function POST(req: NextRequest) {
  const { name, contact, email, zipCode, searchedPartFormatted } = await req.json();

  try {
    // Check if there's an existing order with the same contact
    const ordersRef = collection(db, 'submissions');
    const q = query(ordersRef, where('contact', '==', contact));
    const querySnapshot = await getDocs(q);

    let orderId;

    if (!querySnapshot.empty) {
      // If an order with the same contact exists, get its orderId
      const existingOrder = querySnapshot.docs[0].data();
      orderId = existingOrder.orderId;
    } else {
      // Generate a new orderId if no matching order is found
      orderId = generateCustomId(6);
    }

    // Add the new order data
    const docRef = await addDoc(ordersRef, {
      name,
      contact,
      email,
      zipCode,
      searchedPartFormatted,
      createdAt: new Date(),
      status: 'Pending',
      orderId,
    });

    const response = NextResponse.json({ message: 'Data saved successfully!', id: docRef.id, orderId });
    response.headers.set('Access-Control-Allow-Origin', 'https://www.bionicsautoparts.com');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}
