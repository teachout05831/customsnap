import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { firstName, lastName, email, phone } = body;
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("leads")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        current_website: body.currentWebsite || null,
        source: "landing_page",
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    console.log("New lead saved:", data.id, "-", data.email);

    // Create a project for this lead
    const { error: projectError } = await supabase.from("projects").insert({
      lead_id: data.id,
      status: "intake",
      progress: 10,
      current_step: "Lead submitted - awaiting review",
    });

    if (projectError) {
      console.error("Error creating project:", projectError);
    } else {
      console.log("Project created for lead:", data.id);
    }

    return NextResponse.json({
      success: true,
      message: "Lead saved successfully",
      leadId: data.id,
    });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save lead" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, leads: data });
  } catch (error) {
    console.error("Error reading leads:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read leads" },
      { status: 500 }
    );
  }
}
