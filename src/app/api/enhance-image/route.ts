import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Firebase Admin initialization
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = getStorage().bucket();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const tempFilePath = path.join(os.tmpdir(), file.name);
    fs.writeFileSync(tempFilePath, buffer);

    const fileName = `enhanced-images/${Date.now()}_${file.name}`;
    const firebaseFile = bucket.file(fileName);

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(tempFilePath)
        .pipe(
          firebaseFile.createWriteStream({
            metadata: {
              contentType: file.type || 'image/jpeg',
            },
          })
        )
        .on('error', reject)
        .on('finish', resolve);
    });

    const [url] = await firebaseFile.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });

    return NextResponse.json({ imageUrl: url }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
