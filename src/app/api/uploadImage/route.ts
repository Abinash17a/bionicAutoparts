import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { id, imageUrl } = await req.json();

    if (!id || !imageUrl) {
      return NextResponse.json(
        { error: "Missing submission ID or imageUrl" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "submissions", id);

    // 🔹 Add new image to partImageUrls array (preferred approach)
    await updateDoc(docRef, {
      partImageUrls: arrayUnion(imageUrl),
    });

    // Optional: also update the single-image field for backward compatibility
    await updateDoc(docRef, {
      partImageUrl: imageUrl,
    });

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
