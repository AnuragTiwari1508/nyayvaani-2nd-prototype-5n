import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST() {
  try {
    // Create user_profiles table
    const { data: userProfilesData, error: userProfilesError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .limit(1)

    if (userProfilesError) {
      // Table doesn't exist, create it
      await supabaseAdmin.from("user_profiles").insert({
        id: "00000000-0000-0000-0000-000000000000",
        full_name: "System User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    // Create transcripts table
    const { data: transcriptsData, error: transcriptsError } = await supabaseAdmin
      .from("transcripts")
      .select("*")
      .limit(1)

    if (transcriptsError) {
      // Table doesn't exist, create it
      await supabaseAdmin.from("transcripts").insert({
        id: "00000000-0000-0000-0000-000000000000",
        user_id: "00000000-0000-0000-0000-000000000000",
        language: "en",
        transcript: "System transcript",
        created_at: new Date().toISOString(),
      })
    }

    // Create documents table
    const { data: documentsData, error: documentsError } = await supabaseAdmin.from("documents").select("*").limit(1)

    if (documentsError) {
      // Table doesn't exist, create it
      await supabaseAdmin.from("documents").insert({
        id: "00000000-0000-0000-0000-000000000000",
        user_id: "00000000-0000-0000-0000-000000000000",
        file_name: "system.txt",
        file_type: "text/plain",
        file_size: 0,
        file_url: "https://example.com",
        created_at: new Date().toISOString(),
      })
    }

    // Create forms table
    const { data: formsData, error: formsError } = await supabaseAdmin.from("forms").select("*").limit(1)

    if (formsError) {
      // Table doesn't exist, create it
      await supabaseAdmin.from("forms").insert({
        id: "00000000-0000-0000-0000-000000000000",
        user_id: "00000000-0000-0000-0000-000000000000",
        form_type: "system",
        form_data: {},
        status: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    // Create document_verifications table
    const { data: verificationsData, error: verificationsError } = await supabaseAdmin
      .from("document_verifications")
      .select("*")
      .limit(1)

    if (verificationsError) {
      // Table doesn't exist, create it
      await supabaseAdmin.from("document_verifications").insert({
        id: "00000000-0000-0000-0000-000000000000",
        user_id: "00000000-0000-0000-0000-000000000000",
        document_type: "system",
        document_id: "system",
        verification_result: {},
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
    }

    // Create notifications table
    const { data: notificationsData, error: notificationsError } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .limit(1)

    if (notificationsError) {
      // Table doesn't exist, create it
      await supabaseAdmin.from("notifications").insert({
        id: "00000000-0000-0000-0000-000000000000",
        user_id: "00000000-0000-0000-0000-000000000000",
        type: "system",
        title: "System Notification",
        message: "System message",
        read: false,
        created_at: new Date().toISOString(),
      })
    }

    // Create storage bucket for legal documents
    const { error: bucketError } = await supabaseAdmin.storage.createBucket("legal_documents", {
      public: false,
      allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
      fileSizeLimit: 10485760, // 10MB
    })

    if (bucketError) {
      console.error("Error creating storage bucket:", bucketError)
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
