// app/api/contact/route.js
import { db } from  '../../lib/firebase';
import { collection, addDoc } from "firebase/firestore";

export async function POST(request:any) {
  const { name, email, message } = await request.json();

  try {
    // Reference to your Firebase Firestore collection
    const contactCollection = collection(db, "contactMessages");

    // Add the form data to Firebase
    await addDoc(contactCollection, {
      name,
      email,
      message,
      timestamp: new Date(),
    });

    return new Response(JSON.stringify({ message: "Message sent successfully!" }), {
      status: 200,
    });
  } catch (error:any) {
    return new Response(
      JSON.stringify({ message: "Error sending message", error: error.message }),
      { status: 500 }
    );
  }
}
