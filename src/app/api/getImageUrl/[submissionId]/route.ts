import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

export async function POST(
  req: NextRequest,
  context: { params: { submissionId: string } }
) {
  try {
    const { submissionId } = context.params;

    // Parse FormDataparams
    const formData = await req.formData();
    const file = formData.get("partImage") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // S3 params
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const key = `parts/${Date.now()}_${file.name}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    // Upload to S3
    const uploadResult = await s3.upload(params).promise();
    const imageUrl = uploadResult.Location;

    // You can also update Firestore/SQL here if needed with submissionId

    return NextResponse.json({ success: true, imageUrl, submissionId });
  } catch (err: any) {
    console.error("S3 Upload Error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
