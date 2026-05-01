/**
 * RFC 8058 One-Click Unsubscribe Route Handler — Phase B4-1
 *
 * Email clients (Gmail, Apple Mail) send a POST to this URL when the user
 * clicks the native "Unsubscribe" button in the email header.
 *
 * The email must include:
 *   List-Unsubscribe: <https://app.sheriabot.com/unsubscribe/{token}>
 *   List-Unsubscribe-Post: List-Unsubscribe=One-Click
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  const { token } = params;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    // Forward to backend tRPC endpoint via internal fetch
    const res = await fetch(`${BACKEND_URL}/trpc/publicMarketing.unsubscribe`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ json: { token } }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Unsubscribe failed" }, { status: 500 });
    }

    // RFC 8058 requires 200 OK with no body (or minimal body)
    return new NextResponse(null, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
