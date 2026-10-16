import { NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getSessionRepository } from "@/lib/tony_beta3";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = (body.session_id || body.sessionId || "").trim();

    // Update Firebase session status to reset
    if (sessionId) {
      try {
        const sessionRef = doc(db, "quinbot_sessions", sessionId);
        await setDoc(sessionRef, {
          sessionId,
          status: "reset",
          updatedAt: serverTimestamp(),
        });
      } catch (fbErr) {
        console.error("[Reset API] Firebase reset update error (non-blocking):", fbErr);
      }
    }

    // Directly delete session in Tony Beta 3 repository
    let deleted = false;
    if (sessionId) {
      try {
        deleted = await getSessionRepository().deleteSession(sessionId);
      } catch (err) {
        console.error("[Reset API] Session deletion error:", err);
      }
    }

    return NextResponse.json({
      reset: true,
      session_id: sessionId,
      deleted,
    });
  } catch {
    return NextResponse.json({ reset: true });
  }
}
