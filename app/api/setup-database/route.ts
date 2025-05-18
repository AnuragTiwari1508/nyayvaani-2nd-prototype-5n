import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST() {
  try {
    // Create user_profiles table
    const { error: userProfilesError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        full_name TEXT,
        phone_number TEXT,
        aadhaar_number TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    if (userProfilesError) {
      console.error("Error creating user_profiles table:", userProfilesError)
      return NextResponse.json({ error: userProfilesError.message }, { status: 500 })
    }

    // Create transcripts table
    const { error: transcriptsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS transcripts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        language TEXT NOT NULL,
        transcript TEXT NOT NULL,
        audio_duration FLOAT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    if (transcriptsError) {
      console.error("Error creating transcripts table:", transcriptsError)
      return NextResponse.json({ error: transcriptsError.message }, { status: 500 })
    }

    // Create documents table
    const { error: documentsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        file_url TEXT NOT NULL,
        language TEXT,
        summary TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    if (documentsError) {
      console.error("Error creating documents table:", documentsError)
      return NextResponse.json({ error: documentsError.message }, { status: 500 })
    }

    // Create forms table
    const { error: formsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS forms (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        form_type TEXT NOT NULL,
        form_data JSONB NOT NULL,
        original_text TEXT,
        status TEXT NOT NULL,
        tracking_id TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    if (formsError) {
      console.error("Error creating forms table:", formsError)
      return NextResponse.json({ error: formsError.message }, { status: 500 })
    }

    // Create document_verifications table
    const { error: verificationsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS document_verifications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        document_type TEXT NOT NULL,
        document_id TEXT NOT NULL,
        verification_result JSONB NOT NULL,
        verified_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    if (verificationsError) {
      console.error("Error creating document_verifications table:", verificationsError)
      return NextResponse.json({ error: verificationsError.message }, { status: 500 })
    }

    // Create notifications table
    const { error: notificationsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    if (notificationsError) {
      console.error("Error creating notifications table:", notificationsError)
      return NextResponse.json({ error: notificationsError.message }, { status: 500 })
    }

    // Enable Row Level Security on all tables
    const tables = ["user_profiles", "transcripts", "documents", "forms", "document_verifications", "notifications"]

    for (const table of tables) {
      const { error: rlsError } = await supabaseAdmin.query(`
        ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
      `)

      if (rlsError) {
        console.error(`Error enabling RLS on ${table}:`, rlsError)
        return NextResponse.json({ error: rlsError.message }, { status: 500 })
      }
    }

    // Create RLS policies
    // User profiles policies
    const { error: userProfilesSelectError } = await supabaseAdmin.query(`
      CREATE POLICY "Users can view their own profile" 
      ON user_profiles FOR SELECT 
      USING (auth.uid() = id);
    `)

    if (userProfilesSelectError) {
      console.error("Error creating user_profiles select policy:", userProfilesSelectError)
    }

    const { error: userProfilesUpdateError } = await supabaseAdmin.query(`
      CREATE POLICY "Users can update their own profile" 
      ON user_profiles FOR UPDATE 
      USING (auth.uid() = id);
    `)

    if (userProfilesUpdateError) {
      console.error("Error creating user_profiles update policy:", userProfilesUpdateError)
    }

    // Create policies for other tables
    const tablesPolicies = ["transcripts", "documents", "forms", "document_verifications", "notifications"]

    for (const table of tablesPolicies) {
      // Select policy
      const { error: selectError } = await supabaseAdmin.query(`
        CREATE POLICY "Users can view their own ${table}" 
        ON ${table} FOR SELECT 
        USING (auth.uid() = user_id);
      `)

      if (selectError) {
        console.error(`Error creating ${table} select policy:`, selectError)
      }

      // Insert policy
      const { error: insertError } = await supabaseAdmin.query(`
        CREATE POLICY "Users can insert their own ${table}" 
        ON ${table} FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
      `)

      if (insertError) {
        console.error(`Error creating ${table} insert policy:`, insertError)
      }
    }

    // Additional update policy for forms
    const { error: formsUpdateError } = await supabaseAdmin.query(`
      CREATE POLICY "Users can update their own forms" 
      ON forms FOR UPDATE 
      USING (auth.uid() = user_id);
    `)

    if (formsUpdateError) {
      console.error("Error creating forms update policy:", formsUpdateError)
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
