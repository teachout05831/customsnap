import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Insert into Supabase
    const { data, error } = await supabase
      .from("discovery")
      .insert({
        lead_id: body.leadId || null,
        style_directions: body.styleDirections || [],
        style_reasons: body.styleReasons || [],
        inspiration_urls: body.inspirationUrls || [],
        avoid_features: body.avoidFeatures || [],
        dealbreakers: body.dealbreakers || null,
        challenges: body.challenges || [],
        other_frustrations: body.otherFrustrations || [],
        problem_impact: body.problemImpact || null,
        pages_needed: body.pagesNeeded || [],
        other_pages: body.otherPages || null,
        must_have_features: body.mustHaveFeatures || [],
        other_features: body.otherFeatures || null,
        service_count: body.serviceCount || null,
        services_list: body.servicesList || null,
        website_goals: body.websiteGoals || [],
        wants_booking: body.wantsBooking || null,
        has_booking: body.hasBooking || null,
        additional_notes: body.additionalNotes || null,
        completed_at: body.completedAt || new Date().toISOString(),
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

    console.log("Discovery form saved:", data.id);

    // If there's a lead_id, create a project for them
    if (body.leadId) {
      const { error: projectError } = await supabase.from("projects").insert({
        lead_id: body.leadId,
        discovery_id: data.id,
        status: "intake",
        progress: 20,
        current_step: "Discovery completed",
      });

      if (projectError) {
        console.error("Error creating project:", projectError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Discovery form submitted successfully",
      discoveryId: data.id,
    });
  } catch (error) {
    console.error("Error saving discovery form:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save form" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("discovery")
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
    console.error("Error reading discovery data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read discovery data" },
      { status: 500 }
    );
  }
}
