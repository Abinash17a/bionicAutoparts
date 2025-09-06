// lib/firebase-admin.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    throw new Error("Missing Firebase service account environment variables");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // 🔹 Replace escaped `\n` with real newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// Firestore (admin)
const adminDb = admin.firestore();

// Storage bucket (optional, if you’re still using Firebase Storage)
const storage = admin.storage().bucket();

export { admin, adminDb, storage };
