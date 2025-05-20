import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    // Get the Supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Validate credentials
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    // Create a Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the request body
    const { fullName, email, phone, password } = await request.json()

    // Validate required fields
    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the user with Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      phone,
      user_metadata: {
        full_name: fullName,
      },
    })

    if (userError) {
      console.error("Error creating user:", userError)
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    // Create user profile if user was created successfully
    if (userData.user) {
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: userData.user.id,
        full_name: fullName,
        phone_number: phone,
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
        // We don't return an error here since the user was already created
      }
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: userData.user,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
