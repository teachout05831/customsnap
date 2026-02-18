import { NextRequest, NextResponse } from "next/server";

// Simple admin password - in production, use environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "customsnap2024";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid password" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
