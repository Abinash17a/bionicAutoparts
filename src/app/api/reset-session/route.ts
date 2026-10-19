import { NextResponse } from "next/server";
import { getSessionRepository } from "@/lib/tony_beta3";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = (body.session_id || body.sessionId || "").trim();
    const isTestMode = process.env.USA_AUTOPARTSBOT_TEST_MODE === "true";

    // Update Firebase session status to reset only when NOT in test mode
    if (!isTestMode && sessionId) {
      try {
        const { db } = await import("../../lib/firebase");
        const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
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

    // Directly delete session in Tony Beta 3 repository (usaautopartsbot_chat_sessions)
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
