// app/api/uploadImage/[submissionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;
console.log("process.env.alll things:", process.env);

// Early runtime validation of env vars (clear error instead of AWS's generic message)
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
  // Do NOT expose secret values in logs; just indicate presence/absence
  console.error("Missing AWS env vars:", {
    AWS_ACCESS_KEY_ID: !!AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: !!AWS_SECRET_ACCESS_KEY,
    AWS_REGION: !!AWS_REGION,
    AWS_BUCKET_NAME: !!AWS_BUCKET_NAME,
  });
  // Keep process running — this file will still be imported, but calls will immediately error with helpful message
}
console.log("AWS Config:", {
  AWS_ACCESS_KEY_ID: !!AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: !!AWS_SECRET_ACCESS_KEY,
  AWS_REGION: !!AWS_REGION,
  AWS_BUCKET_NAME: !!AWS_BUCKET_NAME,
});

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
    ? { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }
    : undefined,
});

export async function POST(
  req: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    // Defensive env check at request time
    if (!AWS_BUCKET_NAME) {
      return NextResponse.json({ error: "Server misconfiguration: AWS_BUCKET_NAME is not set" }, { status: 500 });
    }
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
      return NextResponse.json({ error: "Server misconfiguration: AWS credentials/region missing" }, { status: 500 });
    }

    const { submissionId } = params || {};
    // parse formData (supported in App Router)
    const formData = await req.formData();
    const file = formData.get("partImage") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded in field 'partImage'" }, { status: 400 });
    }

    // Convert File -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // create key (unique)
    const ext = file.name?.split(".").pop() || "jpg";
    const key = `parts/${Date.now()}_${uuidv4()}.${ext}`;

    // Use Upload from lib-storage for robust uploads (multipart if large)
    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      },
      queueSize: 3,
      partSize: 5 * 1024 * 1024, // 5MB
    });

    await uploader.done();

    // Construct public URL (works if your bucket policy allows public read)
    // For us-east-1 region you can omit region segment; this works for all regions:
    const imageUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${encodeURIComponent(key)}`;

    // Optionally: update Firestore here using submissionId (server-side)
    // e.g. await adminDb.collection('submissions').doc(submissionId).update({ partImageUrls: admin.firestore.FieldValue.arrayUnion(imageUrl) });

    return NextResponse.json({ success: true, imageUrl, submissionId });
  } catch (err: any) {
    console.error("S3 Upload Error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Upload failed" }, { status: 500 });
  }
}
