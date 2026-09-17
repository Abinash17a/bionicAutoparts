// src/app/api/uploadImagev2/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { id, imageUrl } = await req.json();

    if (!id || !imageUrl) {
      return NextResponse.json(
        { error: "Missing submission ID or imageUrl" },
        { status: 400 }
      );
    }

    // Fetch existing submission
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("submissions_v2")
      .select("part_image_urls")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching submission_v2:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const currentUrls: string[] = Array.isArray(existing?.part_image_urls) ? existing.part_image_urls : [];
    const updatedUrls = currentUrls.includes(imageUrl) ? currentUrls : [...currentUrls, imageUrl];

    const { error: updateError } = await supabaseAdmin
      .from("submissions_v2")
      .update({
        part_image_url: imageUrl,
        part_image_urls: updatedUrls,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating image in Supabase:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Image added successfully!",
      imageUrl,
    });
  } catch (error: any) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: error.message || "Error updating image" },
      { status: 500 }
    );
  }
}
