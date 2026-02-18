import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Look up the lead by email
    const { data: lead, error } = await supabase
      .from("leads")
      .select("id, first_name, last_name, email")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !lead) {
      return NextResponse.json({
        success: false,
        message: "No account found with this email. Please check and try again.",
      });
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      name: `${lead.first_name} ${lead.last_name}`,
      email: lead.email,
    });
  } catch (error) {
    console.error("Portal auth error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
