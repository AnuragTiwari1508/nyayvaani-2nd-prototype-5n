import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Authenticate user
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { formId, formData } = await request.json()

    if (!formId || !formData) {
      return NextResponse.json({ error: "Missing form ID or form data" }, { status: 400 })
    }

    // In a real implementation, you would submit the form to eCourt API
    // For now, we'll simulate a successful submission
    const trackingId = `NV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Update form status in Supabase
    const { error } = await supabase
      .from("forms")
      .update({
        form_data: formData,
        status: "submitted",
        tracking_id: trackingId,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Error updating form status:", error)
      return NextResponse.json({ error: "Failed to update form status" }, { status: 500 })
    }

    // Create a notification for the user
    await supabase.from("notifications").insert({
      user_id: session.user.id,
      type: "form_submission",
      title: "Form Submitted Successfully",
      message: `Your form has been submitted successfully. Tracking ID: ${trackingId}`,
      read: false,
    })

    return NextResponse.json({
      success: true,
      trackingId: trackingId,
      message: "Form submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting form:", error)
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
  }
}
