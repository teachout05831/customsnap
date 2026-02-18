import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json(
        { success: false, message: "Lead ID is required" },
        { status: 400 }
      );
    }

    // Fetch project for this lead
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (projectError && projectError.code !== "PGRST116") {
      console.error("Project fetch error:", projectError);
    }

    // Fetch activity log for this project (using project_id, not lead_id)
    let activities: any[] = [];
    if (project?.id) {
      const { data: activityData, error: activityError } = await supabase
        .from("activity_log")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (activityError) {
        console.error("Activity fetch error:", activityError);
      } else {
        activities = activityData || [];
      }
    }

    return NextResponse.json({
      success: true,
      project: project || null,
      activities: activities,
    });
  } catch (error) {
    console.error("Portal project error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project data" },
      { status: 500 }
    );
  }
}
