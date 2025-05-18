import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log("Setting up database...")

  try {
    // Create user_profiles table
    console.log("Creating user_profiles table...")
    const { error: userProfilesError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "user_profiles",
      table_definition: `
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        full_name TEXT,
        phone_number TEXT,
        aadhaar_number TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `,
    })
    if (userProfilesError) throw userProfilesError

    // Create transcripts table
    console.log("Creating transcripts table...")
    const { error: transcriptsError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "transcripts",
      table_definition: `
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        language TEXT NOT NULL,
        transcript TEXT NOT NULL,
        audio_duration FLOAT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `,
    })
    if (transcriptsError) throw transcriptsError

    // Create documents table
    console.log("Creating documents table...")
    const { error: documentsError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "documents",
      table_definition: `
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        file_url TEXT NOT NULL,
        language TEXT,
        summary TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `,
    })
    if (documentsError) throw documentsError

    // Create forms table
    console.log("Creating forms table...")
    const { error: formsError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "forms",
      table_definition: `
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
      `,
    })
    if (formsError) throw formsError

    // Create document_verifications table
    console.log("Creating document_verifications table...")
    const { error: verificationsError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "document_verifications",
      table_definition: `
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        document_type TEXT NOT NULL,
        document_id TEXT NOT NULL,
        verification_result JSONB NOT NULL,
        verified_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `,
    })
    if (verificationsError) throw verificationsError

    // Create notifications table
    console.log("Creating notifications table...")
    const { error: notificationsError } = await supabase.rpc("create_table_if_not_exists", {
      table_name: "notifications",
      table_definition: `
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `,
    })
    if (notificationsError) throw notificationsError

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Error setting up database:", error)
  }
}

setupDatabase()
