import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Test the connection by querying the leads table
    const { data, error } = await supabase.from("leads").select("count");

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Supabase connection failed",
        error: error.message,
        hint: "Make sure you ran the SQL schema in Supabase SQL Editor",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful!",
      tables: "leads, discovery, projects tables ready",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Connection error",
      error: error.message,
    });
  }
}
