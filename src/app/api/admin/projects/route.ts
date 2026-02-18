import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Fetch all projects with their associated leads
    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        *,
        lead:leads(id, first_name, last_name, email, phone)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Projects fetch error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, projects: projects || [] });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, progress, current_step, preview_url } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (current_step !== undefined) updateData.current_step = current_step;
    if (preview_url !== undefined) updateData.preview_url = preview_url;

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Project update error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // If status changed, log the activity (don't fail if this errors)
    if (status) {
      try {
        await supabase.from("activity_log").insert({
          project_id: id,
          action: `Status updated to ${status}`,
          description: current_step || `Project moved to ${status} phase`,
        });
      } catch (activityError) {
        console.error("Activity log error (non-fatal):", activityError);
      }
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 }
    );
  }
}
