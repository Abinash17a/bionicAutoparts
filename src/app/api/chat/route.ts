import { NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { chat, ConversationContext } from "@/lib/tony_beta3";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = (body.session_id || body.sessionId || "").trim();

    // Retrieve persistent session state from Firebase if not provided in request body
    let sessionState = body.session_state || body.context || null;
    if (!sessionState && sessionId) {
      try {
        const sessionSnap = await getDoc(doc(db, "quinbot_sessions", sessionId));
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          sessionState = {
            vehicle: {
              manufacturer: data.vehicle?.make || data.vehicle?.manufacturer || null,
              model: data.vehicle?.model || null,
              year: data.vehicle?.year || null,
            },
            part: data.part || null,
            details: data.details || {},
            pending_confirmation: data.pending_confirmation || null,
            customer: data.customer || undefined,
          } as ConversationContext;
        }
      } catch (err) {
        console.error("[Chat API] Firebase state recovery error (non-blocking):", err);
      }
    }

    // Execute Tony Beta 3 directly inside Next.js website backend
    const chatOutput = await chat(body.message, {
      sessionId: sessionId || null,
      context: sessionState,
    });

    const ctx = chatOutput.context;
    const veh = ctx?.vehicle || ({} as any);
    const extractedData = {
      customer: ctx?.customer || null,
      vehicle: {
        make: veh.manufacturer || null,
        manufacturer: veh.manufacturer || null,
        model: veh.model || null,
        year: veh.year || null,
      },
      part: ctx?.part || null,
      details: ctx?.details || {},
      pending_confirmation: ctx?.pending_confirmation || null,
      status: "in_progress",
    };

    const responsePayload = {
      status: "success",
      session_id: sessionId || chatOutput.session_id || null,
      reply: chatOutput.reply,
      context: chatOutput.context,
      extracted_data: extractedData,
      action: chatOutput.action,
      category: chatOutput.category,
    };

    // Progressive Firebase save — separate QuinBot namespace: quinbot_sessions/{sessionId}
    const resolvedSessionId = sessionId || chatOutput.session_id;
    if (resolvedSessionId) {
      saveToFirebase(resolvedSessionId, body.message, responsePayload).catch((err) => {
        console.error("[Chat API] Firebase save error (non-blocking):", err);
      });
    }

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    console.error("[Chat API] Direct bot execution error:", err);
    return NextResponse.json(
      {
        status: "error",
        reply: "Sorry, I'm having trouble processing your request right now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}

// Progressive Firebase persistence in QuinBot namespace: quinbot_sessions/{sessionId}
async function saveToFirebase(
  sessionId: string,
  userMessage: string,
  botResponse: Record<string, unknown>
) {
  const sessionRef = doc(db, "quinbot_sessions", sessionId);
  const extracted = (botResponse.extracted_data || botResponse.context || {}) as Record<string, unknown>;
  const vehicle = (extracted.vehicle || {}) as Record<string, unknown>;

  // Normalize vehicle properties
  const normalizedVehicle = {
    make: vehicle.make || vehicle.manufacturer || null,
    model: vehicle.model || null,
    year: vehicle.year || null,
  };

  // Upsert latest session state in quinbot_sessions/{sessionId}
  await setDoc(
    sessionRef,
    {
      sessionId,
      vehicle: normalizedVehicle,
      part: extracted.part || null,
      details: extracted.details || null,
      customer: extracted.customer || null,
      status: extracted.status || "in_progress",
      action: botResponse.action || null,
      category: botResponse.category || null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Append user message & bot reply to quinbot_sessions/{sessionId}/messages/{messageId}
  const messagesRef = collection(db, "quinbot_sessions", sessionId, "messages");
  await addDoc(messagesRef, {
    role: "user",
    text: userMessage,
    timestamp: serverTimestamp(),
  });
  await addDoc(messagesRef, {
    role: "bot",
    text: (botResponse.reply as string) || "",
    extracted_data: extracted,
    action: botResponse.action || null,
    category: botResponse.category || null,
    timestamp: serverTimestamp(),
  });
}
