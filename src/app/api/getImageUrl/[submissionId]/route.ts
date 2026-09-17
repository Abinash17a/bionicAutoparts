// src/app/api/getImageUrl/[submissionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;

export async function POST(
  req: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const { submissionId } = params || {};
    const formData = await req.formData();
    const file = formData.get("partImage") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded in field 'partImage'" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name?.split(".").pop() || "jpg";
    const filename = `parts/${Date.now()}_${uuidv4()}.${ext}`;

    // 1. Primary: Try Supabase Storage (part-images bucket)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
      try {
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from("part-images")
          .upload(filename, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabaseAdmin.storage
            .from("part-images")
            .getPublicUrl(filename);

          const imageUrl = urlData.publicUrl;
          return NextResponse.json({ success: true, imageUrl, submissionId });
        } else if (uploadError) {
          console.warn("Supabase Storage upload warning (falling back to S3 if configured):", uploadError.message);
        }
      } catch (storageError) {
        console.warn("Supabase Storage error:", storageError);
      }
    }

    // 2. Secondary / Fallback: AWS S3 if credentials configured
    if (AWS_BUCKET_NAME && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_REGION) {
      const s3Client = new S3Client({
        region: AWS_REGION,
        credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
      });

      const uploader = new Upload({
        client: s3Client,
        params: {
          Bucket: AWS_BUCKET_NAME,
          Key: filename,
          Body: buffer,
          ContentType: file.type || "application/octet-stream",
        },
        queueSize: 3,
        partSize: 5 * 1024 * 1024,
      });

      await uploader.done();
      const imageUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${encodeURIComponent(filename)}`;
      return NextResponse.json({ success: true, imageUrl, submissionId });
    }

    // 3. Fallback Data URI if neither remote storage is configured
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64Data}`;
    return NextResponse.json({ success: true, imageUrl: dataUri, submissionId });
  } catch (err: any) {
    console.error("Image Upload Handler Error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Upload failed" }, { status: 500 });
  }
}
