import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Authenticate user
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trackingId = params.id

    if (!trackingId) {
      return NextResponse.json({ error: "Missing tracking ID" }, { status: 400 })
    }

    // Get form data from Supabase
    const { data: formData, error } = await supabase.from("forms").select("*").eq("tracking_id", trackingId).single()

    if (error || !formData) {
      console.error("Error fetching form data:", error)
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if the user is authorized to view this application
    if (formData.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to view this application" }, { status: 403 })
    }

    // In a real implementation, you would fetch the status from eCourt API
    // For now, we'll simulate a status based on submission time
    const submittedAt = new Date(formData.submitted_at)
    const currentTime = new Date()
    const hoursSinceSubmission = (currentTime.getTime() - submittedAt.getTime()) / (1000 * 60 * 60)

    let status = "Pending"
    let statusDetails = "Your application is being processed."

    if (hoursSinceSubmission > 48) {
      status = "Under Review"
      statusDetails = "Your application is under review by the concerned authority."
    } else if (hoursSinceSubmission > 24) {
      status = "Received"
      statusDetails = "Your application has been received and is awaiting processing."
    }

    // Get application timeline
    const timeline = generateApplicationTimeline(submittedAt, status)

    return NextResponse.json({
      success: true,
      trackingId: trackingId,
      status: status,
      statusDetails: statusDetails,
      formType: formData.form_type,
      submittedAt: formData.submitted_at,
      timeline: timeline,
    })
  } catch (error) {
    console.error("Error tracking application:", error)
    return NextResponse.json({ error: "Failed to track application" }, { status: 500 })
  }
}

// Function to generate application timeline
function generateApplicationTimeline(submittedAt: Date, currentStatus: string) {
  const timeline = [
    {
      status: "Submitted",
      date: submittedAt.toISOString(),
      details: "Your application has been submitted successfully.",
    },
  ]

  const currentTime = new Date()
  const hoursSinceSubmission = (currentTime.getTime() - submittedAt.getTime()) / (1000 * 60 * 60)

  if (hoursSinceSubmission > 24) {
    timeline.push({
      status: "Received",
      date: new Date(submittedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      details: "Your application has been received and is awaiting processing.",
    })
  }

  if (hoursSinceSubmission > 48) {
    timeline.push({
      status: "Under Review",
      date: new Date(submittedAt.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      details: "Your application is under review by the concerned authority.",
    })
  }

  return timeline
}
